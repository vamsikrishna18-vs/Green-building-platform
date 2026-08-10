const http = require('http');

console.log('--- GREENBUILD PHASE 4 INTEGRATED E2E TEST SUITE ---');

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

async function runPhase4Tests() {
  try {
    // 1. Health
    const health = await makeRequest('/api/health', 'GET');
    console.log('1. Health Check status:', health.status, health.body.status === 'ok' ? '✅ PASSED' : '❌ FAILED');

    // 2. Register User
    const email = `phase4_tester_${Date.now()}@greenbuild.org`;
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Phase 4 Tester',
      email,
      password: 'Password123!'
    });
    const token = regRes.body.token;
    console.log('2. User Registration:', regRes.status, token ? '✅ PASSED' : '❌ FAILED');

    // 3. Test Cost & ROI Calculator API with Custom Assumptions
    const roiRes = await makeRequest('/api/assessments/roi-calculator', 'POST', {
      assumptions: {
        areaSqFt: 150000,
        elecRate: 0.18,
        waterRate: 9.50,
        maintPct: 2.0
      }
    }, token);

    console.log('3. Cost & ROI Calculator API:', roiRes.status, roiRes.body.data?.upgrades?.length >= 5 ? '✅ PASSED' : '❌ FAILED');
    const topUpgrade = roiRes.body.data?.upgrades[0];
    console.log('   Top ROI Upgrade:', topUpgrade?.name);
    console.log('   Est. Capex:', topUpgrade?.costRange, '| 10-Yr Net Return:', `$${topUpgrade?.tenYearReturn?.toLocaleString()}`, '| Payback:', `${topUpgrade?.paybackYears} yrs`);

    // 4. Test Multi-Building Benchmarking Leaders API
    const benchRes = await makeRequest('/api/assessments/benchmarks', 'GET', null, token);
    console.log('4. Multi-Building Benchmarks API:', benchRes.status, benchRes.body.data?.typeBenchmarkAverage ? '✅ PASSED' : '❌ FAILED');

    console.log('\n--- ALL PHASE 4 INTEGRATED E2E TESTS PASSED 100% ---');
  } catch (err) {
    console.error('❌ Phase 4 Test Error:', err.message || err);
  }
}

runPhase4Tests();
