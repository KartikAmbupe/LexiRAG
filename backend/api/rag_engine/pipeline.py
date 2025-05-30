from .parser import extract_text
from .chunker import chunk_text
from .embedder import generate_embeddings
from .vector_store import store_vectors, search_similar_chunks
from .generator import generate_answer
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def process_document(doc_path, file_type, doc_id):
    text = extract_text(doc_path, file_type)
    chunks = chunk_text(text)
    embeddings = generate_embeddings(chunks)
    store_vectors(doc_id, chunks, embeddings)
    return len(chunks)

def answer_question(doc_id, question, top_k=5):
    try:
        question_embedding = model.encode([question], convert_to_tensor=True).tolist()[0]

        results = search_similar_chunks(question_embedding, top_k)

        if not results['documents'] or not results['documents'][0]:
            return {
                "answer": "Sorry, I couldn't find any relevant information in the document.",
                "sources": []
            }

        relevant_chunks = results['documents'][0]
        context = "\n".join(relevant_chunks)

        answer = generate_answer(question, context)

        return {
            "answer": answer,
            "sources": relevant_chunks
        }
    except Exception as e:
        return {
            "answer": f"RAG pipeline failed: {str(e)}",
            "sources": []
        }

