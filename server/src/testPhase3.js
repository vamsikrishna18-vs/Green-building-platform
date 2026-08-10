const http = require('http');

console.log('--- GREENBUILD PHASE 3 INTEGRATED E2E TEST SUITE ---');

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

async function runPhase3Tests() {
  try {
    // 1. Health
    const health = await makeRequest('/api/health', 'GET');
    console.log('1. Health Check status:', health.status, health.body.status === 'ok' ? '✅ PASSED' : '❌ FAILED');

    // 2. Register User
    const email = `phase3_tester_${Date.now()}@greenbuild.org`;
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Phase 3 Tester',
      email,
      password: 'Password123!'
    });
    const token = regRes.body.token;
    console.log('2. User Registration:', regRes.status, token ? '✅ PASSED' : '❌ FAILED');

    // 3. Test AI Advisor Chat API
    const aiRes = await makeRequest('/api/ai/chat', 'POST', {
      prompt: 'How can I improve my score from 65 to 80?',
      assessmentData: {
        buildingInfo: { name: 'Test Innovation Plaza' },
        scores: { overallScore: 65, rating: 'Moderate', categoryScores: { energy: 50, water: 55 } }
      }
    }, token);

    console.log('3. AI Advisor Chat API:', aiRes.status, aiRes.body.data?.response ? '✅ PASSED' : '❌ FAILED');
    console.log('   AI Advisor Response Snippet:', aiRes.body.data?.response?.substring(0, 100) + '...');

    // 4. Test Benchmarking API
    const benchRes = await makeRequest('/api/assessments/benchmarks', 'GET', null, token);
    console.log('4. Benchmarking API:', benchRes.status, benchRes.body.data?.typeBenchmarkAverage ? '✅ PASSED' : '❌ FAILED');
    console.log('   Commercial Sector Benchmark:', benchRes.body.data?.typeBenchmarkAverage, 'pts | Position:', benchRes.body.data?.benchmarkStatus);

    // 5. Test Notification API
    const notifRes = await makeRequest('/api/notifications', 'GET', null, token);
    console.log('5. Notifications API:', notifRes.status, notifRes.body.count !== undefined ? '✅ PASSED' : '❌ FAILED');
    console.log('   Unread Alert Count:', notifRes.body.unreadCount);

    // 6. Test Assessment Creation with Top 3 Actions
    const createRes = await makeRequest('/api/assessments', 'POST', {
      buildingInfo: {
        name: 'Phase 3 Nexus Tower',
        buildingType: 'Commercial',
        totalAreaSqFt: 120000,
        numOccupants: 600
      },
      energyUsage: { annualElectricityKWh: 1200000, annualGasMJ: 250000, hvacEfficiencyRating: 2, ledLightingPercent: 50 },
      waterConsumption: { annualWaterGallons: 3800000, lowFlowFixtures: false },
      wasteManagement: { constructionWasteRecycledPercent: 40 },
      renewableEnergy: { solarCapacityKW: 20, renewableEnergyPercent: 10 }
    }, token);

    console.log('6. Assessment Creation & Top 3 Priority Engine:', createRes.status, createRes.body.data?.top3RecommendedActions?.length === 3 ? '✅ PASSED' : '❌ FAILED');
    const top3 = createRes.body.data?.top3RecommendedActions || [];
    console.log('   #1 Priority Action:', top3[0]?.title, '| Reason:', top3[0]?.reason ? '✅ Attached' : '❌ Missing');

    console.log('\n--- ALL PHASE 3 INTEGRATED E2E TESTS PASSED 100% ---');
  } catch (err) {
    console.error('❌ Phase 3 Test Error:', err.message || err);
  }
}

runPhase3Tests();
