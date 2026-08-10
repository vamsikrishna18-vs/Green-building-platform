/**
 * GreenBuild AI Sustainability Advisor Engine
 * Provides contextual advice using actual assessment data.
 * Includes real-world engineering recommendations across Energy, Water, Waste, Renewables, IEQ, and Financial ROI.
 */

async function generateAdvisorResponse(prompt = '', assessmentData = {}, goals = []) {
  const cleanPrompt = (prompt || '').trim().toLowerCase();
  const { buildingInfo = {}, scores = {}, recommendations = [] } = assessmentData || {};
  const { overallScore = 68, rating = 'Good', categoryScores = {}, carbonFootprint = {} } = scores || {};

  // Find lowest scoring categories
  const categories = Object.entries(categoryScores).map(([key, val]) => ({ name: key, score: Number(val) || 0 }));
  categories.sort((a, b) => a.score - b.score);
  const weakestCat = categories[0] || { name: 'Energy', score: 65 };
  const secondWeakestCat = categories[1] || { name: 'Water', score: 70 };

  const topRec = recommendations[0] || {
    title: 'Install Rooftop Solar PV System (150 kW)',
    potentialScoreIncrease: 12,
    estimatedCost: '$45,000 - $75,000'
  };

  let answer = '';

  // 1. Energy Efficiency
  if (cleanPrompt.includes('energy') || cleanPrompt.includes('hvac') || cleanPrompt.includes('lighting') || cleanPrompt.includes('thermostat')) {
    answer = `### ⚡ Energy Efficiency Recommendations for **${buildingInfo.name || 'Your Building'}**\n\n` +
      `Your current Energy Usage score is **${categoryScores.energy || 65}/100**.\n\n` +
      `**Top High-Impact Measures:**\n` +
      `1. **High SEER VRF Heat Pumps & VFDs:** Upgrade HVAC to variable refrigerant flow systems with variable speed drives (+8 pts score uplift).\n` +
      `2. **Smart LED Lighting & Daylight Sensors:** Retrofit 100% of floor space with dimmable LEDs and occupancy sensors (reduces lighting energy load by up to 45%).\n` +
      `3. **Automated BMS & Smart Thermostats:** Install IoT Building Automation Controls for automated setback scheduling during non-peak hours.\n` +
      `4. **High-Performance Building Envelope:** Add double-glazed low-E window films and continuous exterior wall insulation to cut thermal HVAC losses.`;
  }
  // 2. Renewable Energy
  else if (cleanPrompt.includes('renewable') || cleanPrompt.includes('solar') || cleanPrompt.includes('battery')) {
    answer = `### ☀️ Renewable Energy Strategy for **${buildingInfo.name || 'Your Building'}**\n\n` +
      `Your current Renewable Energy score is **${categoryScores.renewable || 55}/100**.\n\n` +
      `**Recommended Solar & Clean Tech Measures:**\n` +
      `1. **Rooftop Solar PV Array:** Install a 150-200 kW solar PV system to generate zero-carbon electricity on site (**+12 to +15 pts score gain**).\n` +
      `2. **Battery Energy Storage System (BESS):** Pair solar with lithium-ion battery storage (50-100 kWh) for peak demand shaving.\n` +
      `3. **Green Grid PPA Procurement:** Sign a 100% clean energy Power Purchase Agreement with your electric utility to offset Scope 2 carbon emissions.\n` +
      `4. **Solar Thermal Hot Water:** Install rooftop evacuated tube collectors for domestic hot water heating.`;
  }
  // 3. Water Conservation
  else if (cleanPrompt.includes('water') || cleanPrompt.includes('rainwater') || cleanPrompt.includes('fixture')) {
    answer = `### 💧 Water Conservation & Rainwater Harvesting\n\n` +
      `Your Water Conservation score is currently **${categoryScores.water || 72}/100**.\n\n` +
      `**Key Water Saving Measures:**\n` +
      `1. **Ultra-Low-Flow Restroom Retrofits:** Replace standard fixtures with 1.0 GPM aerators and 1.1 GPF dual-flush toilets (**Saves ~350,000 gal/yr, +6 pts**).\n` +
      `2. **Rainwater Harvesting Cistern:** Install rooftop rainwater collection tanks for landscape irrigation and toilet flushing.\n` +
      `3. **Greywater Recycling Systems:** Treat sink and shower drainage for non-potable cooling tower makeup water.\n` +
      `4. **Smart Moisture Sensor Irrigation:** Upgrade landscaping drip systems with evapotranspiration weather sensors.`;
  }
  // 4. Operating Cost Reduction & Financial ROI
  else if (cleanPrompt.includes('cost') || cleanPrompt.includes('payback') || cleanPrompt.includes('roi') || cleanPrompt.includes('operating')) {
    answer = `### 💰 Financial ROI & Operational Cost Reduction\n\n` +
      `For **${buildingInfo.name || 'your building'}**, clean technology retrofits offer rapid financial payback:\n\n` +
      `- **Smart LED Retrofit:** Capex ~$12,000 | **Payback: 0.9 Years** | Annual Savings: $13,500/yr\n` +
      `- **Low-Flow Water Fixtures:** Capex ~$3,500 | **Payback: 1.1 Years** | Annual Savings: $3,200/yr\n` +
      `- **VRF HVAC & Smart BMS:** Capex ~$48,000 | **Payback: 3.8 Years** | Annual Savings: $12,800/yr\n` +
      `- **Rooftop Solar PV Array:** Capex ~$75,000 | **Payback: 4.2 Years** | Annual Savings: $17,800/yr\n\n` +
      `*Tip: Use the **ROI Calculator** tab to customize your electricity tariff and financial rates!*`;
  }
  // 5. Carbon Footprint & Decarbonization
  else if (cleanPrompt.includes('carbon') || cleanPrompt.includes('emission') || cleanPrompt.includes('co2') || cleanPrompt.includes('footprint')) {
    const currentCO2 = carbonFootprint.totalCurrentCO2e || 312.5;
    const projectedCO2 = carbonFootprint.projectedCO2e || 192.3;
    const red = carbonFootprint.potentialCO2Reduction || 120.2;
    answer = `### 🌲 Carbon Reduction & Decarbonization Roadmap\n\n` +
      `Current Annual Carbon Footprint: **${currentCO2} MT CO2e/year**\n\n` +
      `**Target Decarbonization Level:** **${projectedCO2} MT CO2e/year** (a **-${red} MT CO2e/yr reduction**, equivalent to planting ~5,400 trees annually!).\n\n` +
      `**3-Step Carbon Reduction Plan:**\n` +
      `1. **Eliminate Scope 2 Electricity Emissions:** Install rooftop Solar PV and switch to green grid power.\n` +
      `2. **Electrify Heating (Scope 1 Elimination):** Replace gas boilers with high SEER electric heat pumps.\n` +
      `3. **Smart Building Management:** Implement automated setback scheduling to cut waste during unoccupied hours.`;
  }
  // 6. Indoor Environmental Quality (IEQ)
  else if (cleanPrompt.includes('indoor') || cleanPrompt.includes('quality') || cleanPrompt.includes('air') || cleanPrompt.includes('ieq')) {
    answer = `### 🌬️ Indoor Environmental Quality (IEQ) & Occupant Wellness\n\n` +
      `High indoor environmental quality improves occupant productivity, health, and building value:\n\n` +
      `1. **MERV-13 / HEPA Ventilation:** Upgrade HVAC filtration to MERV-13 filters to trap particulate matter (PM2.5).\n` +
      `2. **CO2 & VOC Air Sensors:** Install continuous indoor air quality monitors linked to dynamic fresh air ventilation controls.\n` +
      `3. **Low-VOC Materials:** Specify zero-VOC paints, adhesives, sealants, and non-toxic flooring during interior fit-outs.\n` +
      `4. **Biophilic Design & Daylighting:** Maximize natural daylighting with automated glare shades and indoor green walls.`;
  }
  // 7. General Score Improvement / Priority
  else if (cleanPrompt.includes('improve') || cleanPrompt.includes('score') || cleanPrompt.includes('prioritize')) {
    const ptsNeeded = Math.max(1, 85 - overallScore);
    answer = `### 📈 Score Uplift Strategy for **${buildingInfo.name || 'Your Building'}**\n\n` +
      `Your current score is **${overallScore}/100 (${rating})**.\n\n` +
      `To reach an **Outstanding Platinum rating (85+ points)**, focus on your lowest scoring categories: **${weakestCat.name}** (${weakestCat.score}/100) and **${secondWeakestCat.name}** (${secondWeakestCat.score}/100).\n\n` +
      `**Top Priority Retrofit:** ${topRec.title} (**+${topRec.potentialScoreIncrease || 12} pts**).\n\n` +
      `*Action: You can test this exact upgrade in the **Score Simulator** or save it to your **Goals** list!*`;
  }
  // 8. Default Contextual Summary Response
  else {
    answer = `### 📊 Sustainability Evaluation for **${buildingInfo.name || 'Current Building'}**\n\n` +
      `- **Overall Score:** **${overallScore}/100** (${rating})\n` +
      `- **Weakest Category:** ${weakestCat.name} (${weakestCat.score}/100)\n` +
      `- **Annual Carbon Footprint:** ${carbonFootprint.totalCurrentCO2e || 312} MT CO2e/yr\n` +
      `- **#1 Recommended Retrofit:** ${topRec.title} (+${topRec.potentialScoreIncrease || 12} pts)\n\n` +
      `Feel free to ask about energy efficiency, solar PV, water conservation, ROI payback, or carbon reduction!`;
  }

  return {
    response: answer,
    contextSummary: {
      overallScore,
      rating,
      weakestCategory: weakestCat.name,
      topRecommendation: topRec.title
    },
    isAiGenerated: true,
    isFallback: true
  };
}

module.exports = { generateAdvisorResponse };
