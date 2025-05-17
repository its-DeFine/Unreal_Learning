import json
from app.main import app

def test_ingest_return_format(client):
    response = client.post('/ingest', json={'return_format': 1})
    assert 'distilled' in response.get_json()


def test_ask_endpoint(client):
    response = client.get('/ask?q=test')
    assert response.status_code == 200


