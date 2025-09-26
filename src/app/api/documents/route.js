import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// GET: fetch all documents for the logged-in user
export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the matching user in your DB
    const dbUser = await prisma.user.findUnique({
      where: { kindeId: authUser.id }, // match on Kinde's ID
    });

    if (!dbUser) {
      return NextResponse.json([], { status: 200 }); // no user record yet
    }

    // Now fetch documents for this user
    const docs = await prisma.document.findMany({
      where: { userId: dbUser.id }, // use your internal cuid
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(docs);
  } catch (err) {
    console.error("[GET /api/documents] Error:", err);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
