Kill server : sudo service redis-server stop


Consumer : Small unit of channels

Websocket : connect, receive, disconnect
handlers : 
    connect  
        accept method to accept the connection
    receive : 
        receive msg from server
    disconnect

event :

group_add, group_send, group_discard : add, send, dscard in group(to all/bulk)


handlers get triggered when an event occurs

Routing 
    from django.urls import re_path
    from . consumers import ChatConsumer

    websocket_urlpatterns = [
        re_path(r'ws/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    ]   
    # ws in path indiactes that it is websocket url


Asgi'
    application = ProtocolTypeRouter({
      "http": get_asgi_application(),
      'websocket': AuthMiddlewareStack(  # new
            URLRouter(
                routing.websocket_urlpatterns
            )
        ),  # new
    })


Websocket : 2 way conn (duplex conn), runs for longer time
client              server
             ->
            request


              <-
            handshake


              <->
            2 way conn

var websocket = new Websocket('ws:// + 127.0.0.1:8000 /ws/)

    Properties/Eventhandler : called when                                                                           Events
        onopen - eventhandler - Websocket conn's Readystate chnages to 1 i.e. conn is ready to send/receive msg     open - fired when conn with Websocket is open
        onmessage - eventhandler - msg is received from server, called with msgevent                                message - fired when data is received through Websocket(server)
        onerror - eventhandler - error occurs on Websocket                                                          error - conn with websocket is closed due to error
        onclose - eventhandler - Websocket conn's Readystate chnages to CLOSED, called with closeevent              close - conn is closed

        # this using eventhandler
        websocket.onopen = function() {
            console.log("Conn is now open................")
            websocket.send("Hi i am client")
        }

        # or this using eventListner
        websocket.addEventListener ('open', () = > {
            console.log ('Websocket connection open ... ')
            ws.send ('Hi , Message from Client ...')
            }
        )

    Methods :
        close() - close conn or conn attempt (if any), if no coon, it does nothing
                    websocket.close(code, reason)
                        code = status code
        send() - enque data to be transmitted to server over WebSocket conn (client to server)
                -  If data cant be send, socket is auto closed


    ReadyState :
            0      CONNECTING              Socket has been created . The connection is not yet open .
            1      OPEN                    The connection is open and ready to communicate .
            2      CLOSING                 The connection is in the process of closing .
            3      CLOSED                  The connection is closed or couldn't be opened .

         
           
json.dumps() -> convert python dict to json string
json.loads() -> convert json string to python dict


JSON.parse()      -> json string to JS object
JSON.stringify()  -> JS object to json string


channel_layer : get default channel layer, contains pointer to the channel layer instance, if u are using consumers

    send(channel, msg) : channel - unicode string, msg - dict (serializable)
    group_send(group, msg) : group - unicode string, msg - dict (serializable)
    group_add(group, channel) : add channel to new or eexisting group
    group_discard(group, channel) : remove channel if its in group




channels : Data structure, FIFO (Queue) a way of implementing webscoket in django

cosnumer : smaal uni of channels, like views in django, tells what what happens when we connect,disconnect and receive WebSocket  

routing : specify the websocket url that will be triggered 

when the url is hit, view will be execcuted, emplate will be rendered, JS will be executed, websocket will be created with the path, it will got to routing(bcoz we have specified that if its http, it should where and if its websocket it should got to routing), inside routing, consumer will be called and the things will be executed


'''
WebsocketConsumer provides three methods, connect(), disconnect(), and receive():

    Inside connect() we called accept() to accept the connection. After that, we added the user to the channel layer group.
    Inside disconnect() we removed the user from the channel layer group.
    Inside receive() we parsed the data to JSON and extracted the message. Then, we forwarded the message using group_send to chat_message.

    When using channel layer's group_send, your consumer has to have a method for every JSON message type you use. In our situation, type is equaled to chat_message. Thus, we added a method called chat_message.

    If you use dots in your message types, Channels will automatically convert them to underscores when looking for a method -- e.g, chat.message will become chat_message
'''

Scope (like request in django) :
{'type': 'websocket', 'path': '/ws/a_b/', 'raw_path': b'/ws/a_b/', 'headers': [(b'host', b'127.0.0.1:8000'), (b'connection', b'Upgrade'), (b'pragma', b'no-cache'), (b'cache-control', b'no-cache'), (b'user-agent', b'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'), (b'upgrade', b'websocket'), (b'origin', b'http://127.0.0.1:8000'), (b'sec-websocket-version', b'13'), (b'accept-encoding', b'gzip, deflate, br'), (b'accept-language', b'en-US,en;q=0.9'), (b'cookie', b'csrftoken=xoCB2T0pRC5UcpvRaSw5XCBuYKND38oY; sessionid=0h8m48mmu2da06hk67932m3e2l4jz5nm'), (b'sec-websocket-key', b'ylGHOVmLehBItH1iJsDf1Q=='), (b'sec-websocket-extensions', b'permessage-deflate; client_max_window_bits')], 'query_string': b'', 'client': ['127.0.0.1', 40542], 'server': ['127.0.0.1', 8000], 'subprotocols': [], 'asgi': {'version': '3.0'}, 'cookies': {'csrftoken': 'xoCB2T0pRC5UcpvRaSw5XCBuYKND38oY', 'sessionid': '0h8m48mmu2da06hk67932m3e2l4jz5nm'}, 'session': <django.utils.functional.LazyObject object at 0x7fa90f2c1ca0>, 'user': <channels.auth.UserLazyObject object at 0x7fa90f2c1fa0>, 'path_remaining': '', 'url_route': {'args': (), 'kwargs': {'room_name': 'a_b'}}}
WebSocket CONNECT /ws/a_b/ [127.0.0.1:40542]



group_name : django websocket, call a group, so paticular function will be called