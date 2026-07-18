#!/usr/bin/env python
# Author : Panni
import pytest
from django.contrib.auth import get_user_model
from django.test import TestCase
from core import models


class TestCustomUser(TestCase):
    """
    Test cases for custom user model
    """

    def setUp(self):
        self.email = 'sample@gmail.com'
        self.password = 'StrongPass123'
        self.model = get_user_model()

    def test_create_user(self):
        """
        Test creating a new user
        """
        user = self.model.objects.create_user(
            email=self.email, password=self.password)
        self.assertIsNotNone(user)
        self.assertEqual(user.email, self.email)
        self.assertTrue(user.check_password(self.password))
        self.assertTrue(user.is_active, 'User is not active')

    def test_create_user_without_email(self):
        """
        Test user creation without email
        """
        with pytest.raises(ValueError):
            self.model.objects.create_user(
                email=None, password=self.password)

    def test_create_user_without_password(self):
        """
        Test user creation without password
        """
        with pytest.raises(ValueError):
            self.model.objects.create_user(
                email=self.email, password=None)

    def test_normalize_email_method_call(self):
        """
        Test user creation without email
        """
        email = 'SampleEmail@Email.com'
        user = self.model.objects.create_user(
            email=email, password=self.password)
        self.assertEqual(user.email, 'SampleEmail@email.com')



class TestAccountModel(TestCase):
     """ Test account model """

     def setUp(self):
         self.model = models.AccountModel

     def test_model_string(self):
         """Test model string method"""
         account = self.model(
             name="Test Account",
         )
         self.assertEqual(str(account), "Test Account")

     def test_model_creation_with_defaults(self):
         """Test model creation with default values"""
         account = self.model(
             name="Test Account",
         )
         account.save()
         self.assertEqual(account.name, "Test Account")
         self.assertEqual(account.balance, 0)
         self.assertIsNone(account.description)
         self.assertIsNotNone(account.created_at)
         self.assertIsNotNone(account.updated_at)

