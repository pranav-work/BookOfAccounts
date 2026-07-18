# Create your models here.
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager,
)


class CustomUserManager(BaseUserManager):
    """Custom user model manager where email is the unique identifier"""

    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a User with the given email and password."""
        if not email:
            raise ValueError('Users must have an email address')
        if not password:
            raise ValueError('Password must be provided')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class AccountsManager(models.Manager):
    """Accounts manager"""

    def create_account(self, name, balance, **kwargs):
       """create a new account"""
       if not name:
           raise ValueError("Account name must be provided")
       if not balance:
           raise ValueError("Account balance must be provided")
       elif balance < 0:
           raise ValueError("Account balance must be positive")


class AccountModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountsManager()

    def __str__(self):
        return self.name

    def credit(self, amount):
        """Credit amount"""
        if amount < 0:
            raise ValueError("Credit amount must be positive")
        self.balance += amount

    def debit(self, amount):
        """Debit amount"""
        if amount < 0 :
            raise ValueError("Debit amount must be positive")
        if amount > self.balance:
            raise ValueError("Debit amount exceeds balance. Please enter valid")
        self.balance -= amount