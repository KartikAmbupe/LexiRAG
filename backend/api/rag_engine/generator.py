import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Retrieve API key
API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_answer(question, context):
    prompt = f"Answer the question based on the following context:\n\n{context}\n\nQuestion: {question}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "openrouter/Meta-Llama-3-8B-Instruct",
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", json=data, headers=headers)
    return response.json()["choices"][0]["message"]["content"]
