#!/usr/bin/env python
# Author : Panni
from unittest.mock import patch
from django.urls import reverse
from django.test import TestCase
from django.conf import settings
from django.db import IntegrityError
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model


class TestHealthCheck(TestCase):
    """Test cases for health check endpoint"""
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('core:health-check')

    def test_health_check_success(self):
        """Test health check endpoint returns correct response"""
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "ok")
        self.assertEqual(
            response.json()["version"],
            settings.SPECTACULAR_SETTINGS["VERSION"]
        )


class TestUserRegistration(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('core:registration')
        self.user_model = get_user_model()

    def test_user_registration(self):
        """User registration success scenario"""
        payload = {
            'email': 'test@gmail.com',
            'password': 'Test@123!',
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = self.user_model.objects.get(email=payload['email'])
        self.assertIsNotNone(user, 'User is not created')
        self.assertTrue(user.check_password(payload['password']))
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['email'], user.email)
        self.assertNotIn('password', response.data)

    def test_missing_email(self):
        """User registration without email scenario"""
        payload = {
            "password": "Test@1234"
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", res.data["message"])

    def test_empty_email(self):
        payload = {
            "email": "",
            "password": "Test@1234"
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_email_format(self):
        payload = {
            "email": "invalid-email",
            "password": "Test@1234"
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", res.data["message"])

    def test_missing_password(self):
        payload = {
            "email": "test3@example.com"
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", res.data["message"])

    def test_user_registration_internal_server_error(self):
        """Test API returns 500 when unexpected exception occurs"""
        payload = {
            "email": "test@example.com",
            "password": "Test@1234",
            "full_name": "Test User"
        }

        with patch(
                "core.serializers.UserCreateSerializer.save",
                side_effect=Exception("Unexpected error")
        ):
            response = self.client.post(self.url, payload)

        self.assertEqual(
            response.status_code,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertIn("Something went wrong", response.data["message"])

    @patch("core.serializers.UserCreateSerializer.save")
    def test_user_registration_integrity_error(self, mock_save):
        """Test API handles IntegrityError properly"""

        mock_save.side_effect = IntegrityError("DB error")

        payload = {
            "email": "test@example.com",
            "password": "Test@1234"
        }

        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["message"],
            "Database integrity error"
        )
