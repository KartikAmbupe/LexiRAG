from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)
MODEL = None # Global variable to hold the model

def initialize_model():
    global MODEL
    if MODEL is None:
        logger.info("Loading SentenceTransformer model...")
        MODEL = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Model loaded successfully.")

def generate_embeddings(chunks):
    if MODEL is None: initialize_model() # Fallback for safety
    return MODEL.encode(chunks, show_progress_bar=False).tolist()