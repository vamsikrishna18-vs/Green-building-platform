/**
 * GreenBuild Hackathon Demo Mode Dataset
 * Represents a realistic commercial high-rise ("Nexus EcoTower")
 * designed for 60-second judge walkthroughs.
 */

export const NEXUS_ECOTOWER_DEMO_DATA = {
  _id: 'demo_nexus_ecotower',
  buildingInfo: {
    name: 'Nexus EcoTower (Commercial Demo)',
    buildingType: 'Commercial',
    totalAreaSqFt: 120000,
    numOccupants: 650,
    constructionYear: 2018,
    location: 'Metropolis Financial District'
  },
  energyUsage: {
    annualElectricityKWh: 1450000,
    annualGasMJ: 320000,
    hvacEfficiencyRating: 2,
    ledLightingPercent: 55,
    smartThermostats: false
  },
  waterConsumption: {
    annualWaterGallons: 4200000,
    lowFlowFixtures: false,
    rainwaterHarvesting: false,
    greywaterRecycling: false
  },
  materialUsage: {
    recycledMaterialsPercent: 30,
    sustainablySourcedPercent: 35,
    locallySourcedPercent: 40,
    lowVocMaterials: true
  },
  wasteManagement: {
    constructionWasteRecycledPercent: 45,
    operationalWasteSegregated: false,
    compostingFacility: false
  },
  renewableEnergy: {
    solarCapacityKW: 20,
    renewableEnergyPercent: 15,
    batteryStorageKWh: 0
  },
  greenFeatures: {
    smartBuildingManagementSystem: false,
    greenRoof: false,
    evChargingStations: 2,
    naturalVentilation: true,
    bREEAMorLEEDCertified: false
  },
  scores: {
    overallScore: 58,
    rating: 'Moderate',
    categoryScores: {
      energy: 54,
      water: 55,
      materials: 60,
      waste: 50,
      renewable: 32,
      greenFeatures: 62
    },
    metrics: {
      eui: 13.62,
      waterPerOcc: 6461.5
    },
    carbonFootprint: {
      totalCurrentCO2e: 285.4,
      projectedCO2e: 165.2,
      potentialCO2Reduction: 120.2,
      co2PerSqFtKg: 2.38,
      co2PerOccupantMT: 0.44
    }
  },
  recommendations: [
    {
      id: 'demo_rec_solar',
      category: 'Renewable Energy',
      title: 'Install 200 kW Rooftop Solar Array',
      currentCondition: 'Solar capacity is currently 20 kW.',
      recommendedAction: 'Expand rooftop solar array to 200 kW.',
      description: 'Generates on-site clean zero-emission solar power directly cutting grid emissions.',
      potentialScoreIncrease: 14,
      priority: 'High',
      environmentalBenefit: 'Generates ~220,000 kWh clean power, cutting 65 MT CO2e annually.',
      implementationDifficulty: 'High',
      roadmapTier: 'Long Term',
      estimatedCost: '$45,000 - $90,000',
      estimatedAnnualSavings: '$12,500/yr',
      estimatedPaybackYears: 5.2
    },
    {
      id: 'demo_rec_hvac',
      category: 'Energy',
      title: 'Retrofit VRF Heat Pump HVAC',
      currentCondition: 'HVAC efficiency is 2 Stars.',
      recommendedAction: 'Upgrade to 5 Star VRF Heat Pumps.',
      description: 'High-efficiency heat pumps reduce peak cooling energy intensity.',
      potentialScoreIncrease: 10,
      priority: 'High',
      environmentalBenefit: 'Reduces HVAC electricity demand by 32%.',
      implementationDifficulty: 'High',
      roadmapTier: 'Long Term',
      estimatedCost: '$35,000 - $80,000',
      estimatedAnnualSavings: '$9,800/yr',
      estimatedPaybackYears: 5.8
    },
    {
      id: 'demo_rec_led',
      category: 'Energy',
      title: '100% High-Efficiency LED Lighting',
      currentCondition: 'LED coverage is currently 55%.',
      recommendedAction: 'Upgrade 100% of lighting fixtures to smart LEDs.',
      description: 'Lowers lighting energy demand by 40%.',
      potentialScoreIncrease: 7,
      priority: 'Medium',
      environmentalBenefit: 'Cuts 18 MT CO2e annually.',
      implementationDifficulty: 'Low',
      roadmapTier: 'Quick Wins',
      estimatedCost: '$5,000 - $11,000',
      estimatedAnnualSavings: '$3,400/yr',
      estimatedPaybackYears: 2.1
    }
  ],
  top3RecommendedActions: [
    {
      rank: 1,
      title: 'Install 200 kW Rooftop Solar Array',
      category: 'Renewable Energy',
      currentValue: '20 kW Solar',
      targetValue: '200 kW Solar',
      expectedScoreImprovement: 14,
      estimatedCarbonReduction: '65 MT/yr',
      estimatedAnnualSavings: '$12,500/yr',
      estimatedCost: '$45,000 - $90,000',
      priority: 'High',
      reason: 'Renewable score is lowest (32/100). Largest score gain (+14 pts) & financial return.'
    },
    {
      rank: 2,
      title: 'Retrofit VRF Heat Pump HVAC',
      category: 'Energy',
      currentValue: '2 Star Rating',
      targetValue: '5 Star VRF Rating',
      expectedScoreImprovement: 10,
      estimatedCarbonReduction: '38 MT/yr',
      estimatedAnnualSavings: '$9,800/yr',
      estimatedCost: '$35,000 - $80,000',
      priority: 'High',
      reason: 'HVAC EUI is above target benchmark. Major carbon mitigation.'
    },
    {
      rank: 3,
      title: '100% High-Efficiency LED Lighting',
      category: 'Energy',
      currentValue: '55% LED',
      targetValue: '100% LED Coverage',
      expectedScoreImprovement: 7,
      estimatedCarbonReduction: '18 MT/yr',
      estimatedAnnualSavings: '$3,400/yr',
      estimatedCost: '$5,000 - $11,000',
      priority: 'Medium',
      reason: 'Fastest financial payback (2.1 yrs) and low installation effort.'
    }
  ]
};
