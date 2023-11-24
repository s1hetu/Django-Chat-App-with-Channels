from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views import View

from .models import Room, Message
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


def create_room(request):
    if request.method == "GET":
        return render(request, 'app1/create_room.html', context={"users": User.objects.exclude(pk=request.user.pk)})
    else:
        name = request.POST.get('room_name')
        users = request.POST.getlist('users[]')

        room = Room.objects.filter(name=name)

        if room:
            return JsonResponse({"msg": f"Room {room.first().name} already exist.", "status_code": 200})
        else:

            room = Room.objects.create(name=name)
            room.online.add(request.user)
            for user in users:
                room.online.add(User.objects.get(username=user))
            return JsonResponse({"msg": f"Room {room} created successfully.", "status_code": 200})


@login_required()
def get_rooms(request):
    return render(request, 'app1/home.html', {'rooms': Room.objects.filter(online__username=request.user.username),
                                              'users': User.objects.exclude(pk=request.user.pk)})


@login_required()
def personal_chat(request, to_user):
    user = User.objects.get(username=to_user)
    chat_room, created = Room.objects.get_or_create(name=to_user)
    messages = Message.objects.filter(
        (Q(user=user) | Q(user=request.user)) & (Q(room__name=request.user) | Q(room__name=user))).order_by("timestamp")

    return render(request, 'app1/direct_chat.html', {'to_user': user, "messages": messages})


@login_required()
def room_view(request, room_name):
    chat_room = Room.objects.filter(name=room_name).first()
    members = chat_room.online.all()

    if chat_room and request.user in members:
        chats = Message.objects.filter(room__name=room_name)
        return render(request, 'app1/room.html', {'room': chat_room, 'past_messages': chats,
                                                  'members': members.exclude(username=request.user.username)})
    else:
        messages.error(request, "No such room.")
        return redirect('get-all-rooms')


@login_required()
def exit_room(request):
    room = Room.objects.get(name=request.POST.get("room_name"))
    breakpoint()
    if request.method == "POST":
        room.online.remove(request.user)
        return JsonResponse({"status_code": 200, "message": f"You left the {room.name} room"})


class AddMembers(View):
    def get(self, request, room_name):
        room = Room.objects.filter(name=room_name).first()
        available_users = User.objects.exclude(pk__in=room.online.values_list("pk", flat=True))
        return render(request, "app1/add_members.html",
                      {"current_members": room.online.exclude(id=request.user.id), "available_users": available_users,
                       "room": room})

    def post(self, request, room_name):
        room = Room.objects.filter(name=room_name).first()
        users = request.POST.getlist("users[]")
        for user in users:
            room.online.add(User.objects.get(username=user))
        return JsonResponse({"status_code": 200, "message": "Members added successfully."})
