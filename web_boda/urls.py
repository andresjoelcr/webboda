from django.contrib import admin
from django.urls import include, path, re_path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.urls')),
    re_path(r'^(?!static/|media/).*$', views.app, name='app'),
]
