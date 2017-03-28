from flask import Flask  # http://flask.pocoo.org/docs/0.12/quickstart/#quickstart
import requests


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/data/art')
def hello_world():
    url = request.args.get('url')
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
    return data