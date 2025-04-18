from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from scores.models import Score

User = get_user_model()


class ScoreModelTests(TestCase):
    def test_create_score(self):
        user = User.objects.create_user(
            email='player@example.com', password='test123'
        )
        score = Score.objects.create(user=user, score=120, time_played=45)

        self.assertEqual(score.score, 120)
        self.assertEqual(score.time_played, 45)
        self.assertEqual(str(score), f"{user}: 120 pts (45s)")

    def test_score_must_be_non_negative(self):
        user = User.objects.create_user(
            email='negative@example.com', password='test123'
        )
        score = Score(user=user, score=-5, time_played=30)

        with self.assertRaises(ValidationError):
            score.full_clean()
