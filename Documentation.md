### Consumer : 
Small unit of channels, like views in django, tells what happens when we connect,disconnect and receive WebSocket. 
Each consumer has it's own scope, which is a set of details about a single incoming connection.
They are tiny ASGI applications, driven by events. 


### Websocket : 
2 way conn (duplex conn), runs for longer time
client                  server
             ->
            request

              <-
            handshake

              <->
            2 way conn


### WebsocketConsumer provides three methods, connect(), disconnect(), and receive():

- Inside **connect()** we called **accept()** to accept the connection. After that, we added the user to the channel layer group.
- Inside **disconnect()** we removed the user from the channel layer group.
- Inside **receive()** we parsed the data to JSON and extracted the message. Then, we forwarded the message using group_send to chat_message.

**_NOTE :_** When using channel layer's group_send, your consumer has to have a method for every JSON message **_type_** you use. In our situation, type is equaled to chat_message. Thus, we added a method called chat_message.

**_NOTE :_** If you use dots in your message types, Channels will automatically convert them to underscores when looking for a method -- e.g, chat.message will become chat_message



### Websocket Properties/Eventhandler :                                                                             
- onopen - eventhandler - Websocket conn's Readystate chnages to 1 i.e. conn is ready to send/receive msg     
- onmessage - eventhandler - msg is received from server, called with msgevent                                
- onerror - eventhandler - error occurs on Websocket                                                          
- onclose - eventhandler - Websocket conn's Readystate chnages to CLOSED, called with closeevent              

### Events : 
- open - fired when conn with Websocket is open
- message - fired when data is received through Websocket(server)
- error - conn with websocket is closed due to error
- close - conn is closed


### Channels : 
Data structure, FIFO (Queue) a way of implementing websocket in django

### Channel_layer 
get default channel layer, contains pointer to the channel layer instance

- send(channel, msg) : channel - unicode string, msg - dict (serializable)
- group_send(group, msg) : group - unicode string, msg - dict (serializable)
- group_add(group, channel) : add channel to new or eexisting group
- group_discard(group, channel) : remove channel if its in group



### Routing  : specify the websocket url that will be triggered 
similar to urls

```python

from django.urls import re_path
from . consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
]
```

To use WebSockets instead of HTTP to communicate from the client to the server, 
we need to wrap our ASGI config with ProtocolTypeRouter.

This router will route traffic to different parts of the web application depending on the protocol used.

Channels comes with a built-in class for Django session and authentication management called AuthMiddlewareStack.
Now, whenever an authenticated client joins, the user object will be added to the scope. It can accessed like 
**_user = self.scope['user']_**

Add this in project's **asgi.py**
```python
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from app1 import routing

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  'websocket': AuthMiddlewareStack(  
        URLRouter(
            routing.websocket_urlpatterns
        )
    ), 
})

```


Add this to **settings.py**
```python
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
```



### Flow : 
1. when the url is hit, 
2. view will be executed, 
3. template will be rendered, 
4. JS will be executed, 
5. websocket will be created with the path, 
6. it will go to routing(bcoz we have specified that if its http, it should where and if its websocket it should got to routing), 
7. inside routing, consumer will be called and the things will be executed








Personal Chat
1. URL : path('p/<str:to_user>/', personal_chat, name='personal-chat-view'),
2. View : personal_chat
   Context : 
        "to_user": receiver user
        "messages": Messages where user=request.user/to_user and room=request.user/to_user
3. HTML Template : direct_chat.html
4. JS file : direct_chat.js
    - A new WebSocket object is created using new WebSocket having url as 
      **"ws://" + 127.0.0.1 + "/ws/p/" + MsgToUser + "/"**
    - Websocket Event-handlers are created
      - websocket.onopen
      - websocket.onclose
      - websocket.onerror
      - websocket.onmessage





