"""
Django settings for main project.
https://docs.djangoproject.com/en/5.0/topics/settings/
https://docs.djangoproject.com/en/5.0/ref/settings/
https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/
"""

import os
import sys
from pathlib import Path

import dj_database_url
from dotenv import dotenv_values


def split_env(env, delimiter=','):
    if env:
        return env.split(delimiter)
    else:
        return []


BASE_DIR = Path(__file__).resolve().parent.parent

envs = {
    'CI': 'ci',
    'DEV': 'development',
    'PROD': 'production',
}

CI = os.getenv('GITHUB_WORKFLOW')
ENVIRONMENT = envs['CI'] if CI else os.getenv('ENVIRONMENT', envs['DEV'])

config = (
    {
        **dotenv_values(".env.dev"),  # allowed in version control
        **dotenv_values(".env.dev-secret"),  # not allowed in version control
        **os.environ,
    }
    if ENVIRONMENT == envs['DEV']
    else os.environ
)

SECRET_KEY = config.get('SECRET_KEY')
if not SECRET_KEY and ENVIRONMENT in [envs['DEV'], envs['CI']]:
    # NOT FOR PRODUCTION USE
    SECRET_KEY = (
        "Zero Gravity, Maximum Adventure—your ticket to the final frontier!"
    )

DEBUG = config.get('DEBUG') == 'True'

DOMAIN = config.get('DOMAIN')

ALLOWED_HOSTS = split_env(config.get('ALLOWED_HOSTS'))


# Application definition

SITE_NAME = 'Cosmic Tracer API'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #
    # Third-party apps
    'corsheaders',
    'djoser',
    'rest_framework',
    'social_django',
    'storages',
    #
    # Cosmic Tracer apps
    'users',
    'scores',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    #
    # https://pypi.org/project/django-cors-headers/#setup
    'corsheaders.middleware.CorsMiddleware',
    #
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'main' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases


if CI:
    default_db = {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'postgres',
        'PORT': 5432,
        'NAME': 'ci_db',
        'USER': 'ci_db_user',
        'PASSWORD': 'ci_db_pw',
    }
elif (
    ENVIRONMENT != envs['DEV']
    and len(sys.argv) > 0
    and sys.argv[1] != 'collectstatic'
):
    if os.getenv("DATABASE_URL", None) is None:
        raise Exception("DATABASE_URL environment variable not defined")
    default_db = dj_database_url.parse(config.get("DATABASE_URL"))
else:
    default_db = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }

DATABASES = {'default': default_db}


# Django REST Framework (DRF)
# https://www.django-rest-framework.org/

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ],
}


# Authentication
# https://docs.djangoproject.com/en/5.0/topics/auth/

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

AUTH_USER_MODEL = 'users.User'
AUTH_SUPERUSER_EMAIL = config.get('AUTH_SUPERUSER_EMAIL')
AUTH_SUPERUSER_PASSWORD = config.get('AUTH_SUPERUSER_PASSWORD')

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Djoser
# https://djoser.readthedocs.io/en/latest/settings.html

DJOSER = {
    'LOGIN_FIELD': 'email',
    'TOKEN_MODEL': None,
    #
    'ACTIVATION_URL': 'activation/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_URL': 'reset-password/{uid}/{token}',
    #
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': True,
    'SET_PASSWORD_RETYPE': True,
    'USER_CREATE_PASSWORD_RETYPE': True,
    #
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': split_env(
        config.get('SOCIAL_AUTH_ALLOWED_REDIRECT_URIS')
    ),
}

AUTH_COOKIE = 'access'
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24  # 1 day
AUTH_COOKIE_PATH = '/'
AUTH_COOKIE_SAMESITE = 'None'

# Always set to True
AUTH_COOKIE_HTTP_ONLY = True
# Always set to True outside of the development environment
AUTH_COOKIE_SECURE = ENVIRONMENT != envs['DEV']


# Python Social Auth
# https://python-social-auth.readthedocs.io/en/latest/configuration

SOCIAL_AUTH_JSONFIELD_ENABLED = ENVIRONMENT != envs['DEV']
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = config.get('GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = config.get('GOOGLE_OAUTH2_SECRET')
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ['first_name', 'last_name']
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# django-cors-headers
# https://github.com/adamchainz/django-cors-headers?tab=readme-ov-file#configuration

CORS_ALLOWED_ORIGINS = split_env(config.get('CORS_ALLOWED_ORIGINS'))
CORS_ALLOW_CREDENTIALS = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATICFILES_DIRS = (os.path.join(BASE_DIR, 'main/static/'),)

if ENVIRONMENT == envs['DEV']:
    STATIC_URL = 'static/'
    STATIC_ROOT = BASE_DIR / '.static'

    MEDIA_URL = 'media/'
    MEDIA_ROOT = BASE_DIR / '.media'
else:
    AWS_S3_ACCESS_KEY_ID = config.get('AWS_S3_ACCESS_KEY_ID')
    AWS_S3_SECRET_ACCESS_KEY = config.get('AWS_S3_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = config.get('AWS_S3_REGION_NAME')
    AWS_S3_ENDPOINT_URL = (
        f'https://{AWS_S3_REGION_NAME}.digitaloceanspaces.com'
    )
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
    AWS_DEFAULT_ACL = 'public-read'
    AWS_LOCATION = 'static'
    AWS_MEDIA_LOCATION = 'media'
    AWS_S3_CUSTOM_DOMAIN = config.get('AWS_S3_CUSTOM_DOMAIN')
    STORAGES = {
        'default': {'BACKEND': 'main.storages.S3Boto3Storage'},
        'staticfiles': {
            'BACKEND': 'storages.backends.s3boto3.S3StaticStorage'
        },
    }


# Email
# https://docs.djangoproject.com/en/5.0/topics/email

if ENVIRONMENT == envs['DEV']:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = 'django_ses.SESBackend'
    USE_SES_V2 = True

    AWS_SES_ACCESS_KEY_ID = config.get('AWS_SES_ACCESS_KEY_ID')
    AWS_SES_SECRET_ACCESS_KEY = config.get('AWS_SES_SECRET_ACCESS_KEY')

    AWS_SES_REGION_NAME = config.get('AWS_SES_REGION_NAME')
    AWS_SES_REGION_ENDPOINT = f'email.{AWS_SES_REGION_NAME}.amazonaws.com'

    AWS_SES_FROM_EMAIL = config.get('AWS_SES_FROM_EMAIL')
    DEFAULT_FROM_EMAIL = AWS_SES_FROM_EMAIL


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
