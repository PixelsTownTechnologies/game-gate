# Generated by Django 2.2.5 on 2021-02-24 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20210224_0259'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamecard',
            name='show',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
    ]
