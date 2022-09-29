"""
ASGI config for django_channels project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
import django

from channels.http import AsgiHandler
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from app1 import routing
# default
# application = get_asgi_application()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_channels.settings')

# Since we'll be using WebSockets instead of HTTP to communicate from the client to the server, we need to wrap our ASGI config with ProtocolTypeRouter 
# This router will route traffic to different parts of the web application depending on the protocol used.
application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  'websocket': AuthMiddlewareStack(  # new
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),  # new
})
  