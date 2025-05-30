import requests

# url = "http://127.0.0.1:8000/api/documents/upload/"
# files = {"file": open("test2.docx", "rb")}  # Replace with your actual file

# response = requests.post(url, files=files)

# print("Status Code:", response.status_code)
# print("Response:", response.text)


# get the list of the files uploaded
url = "http://127.0.0.1:8000/api/documents/"
response = requests.get(url)
print(response.json())  # Should return the list of uploaded files
