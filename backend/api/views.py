from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Document
from .serializers import DocumentSerializer
import os

# You’ll integrate RAG here later
class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        doc = Document.objects.create(
            title=file.name,
            file=file,
            doc_type=os.path.splitext(file.name)[1][1:],
            size=file.size,
            processing_status='Processing'
        )
        doc.save()

        # TODO: Call document processing pipeline here (parser → chunk → embed)

        doc.processing_status = 'Completed'
        doc.save()

        return Response(DocumentSerializer(doc).data, status=201)

# class TestUploadView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         print("FILES:", request.FILES)
#         print("DATA:", request.data)
#         print("CONTENT-TYPE:", request.content_type)

#         file = request.FILES.get('file')
#         if file:
#             return Response({"file_name": file.name}, status=200)
#         return Response({"error": "No file received"}, status=400)

class DocumentListView(APIView):
    def get(self, request):
        documents = Document.objects.all()
        return Response(DocumentSerializer(documents, many=True).data)

class DocumentDetailView(APIView):
    def get(self, request, doc_id):
        try:
            doc = Document.objects.get(id=doc_id)
            return Response(DocumentSerializer(doc).data)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

    def delete(self, request, doc_id):
        try:
            doc = Document.objects.get(id=doc_id)
            doc.delete()
            return Response({"message": "Document deleted"}, status=200)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

class AskQuestionView(APIView):
    def post(self, request):
        document_id = request.data.get('document_id')
        question = request.data.get('question')

        # Placeholder response – to be replaced with RAG logic
        return Response({
            "answer": f"Mock answer for question: '{question}' on document ID {document_id}",
            "sources": []
        }, status=200)
