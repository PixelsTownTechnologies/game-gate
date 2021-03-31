# Generated by Django 2.2.5 on 2021-03-29 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_auto_20210328_0204'),
    ]

    operations = [
        migrations.AddField(
            model_name='accessory',
            name='dealer_price',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='accessory',
            name='quantity_notification',
            field=models.IntegerField(blank=True, default=20, null=True),
        ),
        migrations.AddField(
            model_name='gamecard',
            name='dealer_price',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='gamecard',
            name='quantity_notification',
            field=models.IntegerField(blank=True, default=20, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='dealer',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]