import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ message: "Password required" }, { status: 400 });
    }

    if (password === process.env.ADMIN_PASSWORD) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("admin_session", "true", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return res;
    }

    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
