from django.urls import path
from .views import (
    DocumentUploadView,
    # TestUploadView,
    DocumentListView,
    DocumentDetailView,
    AskQuestionView,
    ChatHistoryView,
    ClearChatHistoryView
)

urlpatterns = [
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('documents/<int:doc_id>/', DocumentDetailView.as_view(), name='document-detail'),
    path('query/', AskQuestionView.as_view(), name='ask-question'),
    path('chat-history/<int:doc_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('chat-history/<int:doc_id>/clear/', ClearChatHistoryView.as_view(), name='clear-chat-history')
]
