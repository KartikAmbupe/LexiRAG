from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import DocumentSerializer
import os

from .rag_engine.pipeline import process_document
from .models import Document, ChatSession, ChatMessage
from .rag_engine.pipeline import answer_question 


class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        doc = Document.objects.create(
            title=file.name,
            file=file,
            doc_type=os.path.splitext(file.name)[1][1:].lower(),
            size=file.size,
            processing_status='Processing'
        )
        
        doc_path = doc.file.path
        # TODO: Call document processing pipeline here (parser → chunk → embed)
        try:
            chunk_count = process_document(doc_path, doc.doc_type, str(doc.id))
            doc.processing_status = f"Completed ({chunk_count} chunks)"
        except Exception as e:
            doc.processing_status = f"Error: {str(e)}"

        # doc.processing_status = 'Completed'
        doc.save()

        return Response(DocumentSerializer(doc).data, status=201)

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
        print("RAW DATA:", request.body)
        print("PARSED DATA:", request.data)

        document_id = request.data.get('document_id')
        question = request.data.get('question')
        session_id = request.data.get('chat_session_id')  # Optional

        if not document_id or not question:
            return Response({"error": "Missing document_id or question"}, status=400)

        # Validate document
        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

        try:
            # Create or reuse chat session
            if session_id:
                session = ChatSession.objects.get(id=session_id)
            else:
                session = ChatSession.objects.create(document=document)

            # Run the actual RAG pipeline
            result = answer_question(document_id, question)
            answer = result["answer"]
            sources = result["sources"]

            # Save the chat message
            message = ChatMessage.objects.create(
                session=session,  # Ensure session is assigned
                question=question,
                answer=answer,
                sources="\n\n".join(sources)
            )

            return Response({
                "answer": answer,
                "sources": sources,
                "chat_message_id": message.id,
                "chat_session_id": session.id  # Return session ID
            }, status=200)

        except Exception as e:
            return Response({"error": f"RAG processing failed: {str(e)}"}, status=500)


def post(self, request, *args, **kwargs):
    print("Received request data:", request.data)  # Check the incoming data
    return super().post(request, *args, **kwargs)
