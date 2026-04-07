from django.db import IntegrityError
from django.http import JsonResponse
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from core.serializers import (
    RegistrationRequestSerializer, RegistrationResponseSerializer
    , UserCreateSerializer
)


# Create your views here.
def health_check(request):
    return JsonResponse(
        {
            'version': settings.SPECTACULAR_SETTINGS['VERSION']
            , 'message': 'ok'
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
                    "id":1,
                    "email":"sample@gmail.com",
                },
                response_only=True,
                status_codes=[201]
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
                data={
                    "message": exp.detail,
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except IntegrityError:
            return Response(
                data={
                    "message":"Database integrity error",
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as exp:
            return Response(
                data={
                    "message": f"Something went wrong {str(exp)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
