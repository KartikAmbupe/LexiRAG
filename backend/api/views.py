from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import DocumentSerializer, ChatMessageSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import os

from .rag_engine.pipeline import process_document
from .models import Document, ChatSession, ChatMessage
from .rag_engine.pipeline import answer_question 


class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        print("Received file:", request.FILES.get("file"))
        print("Received user ID:", request.headers.get("X-User-Id"))
        user_id = request.headers.get("X-User-Id")
        if not user_id:
            return Response({"error": "Missing user ID"}, status=400)
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        doc = Document.objects.create(
            user_id=user_id,
            title=file.name,
            file=file,
            doc_type=os.path.splitext(file.name)[1][1:].lower(),
            size=file.size,
            processing_status='Processing'
        )
        
        doc_path = doc.file.path
        try:
            chunk_count = process_document(doc_path, doc.doc_type, str(doc.id))
            doc.processing_status = f"Completed ({chunk_count} chunks)"
        except Exception as e:
            doc.processing_status = f"Error: {str(e)}"

        doc.save()

        return Response(DocumentSerializer(doc).data, status=201)

class DocumentListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        user_id = request.headers.get("X-User-Id") # Clerk ID sent from frontend
        if not user_id:
            return Response({"error": "Missing user ID"}, status=400)
        
        documents = Document.objects.filter(user_id=user_id).order_by("-upload_date")
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

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
        user_id = request.headers.get("X-User-Id")
        document_id = request.data.get('document_id')
        question = request.data.get('question')
        session_id = request.data.get('chat_session_id')

        if not all([user_id, document_id, question]):
            return Response({"error": "Missing document_id, question or user_id"}, status=400)

        # Validate document ownership
        try:
            document = Document.objects.get(id=document_id, user_id=user_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

        try:
            # Create or reuse chat session
            if session_id:
                session = ChatSession.objects.get(id=session_id)
            else:
                session = ChatSession.objects.create(document=document, user_id=user_id)
                
            #Save user question
            ChatMessage.objects.create(
                session=session,
                is_user=True,
                content=question
            )

            # Run the RAG pipeline
            result = answer_question(document_id, question)
            answer = result["answer"]
            sources = result["sources"]

            # Save AI Response
            message = ChatMessage.objects.create(
                session=session,
                is_user=False,
                content=answer,
                sources="\n\n".join(sources)
            )

            return Response({
                "answer": answer,
                "sources": sources,
                "chat_message_id": message.id,
                "chat_session_id": session.id
            }, status=200)

        except Exception as e:
            return Response({"error": f"RAG processing failed: {str(e)}"}, status=500)
        

class ChatHistoryView(APIView):
    def get(self, request, doc_id):
        user_id = request.headers.get("X-User-Id")
        if not user_id: 
            return Response({"error": "Missing user ID"}, status=400)
        
        try:
            document = Document.objects.get(id=doc_id, user_id=user_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found or not owned by user"}, status=404)
        
        session = ChatSession.objects.filter(document=document, user_id=user_id).first()
        if not session:
            return Response({"chat_session_id": None, "messages":[]})
        
        #Fetch and serialize messages
        messages = ChatMessage.objects.filter(session=session).order_by("created_at")
        serializer = ChatMessageSerializer(messages, many=True)
        
        return Response({
            "chat_session_id": session.id,
            "messages": serializer.data
        })
        
class ClearChatHistoryView(APIView):
    def delete(self, request, doc_id):
        user_id = request.headers.get("X-User-Id")
        if not user_id:
            return Response({"error": "Missing user ID"}, status=400)

        try:
            doc = Document.objects.get(id=doc_id, user_id=user_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found or not owned by user"}, status=404)

        ChatSession.objects.filter(document=doc, user_id=user_id).delete()
        
        return Response({"message": "Chat history cleared"}, status=200)
    