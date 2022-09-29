import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from app1.models import Room, Message


class ChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.user_inbox = None

    # client to server
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.room = Room.objects.get(name=self.room_name)
        self.user = self.scope['user']
        self.user_inbox = f'inbox_{self.user.username}' 

        # connection has to be accepted
        self.accept()

        # join the room group : group_add(group, channel)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

        # send the user list to the newly joined user
        self.send(json.dumps({
            'type': 'user_list',
            'users': [user.username for user in self.room.online.all()],
        }))

        if self.user.is_authenticated:
            #  create a user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )

            # send the join event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            self.room.online.add(self.user)
            

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )
        
        if self.user.is_authenticated:
            # delete the user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )

            # send the leave event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                }
            )
            self.room.online.remove(self.user)

    # server to client
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        if not self.user.is_authenticated:
            return "Login First"

        if message.startswith('/pm '):
            split = message.split(' ', 2)
            target = split[1]
            target_msg = split[2]

            # send private message to the target
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target}',
                {
                    'type': 'private_message',
                    'user': self.user.username,
                    'message': target_msg,
                }
            )
            # send private message delivered to the user
            self.send(json.dumps({
                'type': 'private_message_delivered',
                'target': target,
                'message': target_msg,
            }))
            return
        # ---------------- end of new ----------------

        # send chat message event to the room
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'user': self.user.username,
                'message': message,
            }
        )
        Message.objects.create(user=self.user, room=self.room, content=message)
            
    def chat_message(self, event):
        self.send(text_data=json.dumps(event))

    def user_list(self, event):
            self.send(text_data=json.dumps(event))
    
    def user_join(self, event):
        self.send(text_data=json.dumps(event))

    def user_leave(self, event):
        self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))











class ChatPersonalConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.user_inbox = None

    # client to server
    def connect(self):
        # to_user = room_name
        self.room_name = self.scope['url_route']['kwargs']['to_user']
        self.room_group_name = f'chat_{self.room_name}'
        self.room = Room.objects.get(name=self.room_name)
        # from_user = user
        self.user = self.scope['user']
        self.user_inbox = f'inbox_{self.user.username}' 

        self.accept()           # connection has to be accepted

        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )

            # send the join event to the room
            async_to_sync(self.channel_layer.send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            self.room.online.add(self.user)
        else:
            print("Login first")
            

    def disconnect(self, close_code):
        
        if self.user.is_authenticated:
            # delete the user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )
            self.room.online.remove(self.user)
        else:
            print("login first")

    # server to client
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        if not self.user.is_authenticated:
            return "Login in"

        # -------------------- new --------------------
        if message:
            

            # send private message to the target
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{self.room_name}',
                {
                    'type': 'personal_message',
                    'user': self.user.username,
                    'message': message,
                }
            )
        Message.objects.create(user=self.user, room=self.room, content=message)
            
    def chat_message(self, event):
        self.send(text_data=json.dumps(event))

    def personal_message(self, event):
        self.send(text_data=json.dumps(event))