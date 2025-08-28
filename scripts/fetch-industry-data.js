const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.restful-api.dev',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Mock industry-specific data
const industryDataMap = {
  'Software Development': {
    salaryRanges: [
      { role: 'Developer', min: 50000, max: 100000, median: 75000, location: 'Global' },
      { role: 'Manager', min: 80000, max: 150000, median: 115000, location: 'Global' },
    ],
    growthRate: 5.0,
    demandLevel: 'HIGH',
    topSkills: ['JavaScript', 'Python', 'SQL'],
    marketOutlook: 'POSITIVE',
    keyTrends: ['AI Adoption', 'Cloud Computing', 'Low-Code Platforms'],
    recommendedSkills: ['TypeScript', 'React', 'AWS'],
  },
  'Data Science': {
    salaryRanges: [
      { role: 'Data Scientist', min: 60000, max: 120000, median: 90000, location: 'Global' },
      { role: 'ML Engineer', min: 70000, max: 140000, median: 105000, location: 'Global' },
    ],
    growthRate: 6.5,
    demandLevel: 'HIGH',
    topSkills: ['Python', 'R', 'TensorFlow'],
    marketOutlook: 'POSITIVE',
    keyTrends: ['Big Data Analytics', 'AI Ethics', 'Automated ML'],
    recommendedSkills: ['Pandas', 'PyTorch', 'SQL'],
  },
  'Cybersecurity': {
    salaryRanges: [
      { role: 'Security Analyst', min: 55000, max: 110000, median: 82500, location: 'Global' },
      { role: 'Security Manager', min: 85000, max: 160000, median: 122500, location: 'Global' },
    ],
    growthRate: 4.8,
    demandLevel: 'MEDIUM',
    topSkills: ['Penetration Testing', 'SIEM', 'Cryptography'],
    marketOutlook: 'NEUTRAL',
    keyTrends: ['Zero Trust Architecture', 'Quantum Security', 'Cyber Threat Intelligence'],
    recommendedSkills: ['Wireshark', 'Kali Linux', 'CISSP'],
  },
  // Add more industries as needed
};

async function recommendedSkills(industry) {
  try {
    // Simulate API call (replace with real API later)
    await apiClient.get('/objects');
    // Return industry-specific data or default to Software Development
    return industryDataMap[industry] || industryDataMap['Software Development'];
  } catch (error) {
    console.error(`Error fetching data for ${industry}:`, error.message);
    return null;
  }
}

module.exports = { recommendedSkills };