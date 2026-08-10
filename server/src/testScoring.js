const { calculateScoring } = require('./services/scoringEngine');
const { generateRecommendations } = require('./services/recommendationEngine');

console.log('--- GREENBUILD SCORING & RECOMMENDATIONS UNIT TEST ---');

// Test Case 1: High Efficiency Building
const sampleBuilding1 = {
  buildingInfo: {
    name: 'EcoTower Test One',
    buildingType: 'Commercial',
    totalAreaSqFt: 100000,
    numOccupants: 400
  },
  energyUsage: {
    annualElectricityKWh: 800000,
    annualGasMJ: 100000,
    hvacEfficiencyRating: 5,
    ledLightingPercent: 100,
    smartThermostats: true
  },
  waterConsumption: {
    annualWaterGallons: 2000000,
    rainwaterHarvesting: true,
    greywaterRecycling: true,
    lowFlowFixtures: true
  },
  materialUsage: {
    recycledMaterialsPercent: 70,
    sustainablySourcedPercent: 80,
    locallySourcedPercent: 90,
    lowVocMaterials: true
  },
  wasteManagement: {
    constructionWasteRecycledPercent: 90,
    operationalWasteSegregated: true,
    compostingFacility: true
  },
  renewableEnergy: {
    solarCapacityKW: 200,
    renewableEnergyPercent: 75,
    batteryStorageKWh: 50
  },
  greenFeatures: {
    greenRoof: true,
    naturalVentilation: true,
    evChargingStations: 10,
    smartBuildingManagementSystem: true,
    bREEAMorLEEDCertified: true
  }
};

const result1 = calculateScoring(sampleBuilding1);
const recs1 = generateRecommendations(sampleBuilding1, result1);

console.log('Test Case 1 Overall Score:', result1.overallScore);
console.log('Test Case 1 Rating:', result1.rating);
console.log('Test Case 1 Category Scores:', result1.categoryScores);
console.log('Test Case 1 Recommendations Count:', recs1.length);
if (result1.overallScore >= 85 && result1.rating === 'Excellent') {
  console.log('✅ Test Case 1 PASSED (Excellent Rating correctly assigned)');
} else {
  console.error('❌ Test Case 1 FAILED');
}

// Test Case 2: Low Efficiency Building
const sampleBuilding2 = {
  buildingInfo: {
    name: 'Legacy Structure Test Two',
    buildingType: 'Commercial',
    totalAreaSqFt: 50000,
    numOccupants: 200
  },
  energyUsage: {
    annualElectricityKWh: 1500000,
    annualGasMJ: 500000,
    hvacEfficiencyRating: 1,
    ledLightingPercent: 10,
    smartThermostats: false
  },
  waterConsumption: {
    annualWaterGallons: 5000000,
    rainwaterHarvesting: false,
    greywaterRecycling: false,
    lowFlowFixtures: false
  },
  materialUsage: {
    recycledMaterialsPercent: 10,
    sustainablySourcedPercent: 5,
    locallySourcedPercent: 10,
    lowVocMaterials: false
  },
  wasteManagement: {
    constructionWasteRecycledPercent: 20,
    operationalWasteSegregated: false,
    compostingFacility: false
  },
  renewableEnergy: {
    solarCapacityKW: 0,
    renewableEnergyPercent: 0,
    batteryStorageKWh: 0
  },
  greenFeatures: {
    greenRoof: false,
    naturalVentilation: false,
    evChargingStations: 0,
    smartBuildingManagementSystem: false,
    bREEAMorLEEDCertified: false
  }
};

const result2 = calculateScoring(sampleBuilding2);
const recs2 = generateRecommendations(sampleBuilding2, result2);

console.log('\nTest Case 2 Overall Score:', result2.overallScore);
console.log('Test Case 2 Rating:', result2.rating);
console.log('Test Case 2 Category Scores:', result2.categoryScores);
console.log('Test Case 2 Recommendations Count:', recs2.length);
if (result2.overallScore < 50 && result2.rating === 'Needs Improvement') {
  console.log('✅ Test Case 2 PASSED (Needs Improvement Rating correctly assigned)');
} else {
  console.error('❌ Test Case 2 FAILED');
}
