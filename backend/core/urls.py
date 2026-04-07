from django.urls import path
from drf_spectacular.views import (
    SpectacularSwaggerView, SpectacularRedocView, SpectacularAPIView)
from core import views


app_name = 'core'
urlpatterns = [
    path('health-check/', views.health_check, name='health-check'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path(
        'schema/swagger-ui/'
        , SpectacularSwaggerView.as_view(url_name='core:schema')
        , name='swagger-ui'),
    path(
        'schema/redoc/'
        , SpectacularRedocView.as_view(url_name='core:schema')
        , name='redoc'),
    path(
        'registration/'
        , views.UserRegistrationView.as_view()
        , name='registration'),
    path(
        'login/'
        , views.UserLoginView.as_view()
        , name='login'),
]
