from django.db import IntegrityError
from django.http import JsonResponse
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from core.serializers import (
    RegistrationRequestSerializer, RegistrationResponseSerializer
    , ApiErrorResponseSerializer, UserCreateSerializer
    , LoginRequestSerializer, CustomTokenSerializer
)


# Create your views here.
def health_check(request):
    return JsonResponse(
        {
            'version': settings.SPECTACULAR_SETTINGS['VERSION']
            , 'status': 'ok'
            , 'message': 'Backend is up and running'
        })


class UserRegistrationView(APIView):
    """
    User registration view
    """
    permission_classes = (AllowAny,)

    @extend_schema(
        operation_id='registerUser',
        methods=['post'],
        summary='Register a new user',
        description="""
        This endpoint helps to create a new user by taking email and password
        as inputs
        """,
        tags=['Registration'],
        request=RegistrationRequestSerializer,
        responses={
            201 : RegistrationResponseSerializer,
            400 : ApiErrorResponseSerializer,
            500 : ApiErrorResponseSerializer,
        },
        examples=[
            OpenApiExample(
                "Valid request",
                value={
                    "email": "sample@gmail.com",
                    "password": "StrongPass123",
                },
                request_only=True,
            ),
            OpenApiExample(
                "Success Response",
                value={
                    "id": 1,
                    "email": "sample@gmail.com",
                },
                response_only=True,
                status_codes=[201]
            ),
            OpenApiExample(
                "Validation Failed",
                value={
                    "message": "Validation Failed",
                    "error": {"email": ["This field is required."]},
                },
                response_only=True,
                status_codes=[400]
            ),
            OpenApiExample(
                "Unknown Failure",
                value={
                    "message": "Something went wrong",
                    "error": "application failed",
                },
                response_only=True,
                status_codes=[500]
            ),
        ],
    )
    def post(self, request, *args, **kwargs):
        """
        POST /user/registration
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        serializer = UserCreateSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response(
                data={
                    'id': user.id,
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )
        except ValidationError as exp:
            return Response(
                data=ApiErrorResponseSerializer({
                    "message": "Validation Error",
                    "errors": exp.detail,
                }).data,
                status=status.HTTP_400_BAD_REQUEST
            )
        except IntegrityError as exp:
            return Response(
                data=ApiErrorResponseSerializer({
                    "message": "Database Integrity error",
                    "errors": str(exp),
                }).data,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as exp:
            return Response(
                data=ApiErrorResponseSerializer({
                    "message": "Something went wrong",
                    "errors": str(exp),
                }).data,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# User Login
class UserLoginView(APIView):
    """User login view"""
    permission_classes = (AllowAny,)

    @extend_schema(
        operation_id='loginUser',
        methods=['post'],
        summary='Login a user',
        description="""
        User login endpoint takes email and password as inputs""",
        tags=['Login'],
        request=LoginRequestSerializer,
        responses={
            200: CustomTokenSerializer,
            400: ApiErrorResponseSerializer,
            401: ApiErrorResponseSerializer,
            500: ApiErrorResponseSerializer,
        },
        examples=[
            OpenApiExample(
                "Valid request",
                value={
                    "email": "sample@gmail.com",
                    "password": "StrongPass123",
                },
                request_only=True,
            ),
            OpenApiExample(
                "Success Response",
                value={
                    "access": "jsfhbsjhsjbj.sldgnsdnjdskdsbdfn.slfnjsdndvjdsj",
                    "refresh": "jsfhbsjhsjbj.sldgnsdnjdskdsbdfn.slfnjsdndvjdsj",
                },
                response_only=True,
                status_codes=[200]
            ),
            OpenApiExample(
                "Validation Failed",
                value={
                    "message": "Validation Failed",
                    "error": {"email": ["This field is required."]},
                },
                response_only=True,
                status_codes=[400]
            ),
            OpenApiExample(
                "Unauthorised Error",
                value={
                    "message": "Login failed",
                    "error": "invalid login details",
                },
                response_only=True,
                status_codes=[401]
            ),
            OpenApiExample(
                "Unknown Failure",
                value={
                    "message": "Something went wrong",
                    "error": "application failed",
                },
                response_only=True,
                status_codes=[500]
            ),
        ],
    )
    def post(self, request, *args, **kwargs):
        """User login endpoint"""
        serializer = CustomTokenSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            return Response(
                data=serializer.validated_data,
                status=status.HTTP_200_OK,
            )
        except AuthenticationFailed as exp:
            return Response(
                data=ApiErrorResponseSerializer(
                    {
                        "message": "Authentication Failed",
                        "errors": exp.detail,
                    }
                ).data,
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except ValidationError as exp:
            return Response(
                data=ApiErrorResponseSerializer(
                    {
                        "message": "Validation Error",
                        "errors": exp.detail,
                    }
                ).data,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exp:
            return Response(
                data=ApiErrorResponseSerializer(
                    {
                        "message": "Something went wrong",
                        "errors": str(exp),
                    }
                ).data,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
