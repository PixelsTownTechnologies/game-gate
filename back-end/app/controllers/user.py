from django.contrib.auth.models import (Group)
from rest_framework import generics
from rest_framework import mixins
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.constants import POST_REQUEST
from app.models import (User, Country, Notification)
from app.resources import (create_notification, send_reset_password_email, get_random_string, send_phone_message)
from app.serializers.user import (UserSerializer, UserAdminSerializer, GroupSerializer)


@api_view(POST_REQUEST)
def check_token(request):
    token = request.data.get('token', '')
    token_object = Token.objects.filter(key=token).first()
    if token_object is None:
        return Response(status=200, data={'valid': False})
    user = token_object.user
    return Response(status=200, data={'valid': True,
                                      'user': UserSerializer(user).data
                                      })


@api_view(POST_REQUEST)
def check_email(request):
    email = request.data.get('email', '')
    user = User.objects.filter(email=email).first()
    return Response(status=200, data={'used': user is not None})


class AuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user.is_login = True
        user.save()
        create_notification(user, 'New Login In Your Account')
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LogoutUser(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        for token in Token.objects.filter(user=request.user):
            token.delete()
        request.user.is_login = False
        request.user.save()
        create_notification(request.user, 'New Logout In Your Account')
        return Response(status=200)


class AdminUser(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer


class AdminUserFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer

    def create(self, request, *args, **kwargs):
        validated_data = request.data
        email = validated_data.get('email', '')
        if len(User.objects.filter(email=email)) > 0:
            return Response({'errors': 'userNameUsed'})
        country = validated_data.get('country', None)
        if country is not None:
            validated_data.pop('country')
        user = User.objects.create_user(**validated_data)
        if country is not None and Country.objects.filter(name=country['name']) is not None and len(
                Country.objects.filter(name=country['name'])) > 0:
            user.country_id = Country.objects.filter(name=country['name'])[0].id
        if Group.objects.filter(name='User').first() is not None:
            user.groups.add(Group.objects.get(name='User'))
        user.save()
        create_notification(user, 'Welcome In Coins Gate')
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class AdminListGroups(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class AdminChangeGroups(generics.UpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def update(self, request, *args, **kwargs):
        user_id = kwargs.get('pk', None)
        group_list = request.data.get('groups', None)
        if user_id is None or group_list is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(pk=user_id).first()
        groups = Group.objects.filter(id__in=group_list)
        user.groups.set(groups)
        user.save()
        create_notification(user, 'Your Permissions Was Changed')
        return Response(status=status.HTTP_200_OK, data=UserAdminSerializer(user).data)


class ChangePasswordUser(mixins.RetrieveModelMixin, generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        password = request.data.get('newPassword', None)
        current_password = request.data.get('currentPassword', None)
        user = request.user
        errors = []
        if password is None:
            errors.append({'newPassword': 'This field is required'})
        if current_password is None:
            errors.append({'currentPassword': 'This field is required'})
        if not user.check_password(current_password):
            errors.append({'currentPassword': 'Old Password not correct'})
        if len(errors) < 1:
            user.set_password(password)
            user.save()
            create_notification(user, 'Your Password Was Changed')
            return Response(status=200, data={})
        return Response(status=400, data={'errors': errors})


class UserUpdateData(generics.UpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        instance = self.request.user
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        create_notification(request.user, 'Your Information Was Changed')
        return Response(serializer.data)


@api_view(['POST'])
def reset_code_view(request):
    reset_code = get_random_string(8)
    request_email = request.data.get("email", None)
    errors = []
    if request_email is None:
        errors.append({'email': 'This field is required'})
    if len(User.objects.filter(email=request_email)) < 1:
        errors.append({'email': 'This email not used'})
    if len(errors) > 0:
        return Response(status=400, data={"error": errors})
    send_reset_password_email(reset_code, request_email)
    user = User.objects.filter(email=request_email)[0]
    send_phone_message(user.phone,
                       user.zip_code,
                       'Your Reset Password Code is: {}'.format(reset_code))
    user.code = reset_code
    user.is_reset_code = True
    user.save()
    Notification.objects.create(user=user,
                                title='Password reset code was send to your email').save()
    print(reset_code)
    return Response(status=200, data={'send': True})


@api_view(['POST'])
def check_reset_code(request):
    reset_code = request.data.get('code', None)
    email = request.data.get('email', None)
    if email is None or reset_code is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user_list = User.objects.filter(email=email)
    if len(user_list) < 1:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    if len(user_list.filter(code=reset_code)) < 1:
        #user_list[0].code = get_random_string(100)
        #user_list[0].is_reset_code = False
        user_list[0].save()
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    return Response(status=200, data={'valid': True})


@api_view(['POST'])
def change_password_view(request):
    request_email = request.data.get("email", None)
    request_password = request.data.get("password", None)
    request_reset_code = request.data.get("code", None)
    errors = []
    if request_email is None:
        errors.append({'email': 'This field is required'})
    if request_password is None:
        errors.append({'password': 'This field is required'})
    if request_reset_code is None:
        errors.append({'code': 'This field is required'})
    if len(User.objects.filter(email=request_email, is_reset_code=True)) < 1:
        errors.append({'email': 'This email not used'})
    if len(User.objects.filter(email=request_email, is_reset_code=True)) > 0:
        if User.objects.filter(email=request_email, is_reset_code=True)[0].code != request_reset_code:
            errors.append({'code': 'Invalid reset code'})
    if len(errors) > 0:
        if len(User.objects.filter(email=request_email)) > 0:
            User.objects.filter(email=request_email)[0].code = get_random_string(100)
            User.objects.filter(email=request_email)[0].is_reset_code = False
            User.objects.filter(email=request_email)[0].save()
        return Response(status=400, data={"error": errors})
    user = User.objects.filter(email=request_email, is_reset_code=True)[0]
    user.set_password(request_password)
    user.code = get_random_string(100)
    user.is_reset_code = False
    user.save()
    Notification.objects.create(user=user,
                                title='Your Password has been changed').save()
    return Response(status=200, data={'completed': True})
