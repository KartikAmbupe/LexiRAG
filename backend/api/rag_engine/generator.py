import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Retrieve API key
API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_answer(question, context):
    try:
        prompt = f"Answer the question based on the following context:\n\n{context}\n\nQuestion: {question}"
        
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [{"role": "user", "content": prompt}]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", json=data, headers=headers)
        response_json = response.json()

        # Debugging: Print response structure
        print("API Response:", response_json)

        if "choices" not in response_json or not response_json["choices"]:
            return f"Error: Unexpected response format: {response_json}"

        return response_json["choices"][0]["message"]["content"]

    except requests.exceptions.RequestException as e:
        return f"Error: Failed API request - {str(e)}"


