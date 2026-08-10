/**
 * GreenBuild Scoring Methodology Engine
 * Calculates category scores (0-100), overall weighted score (0-100),
 * and estimated annual carbon footprint.
 */
const { calculateCarbonFootprint } = require('./carbonEngine');

function calculateScoring(data) {
  const {
    buildingInfo = {},
    energyUsage = {},
    waterConsumption = {},
    materialUsage = {},
    wasteManagement = {},
    renewableEnergy = {},
    greenFeatures = {}
  } = data;

  const totalArea = Math.max(1, Number(buildingInfo.totalAreaSqFt) || 1000);
  const numOccupants = Math.max(1, Number(buildingInfo.numOccupants) || 10);
  const buildingType = buildingInfo.buildingType || 'Commercial';

  // -------------------------------------------------------------
  // 1. Energy Usage & Efficiency Score (Weight: 25%)
  // -------------------------------------------------------------
  const elecKWh = Number(energyUsage.annualElectricityKWh) || 0;
  const gasMJ = Number(energyUsage.annualGasMJ) || 0;
  const totalKWhEquivalent = elecKWh + (gasMJ * 0.277778);
  const eui = totalKWhEquivalent / totalArea; // kWh / sq ft / yr

  let targetEUI = 20; // Default Commercial
  if (buildingType === 'Residential') targetEUI = 12;
  else if (buildingType === 'Industrial') targetEUI = 35;
  else if (buildingType === 'Mixed-Use') targetEUI = 18;

  let euiPoints = 40;
  if (eui > targetEUI) {
    const excess = eui - targetEUI;
    euiPoints = Math.max(0, 40 * (1 - excess / (targetEUI * 1.5)));
  }

  const hvacRating = Math.min(5, Math.max(1, Number(energyUsage.hvacEfficiencyRating) || 1));
  const hvacPoints = (hvacRating / 5) * 30;

  const ledPercent = Math.min(100, Math.max(0, Number(energyUsage.ledLightingPercent) || 0));
  const ledPoints = (ledPercent / 100) * 20;

  const thermostatPoints = energyUsage.smartThermostats ? 10 : 0;

  const energyScore = Math.min(100, Math.round(euiPoints + hvacPoints + ledPoints + thermostatPoints));

  // -------------------------------------------------------------
  // 2. Water Conservation Score (Weight: 15%)
  // -------------------------------------------------------------
  const annualWaterGallons = Number(waterConsumption.annualWaterGallons) || 0;
  const waterPerOcc = annualWaterGallons / numOccupants;
  
  let waterIntensityPoints = 40;
  const targetWaterPerOcc = 10000; // gallons per occupant per year benchmark
  if (waterPerOcc > targetWaterPerOcc) {
    const excessWater = waterPerOcc - targetWaterPerOcc;
    waterIntensityPoints = Math.max(0, 40 * (1 - excessWater / 20000));
  }

  const lowFlowPoints = waterConsumption.lowFlowFixtures ? 25 : 0;
  const rainwaterPoints = waterConsumption.rainwaterHarvesting ? 20 : 0;
  const greywaterPoints = waterConsumption.greywaterRecycling ? 15 : 0;

  const waterScore = Math.min(100, Math.round(waterIntensityPoints + lowFlowPoints + rainwaterPoints + greywaterPoints));

  // -------------------------------------------------------------
  // 3. Materials & Sourcing Score (Weight: 15%)
  // -------------------------------------------------------------
  const recycledPercent = Math.min(100, Math.max(0, Number(materialUsage.recycledMaterialsPercent) || 0));
  const sustainablePercent = Math.min(100, Math.max(0, Number(materialUsage.sustainablySourcedPercent) || 0));
  const localPercent = Math.min(100, Math.max(0, Number(materialUsage.locallySourcedPercent) || 0));
  
  const recycledPts = (recycledPercent / 100) * 35;
  const sustainablePts = (sustainablePercent / 100) * 35;
  const localPts = (localPercent / 100) * 20;
  const lowVocPts = materialUsage.lowVocMaterials ? 10 : 0;

  const materialScore = Math.min(100, Math.round(recycledPts + sustainablePts + localPts + lowVocPts));

  // -------------------------------------------------------------
  // 4. Waste Management Score (Weight: 15%)
  // -------------------------------------------------------------
  const constrWasteRecycled = Math.min(100, Math.max(0, Number(wasteManagement.constructionWasteRecycledPercent) || 0));
  const constrWastePts = (constrWasteRecycled / 100) * 50;
  const opWastePts = wasteManagement.operationalWasteSegregated ? 30 : 0;
  const compostPts = wasteManagement.compostingFacility ? 20 : 0;

  const wasteScore = Math.min(100, Math.round(constrWastePts + opWastePts + compostPts));

  // -------------------------------------------------------------
  // 5. Renewable Energy Score (Weight: 15%)
  // -------------------------------------------------------------
  const renewablePercent = Math.min(100, Math.max(0, Number(renewableEnergy.renewableEnergyPercent) || 0));
  const solarKW = Number(renewableEnergy.solarCapacityKW) || 0;
  const batteryKWh = Number(renewableEnergy.batteryStorageKWh) || 0;

  const renewablePctPts = (renewablePercent / 100) * 50;
  const solarDensity = solarKW / (totalArea / 1000); // kW per 1,000 sq ft
  const solarPts = Math.min(30, (solarDensity / 0.05) * 30);
  const batteryPts = Math.min(20, (batteryKWh / 20) * 20);

  const renewableScore = Math.min(100, Math.round(renewablePctPts + solarPts + batteryPts));

  // -------------------------------------------------------------
  // 6. Green Building Features Score (Weight: 15%)
  // -------------------------------------------------------------
  const bmsPts = greenFeatures.smartBuildingManagementSystem ? 30 : 0;
  const greenRoofPts = greenFeatures.greenRoof ? 25 : 0;
  const evCount = Math.max(0, Number(greenFeatures.evChargingStations) || 0);
  const evPts = Math.min(20, evCount * 5);
  const naturalVentPts = greenFeatures.naturalVentilation ? 15 : 0;
  const certPts = greenFeatures.bREEAMorLEEDCertified ? 10 : 0;

  const greenFeaturesScore = Math.min(100, Math.round(bmsPts + greenRoofPts + evPts + naturalVentPts + certPts));

  // -------------------------------------------------------------
  // Overall Score & Rating Calculation
  // -------------------------------------------------------------
  const overallScore = Math.min(100, Math.max(0, Math.round(
    energyScore * 0.25 +
    waterScore * 0.15 +
    materialScore * 0.15 +
    wasteScore * 0.15 +
    renewableScore * 0.15 +
    greenFeaturesScore * 0.15
  )));

  let rating = 'Needs Improvement';
  if (overallScore >= 85) rating = 'Excellent';
  else if (overallScore >= 70) rating = 'Good';
  else if (overallScore >= 50) rating = 'Moderate';

  // Calculate Carbon Footprint Estimation
  const carbonFootprint = calculateCarbonFootprint(data);

  return {
    overallScore,
    rating,
    categoryScores: {
      energy: energyScore,
      water: waterScore,
      materials: materialScore,
      waste: wasteScore,
      renewable: renewableScore,
      greenFeatures: greenFeaturesScore
    },
    metrics: {
      eui: Number(eui.toFixed(2)),
      waterPerOcc: Number(waterPerOcc.toFixed(1))
    },
    carbonFootprint
  };
}

module.exports = { calculateScoring };
