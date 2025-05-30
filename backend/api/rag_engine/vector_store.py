import chromadb

client = chromadb.PersistentClient(path="chroma_store")

collection = client.get_or_create_collection("documents")

def store_vectors(doc_id, chunks, embeddings):
    for idx, (chunk, vector) in enumerate(zip(chunks, embeddings)):
        collection.add(
            documents=[chunk],
            embeddings=[vector],
            ids=[f"{doc_id}_{idx}"],
            metadatas=[{"doc_id": doc_id, "chunk_index": idx}]
        )

def search_similar_chunks(query_embedding, top_k=5):
    results = collection.query(query_embeddings=[query_embedding], n_results=top_k)
    return results
