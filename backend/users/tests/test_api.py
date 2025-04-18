from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()


class JWTAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com', password='password123'
        )

    def test_token_obtain_sets_cookies(self):
        response = self.client.post(
            '/jwt/create/',
            {'email': 'test@example.com', 'password': 'password123'},
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.cookies)
        self.assertIn('refresh', response.cookies)

    def test_token_refresh_from_cookie(self):
        response = self.client.post(
            '/jwt/create/',
            {'email': 'test@example.com', 'password': 'password123'},
        )
        refresh_token = response.cookies['refresh'].value

        self.client.cookies['refresh'] = refresh_token
        refresh_response = self.client.post('/jwt/refresh/', {})

        self.assertEqual(refresh_response.status_code, 200)
        self.assertIn('access', refresh_response.cookies)

    def test_token_verify_from_cookie(self):
        response = self.client.post(
            '/jwt/create/',
            {'email': 'test@example.com', 'password': 'password123'},
        )
        access_token = response.cookies['access'].value

        self.client.cookies['access'] = access_token
        verify_response = self.client.post('/jwt/verify/', {})

        self.assertEqual(verify_response.status_code, 200)

    def test_logout_clears_cookies(self):
        self.client.cookies['access'] = 'dummy'
        self.client.cookies['refresh'] = 'dummy'

        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.cookies['access']['max-age'], 0)
        self.assertEqual(response.cookies['refresh']['max-age'], 0)
