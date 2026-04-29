#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test which Gemini models are available"""

import json
import urllib.request
from urllib.parse import quote

api_key = "AIzaSyByZE20jVx8B_7xnu234Pybgq3Gh50PlXY"

def test_api_version(version):
    print(f"\n📋 Testing Gemini API {version} listModels...")
    try:
        url = f"https://generativelanguage.googleapis.com/{version}/models?key={quote(api_key)}"
        req = urllib.request.Request(url, headers={"Content-Type": "application/json"}, method="GET")
        with urllib.request.urlopen(req, timeout=10) as response:
            body = response.read().decode("utf-8")
            result = json.loads(body)
        
        models = []
        for model_info in result.get("models", []):
            model_name = model_info.get("name", "").split("/")[-1]
            methods = model_info.get("supportedGenerationMethods", [])
            if "generateContent" in methods:
                models.append(model_name)
        
        print(f"✅ Models found on {version}: {models}")
        return models
    except Exception as e:
        print(f"❌ Error: {str(e)[:200]}")
        return []

if __name__ == '__main__':
    v1beta_models = test_api_version("v1beta")
    v1_models = test_api_version("v1")
    
    print("\n📊 Summary:")
    print(f"v1beta: {len(v1beta_models)} models")
    print(f"v1: {len(v1_models)} models")
    
    if v1beta_models:
        print(f"\n✅ Recommend: Use v1beta with model '{v1beta_models[0]}'")
    elif v1_models:
        print(f"\n✅ Recommend: Use v1 with model '{v1_models[0]}'")
    else:
        print("\n❌ No models available - API key may be invalid or restricted")
