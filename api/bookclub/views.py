from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import BookClub, Integration
from .serializers import BookClubSerializer, IntegrationSerializer


class BookClubListView(generics.ListAPIView):
    queryset = BookClub.objects.select_related("integration").all()
    serializer_class = BookClubSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["integration", "date"]
    search_fields = ["book", "author"]


class BookClubDetailView(generics.RetrieveAPIView):
    queryset = BookClub.objects.select_related("integration").all()
    serializer_class = BookClubSerializer
    lookup_field = "url"


class BookClubSearchView(generics.ListAPIView):
    queryset = BookClub.objects.select_related("integration").all()
    serializer_class = BookClubSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["book", "author"]


class IntegrationListView(generics.ListAPIView):
    queryset = Integration.objects.all()
    serializer_class = IntegrationSerializer
