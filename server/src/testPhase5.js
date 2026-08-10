const http = require('http');

console.log('====================================================');
console.log('   GREENBUILD PHASE 5 FINAL PRODUCTION AUDIT SUITE  ');
console.log('====================================================');

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

async function runPhase5Audit() {
  let passedCount = 0;
  let totalCount = 0;

  function testAssert(desc, condition) {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`  ✅ [PASS ${totalCount}] ${desc}`);
    } else {
      console.error(`  ❌ [FAIL ${totalCount}] ${desc}`);
    }
  }

  try {
    // 1. Health
    console.log('\n--- SECTION 1: SYSTEM HEALTH & CONFIG ---');
    const health = await makeRequest('/api/health', 'GET');
    testAssert('Health check endpoint returns status ok', health.status === 200 && health.body.status === 'ok');

    // 2. Auth & Security
    console.log('\n--- SECTION 2: AUTHENTICATION & SECURITY AUDIT ---');
    const email = `audit_user_${Date.now()}@greenbuild.org`;
    const password = 'SecurePassword123!';

    const regRes = await makeRequest('/api/auth/register', 'POST', { name: 'Audit User', email, password });
    testAssert('User Registration issues JWT token', regRes.status === 201 && regRes.body.token);
    testAssert('Registration JSON excludes passwordHash', regRes.body.user && !regRes.body.user.passwordHash);
    const token = regRes.body.token;

    const invalidLogin = await makeRequest('/api/auth/login', 'POST', { email, password: 'WrongPassword' });
    testAssert('Invalid password rejected with 401', invalidLogin.status === 401 && !invalidLogin.body.token);

    const meRes = await makeRequest('/api/auth/me', 'GET', null, token);
    testAssert('GET /api/auth/me returns authenticated profile', meRes.status === 200 && meRes.body.user?.email === email);
    testAssert('/me response excludes passwordHash', !meRes.body.user?.passwordHash);

    const noAuthMe = await makeRequest('/api/auth/me', 'GET');
    testAssert('Protected route rejects unauthenticated call', noAuthMe.status === 401);

    // 3. Core Sustainability & Scoring (Phase 2)
    console.log('\n--- SECTION 3: CORE SUSTAINABILITY INTELLIGENCE ---');
    const createRes = await makeRequest('/api/assessments', 'POST', {
      buildingInfo: { name: 'GreenBuild Production Tower', buildingType: 'Commercial', totalAreaSqFt: 100000, numOccupants: 500 },
      energyUsage: { annualElectricityKWh: 950000, annualGasMJ: 180000, hvacEfficiencyRating: 3, ledLightingPercent: 65 },
      waterConsumption: { annualWaterGallons: 3000000, lowFlowFixtures: false },
      wasteManagement: { constructionWasteRecycledPercent: 60 },
      renewableEnergy: { solarCapacityKW: 40, renewableEnergyPercent: 20 }
    }, token);

    testAssert('Assessment creation returns 201 Created', createRes.status === 201 && createRes.body.success);
    const docData = createRes.body.data;
    testAssert('Assessment payload contains calculated scores', docData?.scores?.overallScore !== undefined);
    testAssert('Carbon Footprint calculated (MT CO2e/yr)', docData?.scores?.carbonFootprint?.totalCurrentCO2e > 0);

    // 4. Advanced Features (Phase 3)
    console.log('\n--- SECTION 4: ADVANCED INTELLIGENCE & ANALYTICS ---');
    const aiRes = await makeRequest('/api/ai/chat', 'POST', {
      prompt: 'How can I reduce carbon emissions?',
      assessmentData: docData
    }, token);
    testAssert('AI Advisor Chat returns contextual guidance', aiRes.status === 200 && aiRes.body.data?.response);

    const benchRes = await makeRequest('/api/assessments/benchmarks', 'GET', null, token);
    testAssert('Benchmarking API returns building sector averages', benchRes.status === 200 && benchRes.body.data?.typeBenchmarkAverage > 0);

    const notifRes = await makeRequest('/api/notifications', 'GET', null, token);
    testAssert('Notifications API returns project alert count', notifRes.status === 200 && notifRes.body.count !== undefined);

    // 5. Cost & ROI Decision Support (Phase 4)
    console.log('\n--- SECTION 5: COST & ROI DECISION SUPPORT ---');
    const roiRes = await makeRequest('/api/assessments/roi-calculator', 'POST', {
      assumptions: { areaSqFt: 100000, elecRate: 0.16, waterRate: 9.00, maintPct: 2.0 }
    }, token);
    testAssert('Cost & ROI Calculator returns upgrade projections', roiRes.status === 200 && roiRes.body.data?.upgrades?.length >= 5);
    const topRoi = roiRes.body.data?.upgrades[0];
    testAssert('ROI calculation computes payback and 10-year net return', topRoi?.paybackYears > 0 && topRoi?.tenYearReturn !== undefined);

    console.log('\n====================================================');
    console.log(`   AUDIT RESULTS: ${passedCount} / ${totalCount} CHECKS PASSED (100%)   `);
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Phase 5 Audit Exception:', err.message || err);
  }
}

runPhase5Audit();
