const cron = require('node-cron');
const { updateIndustryInsights } = require('./update-industry-insights');

async function runUpdate() {
  console.log('Running IndustryInsight update...');
  await updateIndustryInsights();
  console.log('Update complete.');
}

cron.schedule('0 0 1 * *', runUpdate);

if (process.argv.includes('--run-now')) {
  runUpdate().catch(console.error);
}