#!/usr/bin/env python
# Author : Panni
import pytest
from django.test import TestCase
from rest_framework import serializers
from core.serializers import UserCreateSerializer


class TestUserSerializer(TestCase):
    """Test user serializer"""
    def setUp(self):
        self.email = 'sample@gmail.com'
        self.password = 'StrongPass123'

    def test_serializer_with_proper_data(self):
        """Test user creation serializer"""
        data = {'email': self.email, 'password': self.password}
        serializer = UserCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsNotNone(user)
        self.assertIsNotNone(user.id)
        self.assertEqual(user.email, self.email)
        self.assertTrue(user.check_password(self.password))

    def test_serializer_without_email_in_data(self):
        """Test user creation with invalid / no email in data"""
        data = {'email': '', 'password': self.password}
        serializer = UserCreateSerializer(data=data)
        with pytest.raises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_serializer_without_password_in_data(self):
        """Test user creation with no password in data"""
        data = {'email': self.email, 'password': ''}
        serializer = UserCreateSerializer(data=data)
        with pytest.raises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_serializer_with_less_length_password(self):
        """Test user creation with small password"""
        data = {'email': self.email, 'password': 'Stg123'}
        serializer = UserCreateSerializer(data=data)
        with pytest.raises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_serializer_without_uppercase_password(self):
        """Test user creation without uppercase in password"""
        data = {'email': self.email, 'password': 'strong123'}
        serializer = UserCreateSerializer(data=data)
        with pytest.raises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_serializer_without_lowercase_password(self):
        """Test user creation without lowercase in password"""
        data = {'email': self.email, 'password': 'STRONG123'}
        serializer = UserCreateSerializer(data=data)
        with pytest.raises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_serializer_without_number_in_password(self):
        """Test user creation without number in password"""
        data = {'email': self.email, 'password': 'StrongPass'}
        serializer = UserCreateSerializer(data=data)
        with pytest.raises(serializers.ValidationError):
            serializer.is_valid(raise_exception=True)
