from django.contrib import admin
from django.contrib.auth.admin import (
    UserAdmin as DefaultUserAdmin,
    GroupAdmin as DefaultGroupAdmin,
)
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _
from social_django.models import Association, Nonce, UserSocialAuth

from main.admin import admin_site
from .forms import GroupAdminForm
from .models import User

admin_site.register(Association, site=admin_site)
admin_site.register(Nonce, site=admin_site)
admin_site.register(UserSocialAuth, site=admin_site)


@admin.register(User, site=admin_site)
class UserAdmin(DefaultUserAdmin):
    '''
    https://github.com/django/django/blob/master/django/contrib/auth/admin.py#L44
    '''

    fieldsets = (
        (
            _("Login info"),
            {"fields": ("email", "password")},
        ),
        (
            _("Personal info"),
            {"fields": ("first_name", "last_name")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide"), "fields": ("password1", "password2")}),
    )
    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_active",
        "is_staff",
    )
    search_fields = ("email" "first_name", "last_name")
    ordering = ("email",)


admin.site.unregister(Group)


@admin.register(Group, site=admin_site)
class GroupAdmin(DefaultGroupAdmin):
    '''
    https://github.com/django/django/blob/master/django/contrib/auth/admin.py#L29
    '''

    form = GroupAdminForm
