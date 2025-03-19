from django.urls import path, re_path
from .views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    LogoutView,
    ProviderAuthView,
)

urlpatterns = [
    path('jwt/create/', TokenObtainPairView.as_view()),
    path('jwt/refresh/', TokenRefreshView.as_view()),
    path('jwt/verify/', TokenVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
    re_path(
        r'^o/(?P<provider>\S+)/$',
        ProviderAuthView.as_view(),
        name='provider-auth',
    ),
]
