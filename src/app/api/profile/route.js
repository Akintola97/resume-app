// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { prisma } from "@/lib/prisma";

// // GET /api/profile
// export async function GET() {
//   try {
//     const { getUser } = getKindeServerSession();
//     const authUser = await getUser();

//     if (!authUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     let user = await prisma.user.findUnique({
//       where: { kindeId: authUser.id },
//     });

//     if (!user) {
//       user = {
//         kindeId: authUser.id,
//         firstName: authUser.given_name || "",
//         lastName: authUser.family_name || "",
//         email: authUser.email || "",
//         address: "",
//         city: "",
//         zipcode: "",
//         phone: "",
//         linkedIn: "",
//         portfolio: "",
//       };
//     }

//     return NextResponse.json({ ok: true, user });
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// // PUT /api/profile
// export async function PUT(req) {
//   try {
//     const { getUser } = getKindeServerSession();
//     const authUser = await getUser();

//     if (!authUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const {
//       firstName,
//       lastName,
//       email,
//       address,
//       city,
//       zipcode,
//       phone,
//       linkedIn,
//       portfolio,
//     } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     const updatedUser = await prisma.user.upsert({
//       where: { kindeId: authUser.id },
//       update: {
//         firstName,
//         lastName,
//         email,
//         address,
//         city,
//         zipcode,
//         phone,
//         linkedIn,
//         portfolio,
//       },
//       create: {
//         kindeId: authUser.id,
//         firstName: firstName || authUser.given_name || null,
//         lastName: lastName || authUser.family_name || null,
//         email: email || authUser.email,
//         address,
//         city,
//         zipcode,
//         phone,
//         linkedIn,
//         portfolio,
//       },
//     });

//     return NextResponse.json({ ok: true, user: updatedUser });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }





import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/profile
export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { kindeId: authUser.id },
    });

    if (!user) {
      user = {
        kindeId: authUser.id,
        firstName: authUser.given_name || "",
        lastName: authUser.family_name || "",
        email: authUser.email || "",
        address: "",
        city: "",
        zipcode: "",
        phone: "",
        linkedIn: "",
        portfolio: "",
        summary: "",
        skills: "",
        experience: "",
        education: "",
        achievements: "",
      };
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PUT /api/profile
export async function PUT(req) {
  try {
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      firstName,
      lastName,
      email,
      address,
      city,
      zipcode,
      phone,
      linkedIn,
      portfolio,
      summary,
      skills,
      experience,
      education,
      achievements,
    } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.upsert({
      where: { kindeId: authUser.id },
      update: {
        firstName,
        lastName,
        email,
        address,
        city,
        zipcode,
        phone,
        linkedIn,
        portfolio,
        summary,
        skills,
        experience,
        education,
        achievements,
      },
      create: {
        kindeId: authUser.id,
        firstName: firstName || authUser.given_name || null,
        lastName: lastName || authUser.family_name || null,
        email: email || authUser.email,
        address,
        city,
        zipcode,
        phone,
        linkedIn,
        portfolio,
        summary,
        skills,
        experience,
        education,
        achievements,
      },
    });

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
