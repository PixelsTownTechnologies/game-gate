# Generated by Django 2.2.5 on 2021-03-01 01:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_order_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='points',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
