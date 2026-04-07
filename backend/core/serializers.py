#!/usr/bin/env python
# Author : Panni
import re
from rest_framework import serializers
from django.contrib.auth import get_user_model


class ApiErrorResponseSerializer(serializers.Serializer):
    """Serializer for user registration errors"""
    message = serializers.CharField()
    errors = serializers.JSONField(required=False)


class RegistrationRequestSerializer(serializers.Serializer):
    """Serializer for user registration request"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class RegistrationResponseSerializer(serializers.Serializer):
    """Serializer for user registration response"""
    id = serializers.IntegerField()
    email = serializers.EmailField()


# Model serializers
class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user object"""

    password = serializers.CharField(
        write_only=True, style={'input_type': 'password'})

    class Meta:
        model = get_user_model()
        fields = ('email', 'password')
        read_only_fields = ('id',)

    @staticmethod
    def validate_password(value: str):
        """validate the password"""
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters")
        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                "Password must contain at least one digit"
            )
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter"
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter"
            )
        return value

    def create(self, validated_data):
        """Create and return a new `user` with an email and password."""
        return self.Meta.model.objects.create_user(**validated_data)
