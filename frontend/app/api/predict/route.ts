import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log('Calling:', 'https://diabetis-backend.onrender.com/predict');
  console.log('Body:', body);

  const res = await fetch('https://diabetis-backend.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', data);
  
  return NextResponse.json(data);
}