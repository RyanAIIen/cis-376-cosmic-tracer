from django.contrib import admin
from .models import Score

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'score')
    ordering = ('-score',) 