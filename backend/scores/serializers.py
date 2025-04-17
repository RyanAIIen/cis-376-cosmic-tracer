from rest_framework import serializers
from .models import Score

class ScoreSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Score
        fields = ['id', 'score', 'time_played', 'created_at', 'username']
        read_only_fields = ['created_at']
    
    def get_username(self, obj):
        return obj.user.email 