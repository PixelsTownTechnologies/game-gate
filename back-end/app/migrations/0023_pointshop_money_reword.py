# Generated by Django 2.2.5 on 2021-03-23 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_pointshop'),
    ]

    operations = [
        migrations.AddField(
            model_name='pointshop',
            name='money_reword',
            field=models.FloatField(blank=True, null=True),
        ),
    ]