from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import fitz
import os
import tempfile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from gtts import gTTS
import re
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.3
)
# Using generic llama-3.1-8b as a safe high-performance fallback for LangChain since some scout models require strict permissions string.

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_DIR = os.path.join(BACKEND_DIR, "pdfs")

DATA_BY_CLASS_SUBJECT = {
    "Class 10": {
        "Science": {
            "Chapter 1": "science/jesc101.pdf",
            "Chapter 2": "science/jesc102.pdf",
            "Chapter 3": "science/jesc103.pdf",
            "Chapter 4": "science/jesc104.pdf",
            "Chapter 5": "science/jesc105.pdf",
            "Chapter 6": "science/jesc106.pdf",
            "Chapter 7": "science/jesc107.pdf",
            "Chapter 8": "science/jesc108.pdf",
            "Chapter 9": "science/jesc109.pdf",
            "Chapter 10": "science/jesc110.pdf",
            "Chapter 11": "science/jesc111.pdf",
            "Chapter 12": "science/jesc112.pdf",
            "Chapter 13": "science/jesc113.pdf",
        },
        "Maths": {
            "Chapter 1": "maths/jemh101.pdf",
            "Chapter 2": "maths/jemh102.pdf",
            "Chapter 3": "maths/jemh103.pdf",
            "Chapter 4": "maths/jemh104.pdf",
            "Chapter 5": "maths/jemh105.pdf",
            "Chapter 6": "maths/jemh106.pdf",
            "Chapter 7": "maths/jemh107.pdf",
            "Chapter 8": "maths/jemh108.pdf",
            "Chapter 9": "maths/jemh109.pdf",
            "Chapter 10": "maths/jemh110.pdf",
            "Chapter 11": "maths/jemh111.pdf",
            "Chapter 12": "maths/jemh112.pdf",
            "Chapter 13": "maths/jemh113.pdf",
            "Chapter 14": "maths/jemh114.pdf",
            "Appendix A1": "maths/jemh1a1.pdf",
            "Appendix A2": "maths/jemh1a2.pdf",
            "Answers": "maths/jemh1an.pdf",
            "Postscript": "maths/jemh1ps.pdf",
        },
        "English": {
            "Chapter 1": "english/jeff101.pdf",
            "Chapter 2": "english/jeff102.pdf",
            "Chapter 3": "english/jeff103.pdf",
            "Chapter 4": "english/jeff104.pdf",
            "Chapter 5": "english/jeff105.pdf",
            "Chapter 6": "english/jeff106.pdf",
            "Chapter 7": "english/jeff107.pdf",
            "Chapter 8": "english/jeff108.pdf",
            "Chapter 9": "english/jeff109.pdf",
            "Postscript": "english/jeff1ps.pdf",
        },
        "Social Science": {
            "Geography: Chapter 1": "social/Geography/jess101.pdf",
            "Geography: Chapter 2": "social/Geography/jess102.pdf",
            "Geography: Chapter 3": "social/Geography/jess103.pdf",
            "Geography: Chapter 4": "social/Geography/jess104.pdf",
            "Geography: Chapter 5": "social/Geography/jess105.pdf",
            "Geography: Chapter 6": "social/Geography/jess106.pdf",
            "Geography: Chapter 7": "social/Geography/jess107.pdf",
            "Geography: Appendix 1": "social/Geography/jess1a1.pdf",
            "Geography: Postscript": "social/Geography/jess1ps.pdf",
            "Economics: Chapter 1": "social/Economics/jess201.pdf",
            "Economics: Chapter 2": "social/Economics/jess202.pdf",
            "Economics: Chapter 3": "social/Economics/jess203.pdf",
            "Economics: Chapter 4": "social/Economics/jess204.pdf",
            "Economics: Chapter 5": "social/Economics/jess205.pdf",
            "Economics: Postscript": "social/Economics/jess2ps.pdf",
            "History: Chapter 1": "social/History/jess301.pdf",
            "History: Chapter 2": "social/History/jess302.pdf",
            "History: Chapter 3": "social/History/jess303.pdf",
            "History: Chapter 4": "social/History/jess304.pdf",
            "History: Chapter 5": "social/History/jess305.pdf",
            "History: Postscript": "social/History/jess3ps.pdf",
            "Political Science: Chapter 1": "social/political/jess401.pdf",
            "Political Science: Chapter 2": "social/political/jess402.pdf",
            "Political Science: Chapter 3": "social/political/jess403.pdf",
            "Political Science: Chapter 4": "social/political/jess404.pdf",
            "Political Science: Chapter 5": "social/political/jess405.pdf",
            "Political Science: Postscript": "social/political/jess4ps.pdf",
        },
        "Hindi Part 1": {
            "Chapter 1": "Hindi/Hindi Part 1/ihks101.pdf",
            "Chapter 2": "Hindi/Hindi Part 1/ihks102.pdf",
            "Chapter 3": "Hindi/Hindi Part 1/ihks103.pdf",
            "Chapter 4": "Hindi/Hindi Part 1/ihks104.pdf",
            "Chapter 5": "Hindi/Hindi Part 1/ihks105.pdf",
            "Chapter 6": "Hindi/Hindi Part 1/ihks106.pdf",
            "Chapter 7": "Hindi/Hindi Part 1/ihks107.pdf",
            "Chapter 8": "Hindi/Hindi Part 1/ihks108.pdf",
            "Chapter 9": "Hindi/Hindi Part 1/ihks109.pdf",
            "Chapter 10": "Hindi/Hindi Part 1/ihks110.pdf",
            "Chapter 11": "Hindi/Hindi Part 1/ihks111.pdf",
            "Chapter 12": "Hindi/Hindi Part 1/ihks112.pdf",
            "Chapter 13": "Hindi/Hindi Part 1/ihks113.pdf",
            "Postscript": "Hindi/Hindi Part 1/ihks1ps.pdf",
        },
        "Hindi Part 2": {
            "Chapter 1": "Hindi/Hindi Part 2/ihsp101.pdf",
            "Chapter 2": "Hindi/Hindi Part 2/ihsp102.pdf",
            "Chapter 3": "Hindi/Hindi Part 2/ihsp103.pdf",
            "Chapter 4": "Hindi/Hindi Part 2/ihsp104.pdf",
            "Chapter 5": "Hindi/Hindi Part 2/ihsp105.pdf",
            "Chapter 6": "Hindi/Hindi Part 2/ihsp106.pdf",
            "Chapter 7": "Hindi/Hindi Part 2/ihsp107.pdf",
            "Chapter 8": "Hindi/Hindi Part 2/ihsp108.pdf",
            "Chapter 9": "Hindi/Hindi Part 2/ihsp109.pdf",
            "Chapter 10": "Hindi/Hindi Part 2/ihsp110.pdf",
            "Postscript": "Hindi/Hindi Part 2/ihsp1ps.pdf",
        }
    },
    "Class 9": {
        "Science": {
            "Chapter 1": "mock_sci_901.pdf",
        },
        "Maths": {
            "Chapter 1": "mock_math_901.pdf",
        }
    }
}


# Current active mapping (defaults to Class 10 Science)
chapters_dict = DATA_BY_CLASS_SUBJECT["Class 10"]["Science"]



def get_page_context(chapter_name: str, page_num: int):
    if chapter_name not in chapters_dict:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    pdf_path = os.path.join(PDF_DIR, chapters_dict[chapter_name])
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")
        
    doc = fitz.open(pdf_path)
    page_index = page_num - 1
    if page_index < 0 or page_index >= len(doc):
        raise HTTPException(status_code=400, detail="Invalid page number")
        
    page_text = doc[page_index].get_text()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
    chunks = splitter.split_text(page_text)
    return "\n".join(chunks[:2])

class ExplainRequest(BaseModel):
    chapter: str
    page: int

import uuid

audio_store = {}

# Global chat websocket state
connected_users = {}

async def broadcast(message: dict):
    """Send a JSON message to all connected chat clients."""
    dead_sockets = []
    for ws in connected_users:
        try:
            await ws.send_json(message)
        except Exception:
            dead_sockets.append(ws)

    for ws in dead_sockets:
        connected_users.pop(ws, None)

async def publish_users_list():
    await broadcast({
        "type": "users",
        "users": list(connected_users.values())
    })

@app.get("/chapters")
def get_chapters(className: str = "Class 10", subject: str = "Science"):
    global chapters_dict
    
    # Get class data
    class_data = DATA_BY_CLASS_SUBJECT.get(className, DATA_BY_CLASS_SUBJECT["Class 10"])
    
    # Get subject data
    chapters = class_data.get(subject, class_data.get("Science"))
    
    # Update global reference for other endpoints (backward compatibility)
    chapters_dict = chapters
    
    return chapters


    # Detect if it's a Hindi PDF based on the path
    pdf_path = chapters_dict.get(req.chapter, "")
    is_hindi_subject = "Hindi/" in pdf_path
    
    language_instruction = "Respond in Hindi." if is_hindi_subject else "Respond in English."
    if is_hindi_subject:
        prompt = f"""
You are an expert Hindi school teacher.

Goal: The student should understand the full page clearly after reading once.

Explain the content in a detailed but concise structured way in Hindi.

Output EXCLUSIVELY in valid JSON format with these exact keys (keys must be in English):
"overview", "conceptExplanation", "activities", "examples", "keyPoints" (array of strings), "finalUnderstanding".

Format of the values should be in HINDI:
- overview: What the page is about (in Hindi)
- conceptExplanation: Explain concepts step-by-step (in Hindi)
- activities: Explain tasks and how to solve them (in Hindi)
- examples: Give simple real-life examples (in Hindi)
- keyPoints: Important bullet points (array of strings in Hindi)
- finalUnderstanding: Connect everything (in Hindi)

Rules:
- Use simple Hindi language
- Be clear and structured
- Avoid unnecessary length

Content:
{context[:1500]}
"""
    else:
        prompt = f"""
You are an expert school teacher.

Goal: The student should understand the full page clearly after reading once.

Explain the content in a detailed but concise structured way.

Output EXCLUSIVELY in valid JSON format with these exact keys:
"overview", "conceptExplanation", "activities", "examples", "keyPoints" (array of strings), "finalUnderstanding".

Format of the values should be:
- overview: What the page is about
- conceptExplanation: Explain concepts step-by-step
- activities: Explain tasks and how to solve them
- examples: Give simple real-life examples
- keyPoints: Important bullet points (array)
- finalUnderstanding: Connect everything
Rules:
- Use simple language
- Be clear and structured
- Avoid unnecessary length

Content:
{context[:1500]}
"""
    response = llm.invoke(prompt).content
    try:
        json_str = response
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0]
        
        parsed = json.loads(json_str.strip())
        
        # Robust case-insensitive extraction
        def get_val(key_options, default=""):
            for k, v in parsed.items():
                if k.lower().replace(" ", "") in [opt.replace(" ", "") for opt in key_options]: 
                    return v
            return default
            
        final_json = {
            "overview": get_val(["overview"]),
            "conceptExplanation": get_val(["conceptexplanation", "concept explanation", "concept", "conceptexplanations"]),
            "activities": get_val(["activities", "exercises", "activitiesorexercises"]),
            "examples": get_val(["examples", "example"]),
            "keyPoints": get_val(["keypoints", "key points", "key"], []),
            "finalUnderstanding": get_val(["finalunderstanding", "final understanding", "final"]),
        }
        
        audio_id = str(uuid.uuid4())
        audio_store[audio_id] = response
        final_json["audioId"] = audio_id
        
        return final_json
    except Exception as e:
        audio_id = str(uuid.uuid4())
        error_msg = f"Error: {str(e)}"
        audio_store[audio_id] = error_msg
        return {
            "overview": "Explanation unavailable:",
            "conceptExplanation": error_msg,
            "activities": "",
            "examples": "",
            "keyPoints": [],
            "finalUnderstanding": "",
            "audioId": audio_id
        }

class AskRequest(BaseModel):
    chapter: str
    page: int
    question: str

class QuizRequest(BaseModel):
    chapter: str
    page: int

@app.post("/quiz")
def generate_quiz(req: QuizRequest):
    context = get_page_context(req.chapter, req.page)
    
    # Detect if it's a Hindi PDF based on the path
    pdf_path = chapters_dict.get(req.chapter, "")
    is_hindi_subject = "Hindi/" in pdf_path

    if is_hindi_subject:
        prompt = f"""
You are an expert Hindi school teacher.

Create 3 fun and engaging MCQ questions from the content provided IN HINDI.

Rules:
- 4 options (A, B, C, D) for each question (options in Hindi)
- Provide the correct answer (A, B, C, or D)
- Provide a short, encouraging explanation for each answer IN HINDI

Output EXCLUSIVELY in valid JSON format with this exact structure (keys in English):
{{
  "questions": [
    {{
      "id": 1,
      "question": "...",
      "options": {{
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      }},
      "answer": "A",
      "explanation": "..."
    }},
    ...
  ]
}}

Content:
{context[:1200]}
"""
    else:
        prompt = f"""
You are an expert school teacher.

Create 3 fun and engaging MCQ questions from the content provided.

Rules:
- 4 options (A, B, C, D) for each question
- Provide the correct answer
- Provide a short, encouraging explanation for each answer

Output EXCLUSIVELY in valid JSON format with this exact structure:
{{
  "questions": [
    {{
      "id": 1,
      "question": "...",
      "options": {{
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      }},
      "answer": "A",
      "explanation": "..."
    }},
    ...
  ]
}}

Content:
{context[:1200]}
"""
    response = llm.invoke(prompt).content
    try:
        json_str = response
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0]
            
        return json.loads(json_str.strip())
    except Exception as e:
        # Fallback if JSON parsing fails
        return {"error": "Failed to generate quiz", "raw": response}

@app.post("/ask")
def ask_question(req: AskRequest):
    context = get_page_context(req.chapter, req.page)
    
    # Detect if it's a Hindi PDF based on the path
    pdf_path = chapters_dict.get(req.chapter, "")
    is_hindi_subject = "Hindi/" in pdf_path

    if is_hindi_subject:
        prompt = f"""
Use this content:
{context}

Answer clearly IN HINDI:
{req.question}
"""
    else:
        prompt = f"""
Use this content:
{context}

Answer clearly:
{req.question}
"""
    answer = llm.invoke(prompt).content
    return {"answer": answer}

def clean_for_tts(text):
    text = re.sub(r"\(.*?\)", "", text)
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"\{.*?\}", "", text)
    text = re.sub(r"[#*_`~]", "", text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace(":", ". ")
    return text.strip()

@app.get("/audio/{audio_id}")
def get_audio(audio_id: str):
    text = audio_store.get(audio_id)
    if not text:
        raise HTTPException(status_code=404, detail="Audio not found")
        
    clean_text = clean_for_tts(text)
    
    # Simple heuristic to detect Hindi: check for Devanagari characters
    is_hindi = any('\u0900' <= char <= '\u097F' for char in clean_text)
    lang = 'hi' if is_hindi else 'en'
    
    tts = gTTS(clean_text, lang=lang)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(temp_file.name)
    return FileResponse(temp_file.name, media_type="audio/mpeg")

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    username = None
    try:
        # First payload must include logged-in user name.
        first_msg = await websocket.receive_json()
        username = (first_msg or {}).get("user")

        if not username:
            await websocket.close(code=1008)
            return

        connected_users[websocket] = username
        print(f"{username} joined")

        await broadcast({
            "type": "system",
            "message": f"{username} joined the chat"
        })
        await publish_users_list()

        while True:
            data = await websocket.receive_json()
            message = (data or {}).get("message", "").strip()
            if not message:
                continue

            print(f"{username}: {message}")
            await broadcast({
                "type": "chat",
                "user": username,
                "message": message
            })

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        if websocket in connected_users:
            left_user = connected_users.pop(websocket)
            print(f"{left_user} left")
            await broadcast({
                "type": "system",
                "message": f"{left_user} left the chat"
            })
            await publish_users_list()
