from django.urls import path
from .views import BookClubListView

urlpatterns = [
    path('clubs/', BookClubListView.as_view(), name='bookclub-list'),
]