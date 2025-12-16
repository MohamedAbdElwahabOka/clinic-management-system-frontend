
import { NextResponse } from 'next/server';

export async function GET() {
  // هنا حط الداتا الفيك
  const patients = [
    { id: "1", name: "Ahmed", status: "Waiting" },
    { id: "2", name: "Mona", status: "Done" },
    // ... حط قد ما تقدر
  ];
  return NextResponse.json(patients);
}