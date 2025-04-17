from django.urls import path
from .views import SubmitScoreView, LeaderboardView

urlpatterns = [
    path('submit/', SubmitScoreView.as_view(), name='submit-score'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
] 