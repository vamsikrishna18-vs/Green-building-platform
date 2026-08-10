/**
 * GreenBuild Smart Recommendation Rules Engine
 * Generates prioritized, actionable recommendations with roadmap timelines,
 * cost estimates, payback periods, environmental impact metrics,
 * and a Top 3 Recommended Actions ranking.
 */

function generateRecommendations(data, scores) {
  const recommendations = [];
  const { categoryScores = {} } = scores || {};
  const {
    buildingInfo = {},
    energyUsage = {},
    waterConsumption = {},
    materialUsage = {},
    wasteManagement = {},
    renewableEnergy = {},
    greenFeatures = {}
  } = data || {};

  // 1. Energy Recommendations
  if ((categoryScores.energy || 0) < 80) {
    const ledPct = Number(energyUsage.ledLightingPercent) || 0;
    if (ledPct < 80) {
      recommendations.push({
        id: 'rec_led',
        category: 'Energy',
        title: 'Upgrade to High-Efficiency LED Lighting',
        currentCondition: `LED lighting coverage is currently at ${ledPct}%.`,
        recommendedAction: 'Retrofit 100% of incandescent/fluorescent fixtures with smart LEDs.',
        description: 'Replacing legacy lighting fixtures with smart LED systems lowers lighting electricity demand by up to 40%.',
        potentialScoreIncrease: Math.round((1 - (ledPct / 100)) * 6) + 3,
        priority: categoryScores.energy < 50 ? 'High' : 'Medium',
        environmentalBenefit: 'Estimated ~12.5 MT CO2e annual reduction in electricity load.',
        estimatedCarbonReductionMT: 12.5,
        implementationDifficulty: 'Low',
        roadmapTier: 'Quick Wins',
        estimatedCost: '$4,000 - $9,000',
        estimatedAnnualSavings: '$2,800/yr',
        estimatedPaybackYears: 2.2,
        currentValue: `${ledPct}% LED`,
        targetValue: '100% LED Coverage',
        reason: 'Energy category is below target benchmark (score < 80). Smart LED retrofit yields fast 2.2-yr financial payback with +7 score gain.'
      });
    }

    const hvacRating = Number(energyUsage.hvacEfficiencyRating) || 1;
    if (hvacRating < 4) {
      recommendations.push({
        id: 'rec_hvac',
        category: 'Energy',
        title: 'Install High SEER VRF HVAC Heat Pumps',
        currentCondition: `HVAC system rating is currently ${hvacRating} out of 5 stars.`,
        recommendedAction: 'Upgrade legacy HVAC equipment to high-efficiency VRF heat pumps.',
        description: 'High-efficiency heat pumps significantly lower energy use intensity (EUI) during heating & cooling peaks.',
        potentialScoreIncrease: 8,
        priority: 'High',
        environmentalBenefit: 'Cuts building HVAC carbon emissions by up to 35%.',
        estimatedCarbonReductionMT: 28.0,
        implementationDifficulty: 'High',
        roadmapTier: 'Long Term',
        estimatedCost: '$25,000 - $60,000',
        estimatedAnnualSavings: '$7,500/yr',
        estimatedPaybackYears: 5.5,
        currentValue: `${hvacRating} Star Rating`,
        targetValue: '5 Star VRF Rating',
        reason: 'HVAC heating/cooling accounts for the largest share of building operational EUI. Major carbon reduction potential.'
      });
    }

    if (!energyUsage.smartThermostats) {
      recommendations.push({
        id: 'rec_thermostat',
        category: 'Energy',
        title: 'Deploy Smart Occupancy-Based Thermostats',
        currentCondition: 'No smart thermostats installed.',
        recommendedAction: 'Install smart IoT thermostats across all building thermal zones.',
        description: 'Automated scheduling adjusts heating/cooling based on real-time room occupancy.',
        potentialScoreIncrease: 4,
        priority: 'Medium',
        environmentalBenefit: 'Eliminates 10-15% of wasted HVAC energy.',
        estimatedCarbonReductionMT: 6.0,
        implementationDifficulty: 'Low',
        roadmapTier: 'Quick Wins',
        estimatedCost: '$2,500 - $5,000',
        estimatedAnnualSavings: '$1,600/yr',
        estimatedPaybackYears: 2.0,
        currentValue: 'Manual Thermostats',
        targetValue: 'Smart IoT Thermostats',
        reason: 'Eliminates unnecessary thermal conditioning during non-occupancy hours.'
      });
    }
  }

  // 2. Renewable Energy Recommendations
  if ((categoryScores.renewable || 0) < 85) {
    const solarKW = Number(renewableEnergy.solarCapacityKW) || 0;
    if (solarKW < 100) {
      recommendations.push({
        id: 'rec_solar',
        category: 'Renewable Energy',
        title: 'Install Rooftop Solar PV Panels',
        currentCondition: `Solar PV capacity is currently ${solarKW} kW.`,
        recommendedAction: 'Expand rooftop solar array capacity by 100-200 kW.',
        description: 'On-site solar generation offsets grid power reliance and lowers Scope 2 carbon footprint.',
        potentialScoreIncrease: 12,
        priority: categoryScores.renewable < 50 ? 'High' : 'Medium',
        environmentalBenefit: 'Generates zero-carbon clean energy, reducing CO2 emissions by ~45 MT/yr.',
        estimatedCarbonReductionMT: 45.0,
        implementationDifficulty: 'High',
        roadmapTier: 'Long Term',
        estimatedCost: '$30,000 - $75,000',
        estimatedAnnualSavings: '$8,200/yr',
        estimatedPaybackYears: 6.0,
        currentValue: `${solarKW} kW Solar`,
        targetValue: '150+ kW Solar Array',
        reason: 'Highest single score uplift (+12 pts) by directly substituting grid emissions with on-site clean power.'
      });
    }
  }

  // 3. Water Conservation Recommendations
  if ((categoryScores.water || 0) < 80) {
    if (!waterConsumption.lowFlowFixtures) {
      recommendations.push({
        id: 'rec_lowflow',
        category: 'Water',
        title: 'Retrofit Restrooms with Ultra-Low-Flow Fixtures',
        currentCondition: 'Standard water fixtures currently installed.',
        recommendedAction: 'Fit dual-flush valves and low-flow 1.0 GPM aerators across all restrooms.',
        description: 'Ultra-low-flow aerators reduce potable water consumption without compromising pressure.',
        potentialScoreIncrease: 6,
        priority: 'High',
        environmentalBenefit: 'Saves ~350,000 gallons of potable municipal water annually.',
        estimatedCarbonReductionMT: 3.5,
        implementationDifficulty: 'Low',
        roadmapTier: 'Quick Wins',
        estimatedCost: '$2,000 - $4,500',
        estimatedAnnualSavings: '$2,100/yr',
        estimatedPaybackYears: 1.5,
        currentValue: 'Standard Fixtures',
        targetValue: 'Ultra-Low-Flow Aerators',
        reason: 'Lowest cost retrofit ($2k-$4.5k) yielding rapid 1.5-yr payback and saving 350k gallons of municipal water.'
      });
    }
  }

  // 4. Waste Management Recommendations
  if ((categoryScores.waste || 0) < 80) {
    const constrWastePct = Number(wasteManagement.constructionWasteRecycledPercent) || 0;
    if (constrWastePct < 75) {
      recommendations.push({
        id: 'rec_waste_recycling',
        category: 'Waste',
        title: 'Enforce Construction Waste Diversion Protocol',
        currentCondition: `Construction waste diversion is currently ${constrWastePct}%.`,
        recommendedAction: 'Partner with certified recyclers to divert timber, metal, and concrete to 85%+.',
        description: 'Diverting heavy demolition waste away from landfills lowers embodied material footprint.',
        potentialScoreIncrease: 7,
        priority: 'High',
        environmentalBenefit: 'Prevents landfill methane emissions and conserves raw building materials.',
        estimatedCarbonReductionMT: 8.0,
        implementationDifficulty: 'Medium',
        roadmapTier: 'Medium Term',
        estimatedCost: '$3,000 - $7,000',
        estimatedAnnualSavings: '$1,500/yr',
        estimatedPaybackYears: 3.0,
        currentValue: `${constrWastePct}% Recycled`,
        targetValue: '85%+ Diversion Rate',
        reason: 'Prevents landfill disposal fee surcharges and improves building embodied carbon score.'
      });
    }
  }

  // Priority sorting helper ('High' -> 'Medium' -> 'Low')
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Extract Top 3 Recommended Actions
  const top3 = recommendations.slice(0, 3).map((rec, index) => ({
    rank: index + 1,
    title: rec.title,
    category: rec.category,
    currentValue: rec.currentValue || 'Current State',
    targetValue: rec.targetValue || 'Target State',
    expectedScoreImprovement: rec.potentialScoreIncrease || 5,
    estimatedCarbonReduction: `${rec.estimatedCarbonReductionMT || 10} MT/yr`,
    estimatedAnnualSavings: rec.estimatedAnnualSavings || '$2,500/yr',
    estimatedCost: rec.estimatedCost || '$5,000 - $12,000',
    priority: rec.priority || 'High',
    reason: rec.reason || 'Optimal ROI upgrade for building footprint efficiency.'
  }));

  return {
    recommendations,
    top3RecommendedActions: top3
  };
}

module.exports = { generateRecommendations };
