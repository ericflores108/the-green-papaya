from django.urls import path
from .views import (
    BookClubListView,
    BookClubSearchView,
    IntegrationListView,
    BookClubByIdView,
)

urlpatterns = [
    path("bookclub/", BookClubListView.as_view(), name="bookclub-list"),
    path("bookclub/<str:id>/", BookClubByIdView.as_view(), name="bookclub-detail"),
    path("bookclub/search/", BookClubSearchView.as_view(), name="bookclub-search"),
    path("integrations/", IntegrationListView.as_view(), name="integration-list"),
]
