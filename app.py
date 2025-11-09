from flask import Flask, render_template, request, jsonify, send_file
import google.generativeai as genai
import os
import io
import base64
from PIL import Image
import requests
import json
from datetime import datetime

app = Flask(__name__)

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

class AllInOneAI:
    def __init__(self):
        self.text_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        self.chat_session = None
    
    # 1. CHATBOT FUNCTIONALITY
    def chat(self, message,