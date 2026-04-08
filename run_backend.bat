@echo off
echo Starting Backend...
cd backend
python -m uvicorn main:app --reload
pause
