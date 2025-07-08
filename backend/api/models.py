# Create your models here.
from django.db import models

class Document(models.Model):
    user_id = models.CharField(max_length=255) # clerk user ID
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    doc_type = models.CharField(max_length=10)
    size = models.PositiveIntegerField()
    pages = models.PositiveIntegerField(null=True, blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    processing_status = models.CharField(max_length=50, default="Pending")

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    chunk_index = models.IntegerField()
    page_number = models.IntegerField(null=True, blank=True)
    text = models.TextField()
    embedding_id = models.CharField(max_length=255)

class ChatSession(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=255) # clerk user ID
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    is_user = models.BooleanField(default=True) # false = AI response
    content = models.TextField() 
    sources = models.TextField() # only for bot messages
    created_at = models.DateTimeField(auto_now_add=True)
