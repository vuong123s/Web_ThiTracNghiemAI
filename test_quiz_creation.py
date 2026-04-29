#!/usr/bin/env python
"""Test script for creating quiz from AI"""

import json
import requests
from requests.cookies import RequestsCookieJar

BASE_URL = "http://127.0.0.1:5000"
SESSION = requests.Session()

def test_quiz_creation():
    """Test creating a quiz from AI endpoint"""
    
    # First, let's check if the endpoint exists and what it expects
    print("=" * 60)
    print("Testing Quiz Creation from AI Endpoint")
    print("=" * 60)
    
    # Step 1: Login as teacher
    print("\n1. Logging in as teacher...")
    try:
        login_response = SESSION.post(
            f"{BASE_URL}/auth/login",
            data={
                "email": "teacher@ninequiz.vn",
                "password": "123456"
            },
            allow_redirects=True,
            timeout=10
        )
        
        if login_response.status_code == 200:
            print("   ✓ Logged in successfully")
        else:
            print(f"   ✗ Login failed: {login_response.status_code}")
            return
    except Exception as e:
        print(f"   ✗ Login error: {e}")
        return
    
    # Prepare test data
    quiz_data = {
        "quiz_name": "Test Quiz from AI",
        "questions": [
            {
                "text": "What is the capital of France?",
                "type": "single",
                "options": [
                    {"text": "London", "is_correct": False},
                    {"text": "Paris", "is_correct": True},
                    {"text": "Berlin", "is_correct": False},
                ],
                "category": "Geography",
                "difficulty": "easy"
            },
            {
                "text": "What is 2 + 2?",
                "type": "single", 
                "options": [
                    {"text": "3", "is_correct": False},
                    {"text": "4", "is_correct": True},
                    {"text": "5", "is_correct": False},
                ],
                "category": "Math",
                "difficulty": "easy"
            }
        ]
    }
    
    try:
        # Test endpoint with authentication
        print("\n2. Testing create quiz from AI endpoint...")
        response = SESSION.post(
            f"{BASE_URL}/teacher/questions/create-quiz-from-ai",
            json=quiz_data,
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            try:
                resp_json = response.json()
                print(f"   Response: {json.dumps(resp_json, indent=2)}")
                
                if resp_json.get("success"):
                    print("\n   ✓ Quiz created successfully!")
                    if "redirect_url" in resp_json:
                        print(f"   Redirect URL: {resp_json['redirect_url']}")
                else:
                    print(f"\n   ✗ Error: {resp_json.get('error', 'Unknown error')}")
            except json.JSONDecodeError:
                print(f"   Response (not JSON): {response.text[:200]}...")
        else:
            print(f"   Response (not 200): Status {response.status_code}")
            print(f"   Content: {response.text[:200]}...")
            
    except Exception as e:
        print(f"   ✗ Exception: {e}")
    
    print("\n" + "=" * 60)
    print("Test completed")
    print("=" * 60)

if __name__ == "__main__":
    test_quiz_creation()
