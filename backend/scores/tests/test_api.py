from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from scores.models import Score

User = get_user_model()


class ScoreAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com', password='testpass'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_score_via_api(self):
        payload = {'score': 250, 'time_played': 60}
        response = self.client.post('/api/scores/submit/', payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Score.objects.count(), 1)
        score = Score.objects.first()
        self.assertEqual(score.score, 250)
        self.assertEqual(score.time_played, 60)
        self.assertEqual(score.user, self.user)

    def test_leaderboard_returns_scores_descending(self):
        Score.objects.create(user=self.user, score=100, time_played=45)
        Score.objects.create(user=self.user, score=300, time_played=30)

        response = self.client.get('/api/scores/leaderboard/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertGreaterEqual(data[0]['score'], data[1]['score'])

    def test_unauthenticated_score_submit_fails(self):
        self.client.logout()
        response = self.client.post(
            '/api/scores/submit/', {'score': 100, 'time_played': 20}
        )
        self.assertEqual(response.status_code, 401)
