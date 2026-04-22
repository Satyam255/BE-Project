import pandas as pd
import json
import requests
import os
import re

# --- CONFIGURATION ---
CSV_FILE = 'input_questions.csv'
JSON_FILE = 'question_dataset.json'
OLLAMA_URL = 'http://localhost:11434/api/generate'
OLLAMA_MODEL = 'llama3' 
BATCH_SIZE = 20

# Rule-Based Classification Dictionary
TOPIC_RULES = {
    "React": ["component", "hooks", "state", "virtual dom", "props", "useeffect", "usememo", "usecallback"],
    "Python": ["list", "tuple", "dictionary", "lambda", "gil", "decorator", "generator"],
    "MongoDB": ["collection", "document", "aggregation", "nosql", "sharding", "replica set"],
    "Node.js": ["event loop", "express", "npm", "callback", "non-blocking", "v8"],
    "System Design": ["load balancer", "microservices", "caching", "cap theorem", "sharding"],
    "SQL": ["join", "index", "normalization", "foreign key", "acid", "group by"],
    "Docker": ["container", "image", "dockerfile", "volume", "compose"]
}

def load_csv(file_path):
    """Loads CSV, drops empty rows, and returns a list of dictionaries."""
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return []
    
    try:
        # Load CSV and drop rows where 'question' is NaN
        df = pd.read_csv(file_path)
        df.dropna(subset=['question'], inplace=True)
        return df.to_dict('records')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []

def normalize_difficulty(diff_str):
    """Normalizes difficulty strings to Title Case (Easy, Medium, Hard)."""
    if pd.isna(diff_str) or not str(diff_str).strip():
        return "Medium" # Default fallback
    
    diff_str = str(diff_str).strip().lower()
    if diff_str in ['easy', 'medium', 'hard']:
        return diff_str.capitalize()
    return "Medium"

def classify_with_rules(question_text):
    """
    Checks the question against TOPIC_RULES.
    Returns (topic, matched_keywords) if a match is found, else (None, []).
    """
    q_lower = str(question_text).lower()
    
    for topic, keywords in TOPIC_RULES.items():
        matched = []
        for kw in keywords:
            # Use regex to match whole words only to prevent partial matches
            if re.search(rf'\b{re.escape(kw.lower())}\b', q_lower):
                matched.append(kw)
        
        if matched:
            return topic, matched
            
    return None, []

def send_to_ollama(batch_questions):
    """
    Sends a batch of questions to the local Ollama LLM for classification.
    Returns a list of parsed JSON objects.
    """
    print(f"Sending batch of {len(batch_questions)} to Ollama ({OLLAMA_MODEL})...")
    
    prompt = f"""
    You are an expert technical interviewer. Classify the following list of interview questions.
    For each question, determine the 'topic', the 'difficulty' (Easy, Medium, Hard), and extract 3 to 5 'ideal_keywords'.
    
    Return ONLY a valid JSON array of objects. Do NOT wrap it in markdown block quotes. Use this exact structure:
    [
      {{
        "question": "<exact_original_question>",
        "topic": "<topic>",
        "difficulty": "<difficulty>",
        "ideal_keywords": ["kw1", "kw2"]
      }}
    ]

    Questions to process:
    {json.dumps(batch_questions, indent=2)}
    """
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json" # Forces Ollama to strictly output JSON
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        
        # Parse the JSON response
        result_json = json.loads(data['response'])
        return result_json
    except json.JSONDecodeError:
        print("Error: Ollama returned invalid JSON.")
        return []
    except Exception as e:
        print(f"Error communicating with Ollama: {e}")
        return []

def append_to_json(new_entries, file_path):
    """Appends new entries to the JSON file, ensuring valid JSON array structure."""
    if not new_entries:
        return

    existing_data = []
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except json.JSONDecodeError:
            print("Existing JSON file is corrupt. Overwriting.")
            existing_data = []

    existing_data.extend(new_entries)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully appended {len(new_entries)} questions to {file_path}.")

def get_state(file_path):
    """Retrieves the next available ID and a set of already processed questions to avoid duplicates."""
    seen_questions = set()
    next_id_num = 1
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data:
                    seen_questions.add(item.get('question', '').strip().lower())
                    # Parse 'q12' to get the integer 12
                    q_id_str = item.get('id', 'q0')
                    try:
                        num = int(q_id_str.replace('q', ''))
                        if num >= next_id_num:
                            next_id_num = num + 1
                    except ValueError:
                        pass
        except:
            pass
            
    return next_id_num, seen_questions

def main():
    print("Starting processing pipeline...")
    
    # 1. Initialize State
    next_id, seen_questions = get_state(JSON_FILE)
    
    # 2. Load CSV
    csv_rows = load_csv(CSV_FILE)
    if not csv_rows:
        return
        
    unclassified_batch = []
    ready_to_save = []
    
    # 3. Process Rows
    for row in csv_rows:
        question_text = str(row.get('question', '')).strip()
        
        # Edge Case: Skip empty or duplicate questions
        if not question_text or question_text.lower() in seen_questions:
            continue
            
        seen_questions.add(question_text.lower())
        difficulty = normalize_difficulty(row.get('difficulty'))
        
        # Try Rule-Based Classification
        topic, matched_keywords = classify_with_rules(question_text)
        
        if topic:
            # Successfully classified via rules
            new_entry = {
                "id": f"q{next_id}",
                "topic": topic,
                "difficulty": difficulty,
                "question": question_text,
                "ideal_keywords": matched_keywords
            }
            ready_to_save.append(new_entry)
            next_id += 1
        else:
            # Needs LLM classification
            unclassified_batch.append(question_text)
            
        # 4. Trigger Batch LLM processing
        if len(unclassified_batch) >= BATCH_SIZE:
            llm_results = send_to_ollama(unclassified_batch)
            
            for llm_res in llm_results:
                new_entry = {
                    "id": f"q{next_id}",
                    "topic": llm_res.get("topic", "Unclassified"),
                    "difficulty": normalize_difficulty(llm_res.get("difficulty")),
                    "question": llm_res.get("question", "Error missing question"),
                    "ideal_keywords": llm_res.get("ideal_keywords", [])
                }
                ready_to_save.append(new_entry)
                next_id += 1
                
            unclassified_batch.clear()

    # 5. Process remaining unclassified questions (leftovers < 20)
    if unclassified_batch:
        llm_results = send_to_ollama(unclassified_batch)
        for llm_res in llm_results:
            new_entry = {
                "id": f"q{next_id}",
                "topic": llm_res.get("topic", "Unclassified"),
                "difficulty": normalize_difficulty(llm_res.get("difficulty")),
                "question": llm_res.get("question", "Error missing question"),
                "ideal_keywords": llm_res.get("ideal_keywords", [])
            }
            ready_to_save.append(new_entry)
            next_id += 1
        unclassified_batch.clear()

    # 6. Save final results
    if ready_to_save:
        append_to_json(ready_to_save, JSON_FILE)
    else:
        print("No new questions to process (all skipped or duplicated).")

    print("Pipeline complete!")

if __name__ == "__main__":
    main()