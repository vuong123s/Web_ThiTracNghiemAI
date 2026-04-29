#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Quick test of updated Gemini generation logic"""

import json
import urllib.request
from urllib.parse import quote
import time
import sys
import os

# Fix Unicode output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

api_key = "AIzaSyByZE20jVx8B_7xnu234Pybgq3Gh50PlXY"

def get_available_models(api_key, api_version="v1beta"):
    """Query available Gemini models"""
    try:
        url = f"https://generativelanguage.googleapis.com/{api_version}/models?key={quote(api_key)}"
        req = urllib.request.Request(url, headers={"Content-Type": "application/json"}, method="GET")
        with urllib.request.urlopen(req, timeout=10) as response:
            body = response.read().decode("utf-8")
            result = json.loads(body)
        
        models = []
        for model_info in result.get("models", []):
            model_name = model_info.get("name", "").split("/")[-1]
            if model_name and "generateContent" in model_info.get("supportedGenerationMethods", []):
                models.append(model_name)
        
        return models
    except Exception as e:
        print(f"[ERROR] Error listing models: {str(e)[:200]}")
        return []

def test_generate(model, api_version="v1beta"):
    """Test generating content with a model"""
    print(f"\n[TEST] Testing {model} on {api_version}...")
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": "Say 'OK'"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
        },
    }
    
    request_data = json.dumps(payload).encode("utf-8")
    url = f"https://generativelanguage.googleapis.com/{api_version}/models/{model}:generateContent?key={quote(api_key)}"
    
    req = urllib.request.Request(
        url,
        data=request_data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            body = response.read().decode("utf-8")
        
        result = json.loads(body)
        
        if "error" in result:
            error = result["error"]
            print(f"      [ERROR] Error {error.get('code')}: {error.get('message')[:100]}")
            return False
        
        if "candidates" in result and result["candidates"]:
            text = ""
            for part in result["candidates"][0].get("content", {}).get("parts", []):
                text += part.get("text", "")
            print(f"      [OK] Success! Response: {text[:50]}")
            return True
        
        print(f"      [ERROR] No response")
        return False
    
    except Exception as e:
        print(f"      [ERROR] Error: {str(e)[:150]}")
        return False

if __name__ == '__main__':
    print("=" * 70)
    print("GEMINI MODEL DISCOVERY TEST")
    print("=" * 70)
    
    # Test v1beta (should have many models)
    print("\n[1] Discovering v1beta models...")
    v1beta_models = get_available_models(api_key, "v1beta")
    print(f"    Found {len(v1beta_models)} models")
    if v1beta_models:
        print(f"    First 5: {v1beta_models[:5]}")
    
    # Test v1 (should have fewer models)
    print("\n[2] Discovering v1 models...")
    v1_models = get_available_models(api_key, "v1")
    print(f"    Found {len(v1_models)} models")
    if v1_models:
        print(f"    First 5: {v1_models[:5]}")
    
    # Test generation with v1beta models
    print("\n[3] Testing generation with v1beta models...")
    tested = False
    for model in v1beta_models[:3]:  # Test first 3
        if test_generate(model, "v1beta"):
            tested = True
            break
        time.sleep(1)
    
    if not tested and v1_models:
        print("\n[4] v1beta failed, trying v1 models...")
        for model in v1_models[:3]:
            if test_generate(model, "v1"):
                tested = True
                break
            time.sleep(1)
    
    print("\n" + "=" * 70)
    if tested:
        print("[OK] Generation test PASSED")
    else:
        print("[ERROR] Generation test FAILED")
    print("=" * 70)
