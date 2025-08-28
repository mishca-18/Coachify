import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { ClerkUserId: userId },
      select: { industry: true },
    });

    if (!user?.industry) {
      return new Response(JSON.stringify({ error: "User industry not set" }), { status: 400 });
    }

    const insight = await prisma.industryInsight.findUnique({
      where: { industry: user.industry },
      select: { recommendedSkills: true, keyTrends: true },
    });

    if (!insight) {
      return new Response(JSON.stringify({ error: "Industry insights not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(insight), {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("industry-insights: Error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch insights" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}