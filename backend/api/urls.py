from django.urls import path
from .views import (
    DocumentUploadView,
    # TestUploadView,
    DocumentListView,
    DocumentDetailView,
    AskQuestionView,
)

urlpatterns = [
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('documents/<int:doc_id>/', DocumentDetailView.as_view(), name='document-detail'),
    path('query/', AskQuestionView.as_view(), name='ask-question'),
]
