from django.contrib.admin import AdminSite as DefaultAdminSite


class AdminSite(DefaultAdminSite):
    site_header = "Cosmic Tracer API Admin"


admin_site = AdminSite(name="cosmic_tracer_api_admin")
