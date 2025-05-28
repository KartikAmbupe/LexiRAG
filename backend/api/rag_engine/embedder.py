from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')  # lightweight and fast pre-trained model with good accuracy

def generate_embeddings(chunks):
    return model.encode(chunks, convert_to_tensor=True).tolist()
