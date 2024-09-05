"use client";

import Incoming from "@/components/Incoming";
import Outgoing from "@/components/Outgoing";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';


type Message = {
  content: string;
  fromSelf: boolean
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket|null>(null);

  // const sendMessage = async () => {
  //   if (message.trim()) {
  //     setMessages((prev) => [...prev, {content: message, fromSelf: true}])

  //     const res = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ message }),
  //     });

  //     // if (res.ok) {
  //     setMessage('');
  //     // }
  //   }
  // };
  useEffect(() => {
    const newSocket = new WebSocket('')
  });

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8000/ws');
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prev) => [...prev, { content: newMessage, fromSelf: false }]);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      setMessages((prev) => [...prev, { content: message, fromSelf: true }]);

      socket.send(message);

      setMessage('');
    };
  };

  return (
    <div className="h-[100%] flex flex-col justify-start items-center">
      {/* Chat Header */ }
      <div className="flex justify-between w-[100%] bg-white p-4 text-gray-700 border-b border-gray-300">
        <h1 className="text-2xl font-semibold">Mini chat</h1>
        <button className="bg-black text-white font-bold py-2 px-4  rounded hover:bg-blue-600"
          // onClick={ }
        >
          Logout
        </button>
      </div>


      {/* Chat Messages */ }
      <div className="h-screen w-full overflow-y-auto p-4 pb-36">
        { messages.map((message, index) => (
          <div key={ index }>
            { message.fromSelf === true ? (
              <Outgoing >{ message.content }</Outgoing>
            ) : (
              <Incoming >{ message.content }</Incoming >
            ) }
          </div>
        )) }
      </div>

      {/* Chat Input */ }
      <div className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
        <div className="flex items-center">
          <input
            // ref={ inputRef }
            className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={ (e) => setMessage(e.target.value) }
          />
          <button
            className="bg-indigo-500 text-black px-4 py-2 rounded-md ml-2"
            onClick={ sendMessage }>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
