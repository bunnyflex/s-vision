import os

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()


# Add CSP middleware
@app.middleware("http")
async def add_csp_header(request: Request, call_next):
    response = await call_next(request)
    csp_policy = (
        "script-src 'self' https://unpkg.com 'unsafe-eval'; "
        "connect-src 'self' ws://localhost:8000 ws://localhost:9000 http://localhost:9000;"
    )
    response.headers["Content-Security-Policy"] = csp_policy
    return response


# Serve frontend files
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")


# WebSocket endpoint for future analytics
@app.websocket("/analytics")
async def analytics_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Future frame processing logic here
