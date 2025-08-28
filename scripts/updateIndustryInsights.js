const { PrismaClient } = require('@prisma/client');
const { recommendedSkills } = require('./fetch-industry-data');

const prisma = new PrismaClient();

async function updateIndustryInsights() {
  try {
    // Process pending industries
    const pendingIndustries = await prisma.pendingIndustry.findMany({ select: { industry: true } });
    for (const { industry } of pendingIndustries) {
      await prisma.industryInsight.upsert({
        where: { industry },
        update: {},
        create: {
          industry,
          salaryRanges: [],
          growthRate: 0,
          demandLevel: 'MEDIUM',
          topSkills: [],
          marketOutlook: 'NEUTRAL',
          keyTrends: [],
          recommendedSkills: [],
          lastUpdated: new Date(),
          nextUpdate: new Date(),
        },
      });
      await prisma.pendingIndustry.delete({ where: { industry } });
      console.log(`Created IndustryInsight for pending industry: ${industry}`);
    }

    // Update all IndustryInsight records
    const industries = await prisma.industryInsight.findMany({ select: { id: true, industry: true } });
    for (const { id, industry } of industries) {
      const data = await recommendedSkills(industry);
      if (data) {
        await prisma.industryInsight.update({
          where: { id },
          data: {
            salaryRanges: data.salaryRanges,
            growthRate: data.growthRate,
            demandLevel: data.demandLevel,
            topSkills: data.topSkills,
            marketOutlook: data.marketOutlook,
            keyTrends: data.keyTrends,
            recommendedSkills: data.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(new Date().setDate(new Date().getDate() + 30)),
          },
        });
        console.log(`Updated IndustryInsight for ${industry}`);
      }
    }
  } catch (error) {
    console.error('Error updating IndustryInsight:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { updateIndustryInsights };

