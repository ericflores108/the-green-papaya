from rest_framework import generics
from .models import BookClub
from .serializers import BookClubSerializer


class BookClubListView(generics.ListAPIView):
    queryset = BookClub.objects.select_related('integration').all()
    serializer_class = BookClubSerializer
