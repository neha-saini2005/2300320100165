import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/");
  const url = `http://4.224.186.213/${path}${request.nextUrl.search}`;
  const headers: Record<string, string> = {};
  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;
  const res = await fetch(url, { headers });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/");
  const url = `http://4.224.186.213/${path}`;
  const body = await request.json();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}