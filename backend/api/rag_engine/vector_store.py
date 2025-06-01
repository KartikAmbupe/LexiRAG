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

def search_similar_chunks(query_embedding, top_k=5, doc_id=None):
    if doc_id is None:
        raise ValueError("Missing document ID for filtered search.")

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"doc_id": str(doc_id)}
    )
    return results
