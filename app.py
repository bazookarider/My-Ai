 from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
import base64
from PIL import Image
import io
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("No GEMINI_API_KEY found in environment variables")
genai.configure(api_key=GEMINI_API_KEY)

class AIAssistant:
    def __init__(self):
        self.text_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        self.chat_history = []
    
    # 1. CHAT FUNCTIONALITY
    def chat(self, message):
        try:
            response = self.text_model.generate_content(message)
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"
    
    # 2. IMAGE ANALYSIS
    def analyze_image(self, image_data, question):
        try:
            # Convert base64 to image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = Image.open(io.BytesIO(image_bytes))
            
            response = self.vision_model.generate_content([question, image])
            return response.text
        except Exception as e:
            return f"Error analyzing image: {str(e)}"
    
    # 3. CODE GENERATION
    def generate_code(self, description, language="python"):
        try:
            prompt = f"Generate {language} code for: {description}. Provide clean, well-commented code."
            response = self.text_model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating code: {str(e)}"
    
    # 4. CONTENT CREATION
    def create_content(self, topic, content_type="blog post", tone="professional"):
        try:
            prompt = f"Write a {tone} {content_type} about: {topic}"
            response = self.text_model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error creating content: {str(e)}"

# Initialize AI assistant
ai = AIAssistant()

@app.route('/')
def index():
    return render_template('index.html')

# API Routes
@app.route('/api/chat', methods=['POST'])
def api_chat():
    data = request.json
    message = data.get('message', '')
    response = ai.chat(message)
    return jsonify({'response': response})

@app.route('/api/analyze-image', methods=['POST'])
def api_analyze_image():
    data = request.json
    image_data = data.get('image', '')
    question = data.get('question', 'What do you see in this image?')
    response = ai.analyze_image(image_data, question)
    return jsonify({'response': response})

@app.route('/api/generate-code', methods=['POST'])
def api_generate_code():
    data = request.json
    description = data.get('description', '')
    language = data.get('language', 'python')
    response = ai.generate_code(description, language)
    return jsonify({'response': response})

@app.route('/api/create-content', methods=['POST'])
def api_create_content():
    data = request.json
    topic = data.get('topic', '')
    content_type = data.get('content_type', 'blog post')
    tone = data.get('tone', 'professional')
    response = ai.create_content(topic, content_type, tone)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)