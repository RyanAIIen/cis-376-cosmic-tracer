# Generated by Django 5.2 on 2025-04-17 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scores', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='time_played',
            field=models.IntegerField(default=0),
        ),
    ]
