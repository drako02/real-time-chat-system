import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const { message } = await req.json();

    const response = await fetch('http://localhost:8000/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return NextResponse.json(data);
}