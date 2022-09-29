from django.db import models
from django.contrib.auth.models import User

# chat room
class Room(models.Model):
    name = models.CharField(max_length=128)
    online = models.ManyToManyField(User, blank=True, related_name='rooms')

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f'{self.name} ({self.get_online_count()})'


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_user')
    room = models.ForeignKey(to=Room, on_delete=models.CASCADE, related_name='messages_room')
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'''From : {self.user.username}
                    Message : {self.content} 
                    Room : {self.room}'''

