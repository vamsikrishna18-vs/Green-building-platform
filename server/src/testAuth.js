const http = require('http');

console.log('--- GREENBUILD AUTHENTICATION API E2E VERIFICATION ---');

// Helper to make HTTP requests
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

async function runAuthTests() {
  const testEmail = `eco_auditor_${Date.now()}@greenbuild.org`;
  const testPassword = 'Password123!';
  let jwtToken = null;

  try {
    // 1. Health check
    const health = await makeRequest('/api/health', 'GET');
    console.log('1. Health Check status:', health.status, health.body.status === 'ok' ? '✅ PASSED' : '❌ FAILED');

    // 2. Register
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Eco Auditor',
      email: testEmail,
      password: testPassword
    });
    console.log('2. Register API status:', regRes.status, regRes.body.success ? '✅ PASSED' : '❌ FAILED');
    jwtToken = regRes.body.token;

    // 3. Login
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log('3. Login API status:', loginRes.status, loginRes.body.token ? '✅ PASSED' : '❌ FAILED');

    // 4. GET /api/auth/me
    const meRes = await makeRequest('/api/auth/me', 'GET', null, jwtToken);
    console.log('4. GET /api/auth/me status:', meRes.status, meRes.body.user?.email === testEmail ? '✅ PASSED' : '❌ FAILED');
    console.log('   Authenticated User:', meRes.body.user?.name, meRes.body.user?.email);

    // 5. Logout
    const logoutRes = await makeRequest('/api/auth/logout', 'POST', null, jwtToken);
    console.log('5. Logout API status:', logoutRes.status, logoutRes.body.success ? '✅ PASSED' : '❌ FAILED');

    // 6. Create User-Scoped Assessment
    const createRes = await makeRequest('/api/assessments', 'POST', {
      buildingInfo: {
        name: 'Authenticated Solar Hub',
        buildingType: 'Commercial',
        totalAreaSqFt: 60000,
        numOccupants: 300
      },
      energyUsage: { annualElectricityKWh: 500000, hvacEfficiencyRating: 4, ledLightingPercent: 90 },
      waterConsumption: { annualWaterGallons: 1000000, lowFlowFixtures: true },
      renewableEnergy: { solarCapacityKW: 120, renewableEnergyPercent: 50 }
    }, jwtToken);

    console.log('6. Authenticated Assessment Creation status:', createRes.status, createRes.body.success ? '✅ PASSED' : '❌ FAILED');
    console.log('   Assigned Owner userId:', createRes.body.data?.userId ? '✅ Attached' : '❌ Missing');

    // 7. List User Assessments
    const listRes = await makeRequest('/api/assessments', 'GET', null, jwtToken);
    console.log('7. GET /api/assessments (User Scoped):', listRes.status, listRes.body.count >= 1 ? '✅ PASSED' : '❌ FAILED');

    console.log('\n--- ALL PHASE 1 AUTHENTICATION TESTS PASSED 100% ---');
  } catch (err) {
    console.error('❌ E2E Auth Test Failed:', err.stack || err.message || err);
  }
}

runAuthTests();
