from django.shortcuts import render
from . models import Room, Message
from django.views.generic import ListView
from django import views
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required()
def get_rooms(request):
    return render(request, 'app1/home.html', {'rooms': Room.objects.all(), 'users': User.objects.exclude(pk=request.user.pk)})

@login_required()
def personal_chat(request, to_user):
    users = User.objects.get(username=to_user)
    chat_room, created = Room.objects.get_or_create(name=to_user)
    messages = Message.objects.filter(Q(user__username=to_user) | Q(user=request.user) & Q(room__name=to_user))
    return render(request, 'app1/direct_chat.html', {'to_user': users, 'messages': messages})

@login_required()
def room_view(request, room_name):
    chat_room, created = Room.objects.get_or_create(name=room_name)
    chats = Message.objects.filter(room__name=room_name)
    return render(request, 'app1/room.html', {'room': chat_room, 'past_messages': chats})
