/**
 * GreenBuild Carbon Footprint Engine
 * Calculates estimated annual CO2 emissions (MT CO2e/year),
 * CO2 per sq ft, CO2 per occupant, and projected reduction targets.
 */

function calculateCarbonFootprint(data) {
  const {
    buildingInfo = {},
    energyUsage = {},
    waterConsumption = {},
    wasteManagement = {},
    renewableEnergy = {}
  } = data || {};

  const totalAreaSqFt = Math.max(1, Number(buildingInfo.totalAreaSqFt) || 1000);
  const numOccupants = Math.max(1, Number(buildingInfo.numOccupants) || 10);

  const elecKWh = Number(energyUsage.annualElectricityKWh) || 0;
  const gasMJ = Number(energyUsage.annualGasMJ) || 0;
  const annualWaterGallons = Number(waterConsumption.annualWaterGallons) || 0;
  const wasteRecycledPct = Number(wasteManagement.constructionWasteRecycledPercent) || 0;
  const renewablePct = Number(renewableEnergy.renewableEnergyPercent) || 0;
  const solarKW = Number(renewableEnergy.solarCapacityKW) || 0;

  // Emission Factors (Metric Tons CO2e per unit)
  // Grid electricity factor: ~0.0003855 MT CO2e / kWh (US avg grid factor)
  // Natural gas factor: ~0.000053 MT CO2e / MJ
  // Water supply & treatment factor: ~0.0015 MT CO2e / 1,000 gallons
  // Waste landfill factor: ~0.4 MT CO2e per 1,000 sq ft un-diverted building footprint

  const grossElectricityEmissions = elecKWh * 0.0003855;
  const gasEmissions = gasMJ * 0.000053;
  const grossEnergyEmissions = grossElectricityEmissions + gasEmissions;

  // Clean energy offsets
  const renewablePctOffset = grossElectricityEmissions * (Math.min(100, Math.max(0, renewablePct)) / 100);
  const solarKWOffset = solarKW * 0.45; // ~0.45 MT CO2e offset per kW solar per year
  const totalRenewableOffset = Math.min(grossEnergyEmissions, renewablePctOffset + solarKWOffset);

  const netEnergyEmissions = Math.max(0, grossEnergyEmissions - totalRenewableOffset);
  const waterEmissions = (annualWaterGallons / 1000) * 0.0015;
  const wasteEmissions = Math.max(0, (1 - (wasteRecycledPct / 100))) * (totalAreaSqFt / 1000) * 0.4;

  const totalCurrentCO2e = netEnergyEmissions + waterEmissions + wasteEmissions;

  // Normalized intensity metrics
  const co2PerSqFtKg = (totalCurrentCO2e * 1000) / totalAreaSqFt; // kg CO2e / sq ft / yr
  const co2PerOccupantMT = totalCurrentCO2e / numOccupants; // MT CO2e / occupant / yr

  // Projected Carbon Footprint (Estimated 35% to 45% reduction with recommended upgrades)
  const reductionFactor = 0.38; // ~38% estimated footprint reduction
  const potentialCO2Reduction = totalCurrentCO2e * reductionFactor;
  const projectedCO2e = Math.max(0, totalCurrentCO2e - potentialCO2Reduction);

  return {
    totalCurrentCO2e: Number(totalCurrentCO2e.toFixed(1)),
    projectedCO2e: Number(projectedCO2e.toFixed(1)),
    potentialCO2Reduction: Number(potentialCO2Reduction.toFixed(1)),
    co2PerSqFtKg: Number(co2PerSqFtKg.toFixed(2)),
    co2PerOccupantMT: Number(co2PerOccupantMT.toFixed(2)),
    breakdown: {
      energyEmissions: Number(netEnergyEmissions.toFixed(1)),
      waterEmissions: Number(waterEmissions.toFixed(1)),
      wasteEmissions: Number(wasteEmissions.toFixed(1)),
      renewableOffset: Number(totalRenewableOffset.toFixed(1))
    },
    isEstimate: true
  };
}

module.exports = { calculateCarbonFootprint };
