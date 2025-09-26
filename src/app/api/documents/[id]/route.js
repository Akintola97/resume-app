// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// export async function GET(req, { params }) {
//   try {
//     const { getUser } = getKindeServerSession();
//     const authUser = await getUser();
//     if (!authUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Find your internal user
//     const dbUser = await prisma.user.findUnique({
//       where: { kindeId: authUser.id },
//     });

//     if (!dbUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Fetch the document
//     const doc = await prisma.document.findUnique({
//       where: { id: params.id }, // params is safe here
//     });

//     if (!doc || doc.userId !== dbUser.id) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json(doc);
//   } catch (err) {
//     console.error("[GET /api/documents/[id]] Error:", err);
//     return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req, { params }) {
  try {
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { kindeId: authUser.id },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!doc || doc.userId !== dbUser.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (err) {
    console.error("[GET /api/documents/[id]] Error:", err);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { kindeId: authUser.id },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!doc || doc.userId !== dbUser.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.document.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/documents/[id]] Error:", err);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}