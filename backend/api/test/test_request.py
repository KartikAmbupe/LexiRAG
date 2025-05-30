import requests

url = "http://127.0.0.1:8000/api/query/"
data = {"document_id": 1, "question": "What is this document about?"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=data, headers=headers)
print("Status Code:", response.status_code)
print("Response:", response.json())
