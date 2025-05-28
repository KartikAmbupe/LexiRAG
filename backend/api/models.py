from django.db import models

# Create your models here.
from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    doc_type = models.CharField(max_length=10)  # pdf, docx, txt
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
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    sources = models.TextField()  # Could be a list or chunk IDs
    timestamp = models.DateTimeField(auto_now_add=True)
