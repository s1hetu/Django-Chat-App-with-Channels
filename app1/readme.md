Consumer : Small unit of channels, like views in django, tells what what happens when we connect,disconnect and receive WebSocket  


Websocket : 2 way conn (duplex conn), runs for longer time
client                  server
             ->
            request

              <-
            handshake

              <->
            2 way conn

'''
WebsocketConsumer provides three methods, connect(), disconnect(), and receive():

    Inside connect() we called accept() to accept the connection. After that, we added the user to the channel layer group.
    Inside disconnect() we removed the user from the channel layer group.
    Inside receive() we parsed the data to JSON and extracted the message. Then, we forwarded the message using group_send to chat_message.

    When using channel layer's group_send, your consumer has to have a method for every JSON message type you use. In our situation, type is equaled to chat_message. Thus, we added a method called chat_message.

    If you use dots in your message types, Channels will automatically convert them to underscores when looking for a method -- e.g, chat.message will become chat_message
'''


Websocket Properties/Eventhandler : called when                                                                           Events
        onopen - eventhandler - Websocket conn's Readystate chnages to 1 i.e. conn is ready to send/receive msg     open - fired when conn with Websocket is open
        onmessage - eventhandler - msg is received from server, called with msgevent                                message - fired when data is received through Websocket(server)
        onerror - eventhandler - error occurs on Websocket                                                          error - conn with websocket is closed due to error
        onclose - eventhandler - Websocket conn's Readystate chnages to CLOSED, called with closeevent              close - conn is closed




channels : Data structure, FIFO (Queue) a way of implementing webscoket in django

channel_layer : get default channel layer, contains pointer to the channel layer instance, if u are using consumers

    send(channel, msg) : channel - unicode string, msg - dict (serializable)
    group_send(group, msg) : group - unicode string, msg - dict (serializable)
    group_add(group, channel) : add channel to new or eexisting group
    group_discard(group, channel) : remove channel if its in group



Routing  : specify the websocket url that will be triggered 
    from django.urls import re_path
    from . consumers import ChatConsumer

    websocket_urlpatterns = [
        re_path(r'ws/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    ]   

Asgi
    application = ProtocolTypeRouter({
      "http": get_asgi_application(),
      'websocket': AuthMiddlewareStack(  # new
            URLRouter(
                routing.websocket_urlpatterns
            )
        ),  # new
    })




var websocket = new Websocket('ws:// + 127.0.0.1:8000 /ws/)


    
json.dumps() -> convert python dict to json string
json.loads() -> convert json string to python dict


JSON.parse()      -> json string to JS object
JSON.stringify()  -> JS object to json string

Scope (like request in django) 




when the url is hit, view will be execcuted, template will be rendered, JS will be executed, websocket will be created with the path, it will got to routing(bcoz we have specified that if its http, it should where and if its websocket it should got to routing), inside routing, consumer will be called and the things will be executed



