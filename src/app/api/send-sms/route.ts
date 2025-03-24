import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json(); // Extract body from request
    const API_KEY = process.env.NEXT_PUBLIC_AFROMESSAGE_API_KEY; // Replace with your actual API key
    const FROM = process.env.NEXT_PUBLIC_AFROMESSAGE_IDENTIFIER_ID;
    const SENDER = process.env.NEXT_PUBLIC_AFROMESSAGE_SENDER_NAME;    ;
    const CALLBACK = process.env.NEXT_PUBLIC_AFROMESSAGE_CALLBACK_URL || "https://your-website.com/callback";

    const response = await axios.get("https://api.afromessage.com/api/send", {
      params: {
        from: FROM,
        sender: SENDER,
        to,
        message,
        callback: CALLBACK,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send SMS" }, { status: 500 });
  }
}

// Handle unsupported HTTP methods
export function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
