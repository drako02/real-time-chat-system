from fastapi import FastAPI, WebSocket, Request, WebSocketDisconnect
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients: List[WebSocket] = []

# class Message(BaseModel):
#     message:str

# @app.post('/send_message')
# async def send_message(msg: Message):
#     for connection in connections:
#         await connection.send_text(msg.message)

#     return {"message": msg.message}

@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            for client in connected_clients:
                if(client != websocket):
                    await client.send_text(data)

    except WebSocketDisconnect:
        connected_clients.remove(websocket)