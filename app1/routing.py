from django.urls import re_path

from . consumers import ChatConsumer, ChatPersonalConsumer

websocket_urlpatterns = [
    re_path(r'ws/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/p/(?P<to_user>\w+)/$', ChatPersonalConsumer.as_asgi()),

]