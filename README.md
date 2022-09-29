Django channels


pip install -r requirements.txt

Add this in project's asgi.py

'''
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from app1 import routing

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  'websocket': AuthMiddlewareStack(  # new
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),  # new
})
'''


Add this to settings.py

'''
INSTALLED_APPS=[
    ......
    'channels',
    'app1',
]

ASGI_APPLICATION = "django_channels.asgi.application"

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
'''
