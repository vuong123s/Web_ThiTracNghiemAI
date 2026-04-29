#!/usr/bin/env python
"""Test script for creating quiz from AI with CSRF token handling"""

import json
import re
import requests

BASE_URL = "http://127.0.0.1:5000"

def extract_csrf_token(html_content):
    """Extract CSRF token from HTML form"""
    pattern = r'<input[^>]*name=["\']csrf_token["\'][^>]*value=["\']([^"\']+)["\']'
    match = re.search(pattern, html_content)
    if match:
        return match.group(1)
    return None

def test_quiz_creation_with_csrf():
    """Test creating a quiz from AI endpoint with CSRF token"""
    
    print("=" * 70)
    print("Testing Quiz Creation from AI - WITH CSRF")
    print("=" * 70)
    
    session = requests.Session()
    
    # Step 1: Get login page and extract CSRF token
    print("\n[Step 1] Getting login page and extracting CSRF token...")
    try:
        response = session.get(f"{BASE_URL}/auth/login", timeout=10)
        csrf_token = extract_csrf_token(response.text)
        
        if csrf_token:
            print(f"  ✓ CSRF token extracted: {csrf_token[:20]}...")
        else:
            print(f"  ✗ Could not extract CSRF token!")
            print(f"  Response: {response.text[:500]}")
            return
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return
    
    # Step 2: Login with CSRF token
    print("\n[Step 2] Logging in with CSRF token...")
    try:
        response = session.post(
            f"{BASE_URL}/auth/login",
            data={
                "email": "teacher@ninequiz.vn",
                "password": "123456",
                "csrf_token": csrf_token,
                "remember": False
            },
            allow_redirects=True,
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        
        # Check if login was successful
        if "Đăng nhập thành công" in response.text or current_user_name_in_page(response.text):
            print(f"  ✓ Login successful!")
        else:
            print(f"  ✗ Login may have failed")
            print(f"  Page title check: {'Đăng nhập' in response.text}")
            
    except Exception as e:
        print(f"  ✗ Login error: {e}")
        return
    
    # Step 3: Create quiz from AI
    print("\n[Step 3] Creating quiz from AI...")
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
        response = session.post(
            f"{BASE_URL}/teacher/questions/create-quiz-from-ai",
            json=quiz_data,
            timeout=10
        )
        
        print(f"  Status Code: {response.status_code}")
        
        # Try to parse as JSON
        try:
            resp_json = response.json()
            print(f"  Response: {json.dumps(resp_json, indent=2, ensure_ascii=False)}")
            
            if resp_json.get("success"):
                print("\n  ✓✓✓ QUIZ CREATED SUCCESSFULLY! ✓✓✓")
                if "redirect_url" in resp_json:
                    print(f"  Redirect URL: {resp_json['redirect_url']}")
                return True
            else:
                print(f"\n  ✗ Error: {resp_json.get('error', 'Unknown error')}")
                return False
        except json.JSONDecodeError:
            print(f"  Response (not JSON): {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"  ✗ Exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 70)

def current_user_name_in_page(html):
    """Check if there's a username/email in the page (indicating logged-in state)"""
    return "teacher@ninequiz.vn" in html or "Giáo viên" in html or "Đăng xuất" in html

if __name__ == "__main__":
    success = test_quiz_creation_with_csrf()
    if success:
        print("✓ Test passed!")
    else:
        print("✗ Test failed!")
