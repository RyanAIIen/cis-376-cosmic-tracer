from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError


User = get_user_model()


class UserModelTests(TestCase):
    def test_create_user_with_email(self):
        user = User.objects.create_user(
            email='user@example.com', password='goblue12345!!'
        )
        self.assertEqual(user.email, 'user@example.com')
        self.assertTrue(user.check_password('goblue12345!!'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(
            email='foyzul@example.com', password='cis376'
        )
        self.assertEqual(superuser.email, 'foyzul@example.com')
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.check_password('cis376'))

    def test_email_is_required(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email=None, password='pass')

    def test_superuser_requires_is_staff_true(self):
        with self.assertRaisesMessage(
            ValueError, "Superuser must have is_staff=True."
        ):
            User.objects.create_superuser(
                email='bad@example.com', password='pass', is_staff=False
            )

    def test_superuser_requires_is_superuser_true(self):
        with self.assertRaisesMessage(
            ValueError, "Superuser must have is_superuser=True."
        ):
            User.objects.create_superuser(
                email='bad@example.com', password='pass', is_superuser=False
            )

    def test_user_str_returns_name_or_email(self):
        user = User.objects.create_user(
            email='visible@example.com', password='pass'
        )
        self.assertEqual(str(user), 'visible@example.com')

        user.first_name = 'Cosmic'
        user.last_name = 'Tracer'
        user.save()
        self.assertEqual(str(user), 'Cosmic Tracer')
