# Generated by Django 2.2.5 on 2021-03-22 21:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_auto_20210319_1257'),
    ]

    operations = [
        migrations.CreateModel(
            name='PointShop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point_cost', models.IntegerField(blank=True, null=True)),
                ('name', models.CharField(blank=True, max_length=128, null=True)),
                ('quantity', models.IntegerField(blank=True, default=1, null=True)),
                ('game_card', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='app.GameCard')),
            ],
        ),
    ]