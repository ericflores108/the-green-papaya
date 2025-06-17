from django.urls import path
from .views import (
    BookClubListView,
    BookClubDetailView,
    BookClubSearchView,
    IntegrationListView,
)

urlpatterns = [
    path("bookclub/", BookClubListView.as_view(), name="bookclub-list"),
    path("bookclub/<str:url>/", BookClubDetailView.as_view(), name="bookclub-detail"),
    path("bookclub/search/", BookClubSearchView.as_view(), name="bookclub-search"),
    path("integrations/", IntegrationListView.as_view(), name="integration-list"),
]
