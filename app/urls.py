from django.urls import path
from . import views
urlpatterns = [
    path('', views.SRView.as_view()),
    path('p/', views._post)
]
