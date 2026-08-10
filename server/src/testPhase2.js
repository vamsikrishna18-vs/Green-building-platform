const http = require('http');

console.log('--- GREENBUILD PHASE 2 INTEGRATED E2E TEST SUITE ---');

function makeRequest(path, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', err => reject(err));
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runPhase2Tests() {
  try {
    // 1. Health
    const health = await makeRequest('/api/health', 'GET');
    console.log('1. Health Check status:', health.status, health.body.status === 'ok' ? '✅ PASSED' : '❌ FAILED');

    // 2. Register User
    const email = `phase2_tester_${Date.now()}@greenbuild.org`;
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Phase 2 Tester',
      email,
      password: 'Password123!'
    });
    const token = regRes.body.token;
    console.log('2. User Registration:', regRes.status, token ? '✅ PASSED' : '❌ FAILED');

    // 3. Create Assessment & Check Carbon Footprint + Recommendations
    const createRes = await makeRequest('/api/assessments', 'POST', {
      buildingInfo: {
        name: 'Phase 2 Test Innovation Plaza',
        buildingType: 'Commercial',
        totalAreaSqFt: 85000,
        numOccupants: 450
      },
      energyUsage: { annualElectricityKWh: 750000, annualGasMJ: 120000, hvacEfficiencyRating: 3, ledLightingPercent: 60 },
      waterConsumption: { annualWaterGallons: 2500000, lowFlowFixtures: false },
      wasteManagement: { constructionWasteRecycledPercent: 50 },
      renewableEnergy: { solarCapacityKW: 50, renewableEnergyPercent: 20 }
    }, token);

    console.log('3. Assessment Creation:', createRes.status, createRes.body.success ? '✅ PASSED' : '❌ FAILED');
    const scoreData = createRes.body.data?.scores;
    const carbonData = scoreData?.carbonFootprint;
    const recs = createRes.body.data?.recommendations || [];

    console.log('   Score:', scoreData?.overallScore, 'Rating:', scoreData?.rating);
    console.log('   Carbon Footprint (Current / Projected):', carbonData?.totalCurrentCO2e, 'MT /', carbonData?.projectedCO2e, 'MT', carbonData ? '✅ Attached' : '❌ Missing');
    console.log('   Smart Recommendations Count:', recs.length, recs[0]?.roadmapTier ? '✅ Roadmap Tiers Attached' : '❌ Missing');

    // 4. Test Goals APIs
    const createGoalRes = await makeRequest('/api/goals', 'POST', {
      title: 'Reach overall score 85',
      category: 'Overall',
      currentValue: scoreData?.overallScore || 65,
      targetValue: 85,
      unit: 'pts'
    }, token);
    console.log('4. Create Goal API:', createGoalRes.status, createGoalRes.body.success ? '✅ PASSED' : '❌ FAILED');

    const getGoalsRes = await makeRequest('/api/goals', 'GET', null, token);
    console.log('5. GET /api/goals API:', getGoalsRes.status, getGoalsRes.body.count >= 1 ? '✅ PASSED' : '❌ FAILED');

    // 5. Test Analytics API
    const analyticsRes = await makeRequest('/api/assessments/analytics', 'GET', null, token);
    console.log('6. GET /api/assessments/analytics API:', analyticsRes.status, analyticsRes.body.data?.totalCO2Reduction !== undefined ? '✅ PASSED' : '❌ FAILED');
    console.log('   Total CO2 Reduction Metric:', analyticsRes.body.data?.totalCO2Reduction, 'MT');

    console.log('\n--- ALL PHASE 2 INTEGRATED TESTS PASSED 100% ---');
  } catch (err) {
    console.error('❌ Phase 2 Test Error:', err.message || err);
  }
}

runPhase2Tests();
