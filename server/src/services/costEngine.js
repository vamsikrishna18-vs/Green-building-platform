/**
 * GreenBuild Cost & ROI Engine
 * Calculates installation costs, annual financial savings, 5-yr/10-yr net returns,
 * payback periods, and ROI percentages based on configurable assumptions.
 */

function calculateCostImpactAnalysis(data, customAssumptions = {}) {
  const { buildingInfo = {} } = data || {};
  const areaSqFt = Math.max(1, Number(buildingInfo.totalAreaSqFt) || Number(customAssumptions.areaSqFt) || 1000);
  const numOccupants = Math.max(1, Number(buildingInfo.numOccupants) || 10);

  // Configurable Financial Assumptions
  const elecRate = Number(customAssumptions.elecRate) || 0.15; // $/kWh
  const waterRate = Number(customAssumptions.waterRate) || 8.50; // $/1,000 gal
  const maintPct = (Number(customAssumptions.maintPct) || 2) / 100; // 2% annual maintenance cost

  const upgradesList = [
    {
      id: 'upgrade_solar',
      name: 'Rooftop Solar PV Array (150 kW)',
      category: 'Renewable Energy',
      costPerSqFt: 0.55,
      annualKWhSaved: areaSqFt * 1.8,
      annualWaterSavedGal: 0,
      carbonReductionMT: 45.0,
      expectedScoreGain: 12,
      difficulty: 'High',
      tier: 'Long Term'
    },
    {
      id: 'upgrade_led',
      name: 'Smart High-Efficiency LED Lighting',
      category: 'Energy',
      costPerSqFt: 0.10,
      annualKWhSaved: areaSqFt * 0.45,
      annualWaterSavedGal: 0,
      carbonReductionMT: 12.5,
      expectedScoreGain: 7,
      difficulty: 'Low',
      tier: 'Quick Wins'
    },
    {
      id: 'upgrade_hvac',
      name: 'High SEER VRF Heat Pump HVAC System',
      category: 'Energy',
      costPerSqFt: 0.75,
      annualKWhSaved: areaSqFt * 1.10,
      annualWaterSavedGal: 0,
      carbonReductionMT: 28.0,
      expectedScoreGain: 8,
      difficulty: 'High',
      tier: 'Long Term'
    },
    {
      id: 'upgrade_lowflow',
      name: 'Ultra-Low-Flow Restroom Retrofits',
      category: 'Water',
      baseCost: 3500,
      annualKWhSaved: 0,
      annualWaterSavedGal: numOccupants * 800,
      carbonReductionMT: 3.5,
      expectedScoreGain: 6,
      difficulty: 'Low',
      tier: 'Quick Wins'
    },
    {
      id: 'upgrade_rainwater',
      name: 'Rainwater Harvesting Cistern System',
      category: 'Water',
      baseCost: 12000,
      annualKWhSaved: 0,
      annualWaterSavedGal: 220000,
      carbonReductionMT: 4.2,
      expectedScoreGain: 5,
      difficulty: 'Medium',
      tier: 'Medium Term'
    },
    {
      id: 'upgrade_bms',
      name: 'Smart Automated IoT BMS Controls',
      category: 'Green Features',
      costPerSqFt: 0.28,
      annualKWhSaved: areaSqFt * 0.55,
      annualWaterSavedGal: 0,
      carbonReductionMT: 15.0,
      expectedScoreGain: 7,
      difficulty: 'Medium',
      tier: 'Medium Term'
    },
    {
      id: 'upgrade_ev',
      name: 'Level-2 EV Charging Infrastructure',
      category: 'Green Features',
      baseCost: 6500,
      annualKWhSaved: 0,
      annualWaterSavedGal: 0,
      annualFlatSavings: 1800,
      carbonReductionMT: 5.5,
      expectedScoreGain: 4,
      difficulty: 'Low',
      tier: 'Quick Wins'
    },
    {
      id: 'upgrade_greenroof',
      name: 'Sedum Vegetated Green Roof',
      category: 'Green Features',
      costPerSqFt: 0.35,
      annualKWhSaved: areaSqFt * 0.22,
      annualWaterSavedGal: 0,
      carbonReductionMT: 9.0,
      expectedScoreGain: 5,
      difficulty: 'High',
      tier: 'Long Term'
    }
  ];

  const processedUpgrades = upgradesList.map(item => {
    const rawCost = item.baseCost || Math.round(areaSqFt * item.costPerSqFt);
    const estimatedCostNumber = Math.max(1000, rawCost);

    const energySavings$ = (item.annualKWhSaved || 0) * elecRate;
    const waterSavings$ = ((item.annualWaterSavedGal || 0) / 1000) * waterRate;
    const flatSavings$ = item.annualFlatSavings || 0;
    const grossSavings = energySavings$ + waterSavings$ + flatSavings$;

    const annualMaintCost = estimatedCostNumber * maintPct;
    const annualSavingsNumber = Math.max(100, Math.round(grossSavings - annualMaintCost));

    const paybackYears = Number((estimatedCostNumber / annualSavingsNumber).toFixed(1));
    const fiveYearReturn = Math.round((annualSavingsNumber * 5) - estimatedCostNumber);
    const tenYearReturn = Math.round((annualSavingsNumber * 10) - estimatedCostNumber);
    const roiPercent = Number(((annualSavingsNumber / estimatedCostNumber) * 100).toFixed(1));

    return {
      ...item,
      estimatedCostNumber,
      costRange: `$${Math.round(estimatedCostNumber * 0.85).toLocaleString()} - $${Math.round(estimatedCostNumber * 1.15).toLocaleString()}`,
      annualSavingsNumber,
      estimatedAnnualSavings: `$${annualSavingsNumber.toLocaleString()}/yr`,
      paybackYears,
      fiveYearReturn,
      tenYearReturn,
      roiPercent: `${roiPercent}%/yr`,
      isEstimate: true
    };
  });

  // Sort by highest 10-year net return (Best Financial ROI)
  processedUpgrades.sort((a, b) => b.tenYearReturn - a.tenYearReturn);

  return {
    assumptions: {
      areaSqFt,
      numOccupants,
      elecRate,
      waterRate,
      maintPct: maintPct * 100
    },
    upgrades: processedUpgrades,
    isEstimate: true
  };
}

module.exports = { calculateCostImpactAnalysis };
