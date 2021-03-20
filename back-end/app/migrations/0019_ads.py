# Generated by Django 2.2.5 on 2021-03-14 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_order_ship_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ads',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cover', models.ImageField(blank=True, null=True, upload_to='ads/files')),
                ('external_link', models.TextField(blank=True, null=True)),
                ('forward_id', models.CharField(blank=True, max_length=16, null=True)),
                ('type', models.CharField(blank=True, max_length=16, null=True)),
            ],
        ),
    ]
