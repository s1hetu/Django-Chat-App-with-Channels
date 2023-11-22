from re import I
from django.urls import path
from .views import get_rooms, room_view, personal_chat, create_room
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('login_n/', auth_views.LoginView.as_view(template_name='app1/login.html'), name = 'login'),
    path('logout_n/', auth_views.LogoutView.as_view(template_name = 'app1/logout.html'), name = 'logout'),
    
    path('', get_rooms, name='get-all-rooms'),
    path('create_room/', create_room, name='create-room'),
    path('p/<str:to_user>/', personal_chat, name='personal-chat-view'),
    path('<str:room_name>/', room_view, name='Room-view'),
]