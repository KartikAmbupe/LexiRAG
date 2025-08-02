
# 🤖 LexiRAG – Document Intelligence Platform with RAG

LexiRAG is a full-stack AI-powered platform that allows users to upload documents (PDF, DOCX, TXT) and interact with them via natural language questions. It uses a **Retrieval-Augmented Generation (RAG)** pipeline to generate accurate, contextual answers based only on the content of the selected document.

---

## 🚀 Features

- 📤 Upload PDF, DOCX, or TXT files
- 📁 Document library with metadata and processing status
- 💬 Chat interface to ask document-based questions
- 🧠 RAG pipeline:
  - Text parsing & chunking
  - Embedding via Sentence Transformers
  - Vector similarity search using ChromaDB
  - Answer generation via Mistral-7B using OpenRouter
- 💡 Answers are generated using only the relevant chunks of the selected document
- 🎨 Beautiful dark-themed UI built with React, Tailwind CSS, and Shadcn UI

---

## 🛠️ Tech Stack

| Layer       | Technology                                |
|-------------|--------------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, Shadcn UI       |
| Backend     | Django REST Framework                      |
| Vector Store| ChromaDB                                   |
| Embeddings  | Sentence Transformers (all-MiniLM-L6-v2)   |
| LLM API     | Mistral-7B via OpenRouter                  |
| Parsing     | pdfplumber, python-docx                    |
| Storage     | Local file system                          |

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

```bash
git clone https://github.com/your-username/lexirag.git
cd lexirag/backend

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create a .env file
echo "OPENROUTER_API_KEY=your_key_here" > .env

python manage.py runserver
```

### 💻 Frontend Setup

```bash
cd ../frontend

npm install
npm run dev
```

---

## 🧪 API Endpoints

### 📥 Upload a Document

```http
POST /api/documents/upload/
Content-Type: multipart/form-data
Body: file=<document_file>
```

### 💬 Ask a Question

```http
POST /api/query/
Content-Type: application/json

{
  "document_id": 1,
  "question": "What is this document about?"
}
```

---

## 🧠 RAG Pipeline

1. Document is parsed → chunked → embedded.
2. Embeddings are stored in ChromaDB with metadata.
3. Query is embedded and matched to document-specific vectors.
4. Top-k chunks are used as context in a guided prompt.
5. Mistral-7B responds with a contextual, non-repetitive answer.

---

## 📸 Screenshots

> - Landing Page  
![Home page](https://github.com/user-attachments/assets/abc26d0a-3367-4d71-aaad-abbd5984c166)

> - Upload Page
![Upload Page](https://github.com/user-attachments/assets/3356fe5a-4add-4707-b2fb-897fcfab8789)

> - Successful Document upload
![Screenshot 2025-06-02 002539](https://github.com/user-attachments/assets/192ca528-d303-4a6d-914f-61985a1f5108)
 
> - Document Library
![Library Page](https://github.com/user-attachments/assets/8aa83ff8-1ff0-49f8-bc4f-c41c9a9d6c2a)

> - Chat Interface  
![Chatbot](https://github.com/user-attachments/assets/73318636-96f2-441b-af89-759ee08fbb26)

---

### Made with ❤️ by Kartik

---
