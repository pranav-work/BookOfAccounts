from django.http import JsonResponse
from django.conf import settings


# Create your views here.
def health_check(request):
    return JsonResponse(
        {
            'version': settings.SPECTACULAR_SETTINGS['VERSION']
            , 'message': 'ok'
        })
