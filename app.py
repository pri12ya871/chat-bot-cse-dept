from flask import Flask, request, jsonify, render_template
from sentence_transformers import SentenceTransformer, util
import json
import numpy as np

app = Flask("Dhara")

model = SentenceTransformer('all-MiniLM-L6-v2')


json_file_path = 'static/QnAsdictionary.json'
with open(json_file_path, 'r') as file:
    loaded_QA_input = json.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/answer', methods=['POST'])
def get_answer():

    user_question = request.json['user_question']  # Access user question from JSON payload

    if user_question.lower() in ['hey', 'hello', 'hi', 'greetings']:
        return jsonify({'answer': 'Hello! How can I help you today?'})

    emb1 = model.encode([item["question"] for item in loaded_QA_input])
    emb2 = model.encode(user_question)

    cos_sim = util.cos_sim(emb1, emb2)
    
    cos_sim_array = cos_sim.numpy()
    max_value_index = np.argmax(cos_sim_array)
    answer = loaded_QA_input[max_value_index]['context']
    print(max_value_index)
    print(answer)
    return jsonify({'answer': answer})

if __name__== '__main__':
    app.run(debug=True)