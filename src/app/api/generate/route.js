// // src/app/api/generate/route.js
// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req) {
//   try {
//     // 1) Authenticate user
//     const { getUser } = getKindeServerSession();
//     const authUser = await getUser();
//     if (!authUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 2) Ensure DB user exists
//     const dbUser = await prisma.user.upsert({
//       where: { kindeId: authUser.id },
//       update: {},
//       create: {
//         kindeId: authUser.id,
//         email: authUser.email ?? "",
//         firstName: authUser.given_name ?? null,
//         lastName: authUser.family_name ?? null,
//       },
//     });

//     // 3) Parse request
//     const { jobTitle, company, description, type } = await req.json();
//     if (!jobTitle || !company || !description || !type) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // 4) Normalize type with minimal mapping
//     const typeMap = {
//       resume: "RESUME",
//       cover_letter: "COVER_LETTER",
//     };

//     const normalizedType = typeMap[String(type).toLowerCase()] || null;

//     if (!normalizedType) {
//       return NextResponse.json(
//         { error: "Invalid document type (use resume or cover_letter)" },
//         { status: 400 }
//       );
//     }

//     // 5) Load profile fields
//     const userProfile = await prisma.user.findUnique({
//       where: { id: dbUser.id },
//       select: {
//         firstName: true,
//         lastName: true,
//         email: true,
//         address: true,
//         city: true,
//         zipcode: true,
//         phone: true,
//         linkedIn: true,
//         portfolio: true,
//       },
//     });

//     const applicantInfo = `
// Applicant Information:
// Name: ${[userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(" ")}
// Email: ${userProfile?.email ?? ""}
// Phone: ${userProfile?.phone ?? ""}
// Address: ${[userProfile?.address, userProfile?.city, userProfile?.zipcode].filter(Boolean).join(", ")}
// LinkedIn: ${userProfile?.linkedIn ?? ""}
// Portfolio: ${userProfile?.portfolio ?? ""}
// `.trim();

//     // 6) Build prompts
//     const systemPrompt = `You are an expert career coach. Write a professional ${
//       normalizedType === "RESUME" ? "resume" : "cover letter"
//     } using the applicant's details and tailoring it to the job description. Keep formatting clean and professional.`;

//     const userPrompt = `
// ${applicantInfo}

// Job Posting:
// Title: ${jobTitle}
// Company: ${company}
// Description: ${description}
// `;

//     // 7) Call OpenAI API
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const err = await response.json();
//       console.error("OpenAI API error:", err);
//       return NextResponse.json(
//         { error: "Failed to generate document" },
//         { status: 500 }
//       );
//     }

//     const data = await response.json();
//     const generatedContent = data.choices?.[0]?.message?.content ?? "";

//     // 8) Save document
//     const newDoc = await prisma.document.create({
//       data: {
//         title: `${normalizedType} - ${jobTitle} @ ${company}`,
//         type: normalizedType,
//         content: generatedContent,
//         userId: dbUser.id,
//       },
//     });

//     return NextResponse.json({ ok: true, document: newDoc });
//   } catch (error) {
//     console.error("Error generating document:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }







// src/app/api/generate/route.js
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    // 1) Authenticate user
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Ensure DB user exists
    const dbUser = await prisma.user.upsert({
      where: { kindeId: authUser.id },
      update: {},
      create: {
        kindeId: authUser.id,
        email: authUser.email ?? "",
        firstName: authUser.given_name ?? null,
        lastName: authUser.family_name ?? null,
      },
    });

    // 3) Parse request
    const { jobTitle, company, description, type } = await req.json();
    if (!jobTitle || !company || !description || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 4) Normalize type
    const typeMap = {
      resume: "RESUME",
      cover_letter: "COVER_LETTER",
    };
    const normalizedType = typeMap[String(type).toLowerCase()] || null;
    if (!normalizedType) {
      return NextResponse.json(
        { error: "Invalid document type (use resume or cover_letter)" },
        { status: 400 }
      );
    }

    // 5) Load profile fields
    const userProfile = await prisma.user.findUnique({
      where: { id: dbUser.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        city: true,
        zipcode: true,
        phone: true,
        linkedIn: true,
        portfolio: true,
        summary: true,
        skills: true,
        experience: true,
        education: true,
        achievements: true,
      },
    });

    const applicantInfo = `
Applicant Information:
Name: ${[userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(" ")}
Email: ${userProfile?.email ?? ""}
Phone: ${userProfile?.phone ?? ""}
Address: ${[userProfile?.address, userProfile?.city, userProfile?.zipcode].filter(Boolean).join(", ")}
LinkedIn: ${userProfile?.linkedIn ?? ""}
Portfolio: ${userProfile?.portfolio ?? ""}

Summary:
${userProfile?.summary ?? ""}

Skills:
${userProfile?.skills ?? ""}

Experience:
${userProfile?.experience ?? ""}

Education:
${userProfile?.education ?? ""}

Achievements:
${userProfile?.achievements ?? ""}
`.trim();

    // 6) Build prompts
    const systemPrompt = `You are an expert career coach. Write a professional ${
      normalizedType === "RESUME" ? "resume" : "cover letter"
    } using the applicant's details and tailoring it to the job description. Keep formatting clean and professional.`;

    const userPrompt = `
${applicantInfo}

Job Posting:
Title: ${jobTitle}
Company: ${company}
Description: ${description}
`;

    // 7) Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenAI API error:", err);
      return NextResponse.json(
        { error: "Failed to generate document" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content ?? "";

    // 8) Save document
    const newDoc = await prisma.document.create({
      data: {
        title: `${normalizedType} - ${jobTitle} @ ${company}`,
        type: normalizedType,
        content: generatedContent,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({ ok: true, document: newDoc });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}