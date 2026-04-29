#!/usr/bin/env python
"""Test script for creating quiz from AI with detailed debugging"""

import json
import requests
from urllib.parse import urljoin

BASE_URL = "http://127.0.0.1:5000"

def test_quiz_creation_debug():
    """Test creating a quiz from AI endpoint with detailed logging"""
    
    print("=" * 70)
    print("Testing Quiz Creation from AI Endpoint - WITH DEBUG")
    print("=" * 70)
    
    session = requests.Session()
    
    # Step 1: Get login page to ensure session is initialized
    print("\n[Step 1] Getting login page to initialize session...")
    try:
        response = session.get(f"{BASE_URL}/auth/login", timeout=10)
        print(f"  Status: {response.status_code}")
        print(f"  Cookies after GET: {session.cookies.get_dict()}")
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return
    
    # Step 2: Login
    print("\n[Step 2] Logging in as teacher...")
    try:
        response = session.post(
            f"{BASE_URL}/auth/login",
            data={
                "email": "teacher@ninequiz.vn",
                "password": "123456"
            },
            allow_redirects=False,  # Don't follow redirects yet
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        print(f"  Location header: {response.headers.get('Location', 'N/A')}")
        print(f"  Cookies after POST: {session.cookies.get_dict()}")
        
        # Follow redirect
        if response.status_code in [301, 302, 303, 307, 308]:
            print(f"  Following redirect to: {response.headers.get('Location')}")
            response = session.get(response.headers.get('Location'), timeout=10)
            print(f"  Redirect response status: {response.status_code}")
            print(f"  Cookies after redirect: {session.cookies.get_dict()}")
            
    except Exception as e:
        print(f"  ✗ Login error: {e}")
        return
    
    # Step 3: Test if we're logged in by accessing dashboard
    print("\n[Step 3] Verifying login by accessing dashboard...")
    try:
        response = session.get(f"{BASE_URL}/dashboard", timeout=10)
        print(f"  Status: {response.status_code}")
        if "Đăng nhập" in response.text:
            print("  ✗ Still on login page - login failed!")
        else:
            print("  ✓ Successfully logged in!")
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return
    
    # Step 4: Create quiz from AI
    print("\n[Step 4] Creating quiz from AI...")
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
            }
        ]
    }
    
    try:
        print(f"  Sending request to: {BASE_URL}/teacher/questions/create-quiz-from-ai")
        print(f"  Cookies: {session.cookies.get_dict()}")
        print(f"  Data: {json.dumps(quiz_data, indent=2)}")
        
        response = session.post(
            f"{BASE_URL}/teacher/questions/create-quiz-from-ai",
            json=quiz_data,
            timeout=10
        )
        
        print(f"  Status Code: {response.status_code}")
        print(f"  Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        
        # Try to parse as JSON
        try:
            resp_json = response.json()
            print(f"  Response (JSON): {json.dumps(resp_json, indent=2, ensure_ascii=False)}")
            
            if resp_json.get("success"):
                print("\n  ✓✓✓ QUIZ CREATED SUCCESSFULLY! ✓✓✓")
                if "redirect_url" in resp_json:
                    print(f"  Redirect URL: {resp_json['redirect_url']}")
            else:
                print(f"\n  ✗ Error: {resp_json.get('error', 'Unknown error')}")
        except json.JSONDecodeError:
            print(f"  Response (not JSON, first 300 chars): {response.text[:300]}")
            
    except Exception as e:
        print(f"  ✗ Exception: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 70)
    print("Test completed")
    print("=" * 70)

if __name__ == "__main__":
    test_quiz_creation_debug()
