export const RATING_COLORS = {
  'Excellent': {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-400',
    ring: 'ring-emerald-500/50'
  },
  'Good': {
    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    text: 'text-teal-400',
    bg: 'bg-teal-500',
    gradient: 'from-teal-500 to-cyan-400',
    ring: 'ring-teal-500/50'
  },
  'Moderate': {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    text: 'text-amber-400',
    bg: 'bg-amber-500',
    gradient: 'from-amber-500 to-yellow-400',
    ring: 'ring-amber-500/50'
  },
  'Needs Improvement': {
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    text: 'text-rose-400',
    bg: 'bg-rose-500',
    gradient: 'from-rose-500 to-red-400',
    ring: 'ring-rose-500/50'
  }
};

export const CATEGORIES_CONFIG = [
  { key: 'energy', label: 'Energy Usage', weight: '25%', icon: 'Zap', color: '#10B981' },
  { key: 'water', label: 'Water Usage', weight: '15%', icon: 'Droplets', color: '#06B6D4' },
  { key: 'materials', label: 'Materials', weight: '15%', icon: 'Boxes', color: '#8B5CF6' },
  { key: 'waste', label: 'Waste Management', weight: '15%', icon: 'Recycle', color: '#F59E0B' },
  { key: 'renewable', label: 'Renewable Energy', weight: '15%', icon: 'Sun', color: '#EC4899' },
  { key: 'greenFeatures', label: 'Green Features', weight: '15%', icon: 'Leaf', color: '#3B82F6' },
];

export const INITIAL_FORM_DATA = {
  buildingInfo: {
    name: '',
    buildingType: 'Commercial',
    location: '',
    totalAreaSqFt: 50000,
    numOccupants: 250,
    constructionYear: 2020
  },
  energyUsage: {
    annualElectricityKWh: 650000,
    annualGasMJ: 120000,
    hvacEfficiencyRating: 3,
    ledLightingPercent: 60,
    smartThermostats: false
  },
  waterConsumption: {
    annualWaterGallons: 1500000,
    rainwaterHarvesting: false,
    greywaterRecycling: false,
    lowFlowFixtures: true
  },
  materialUsage: {
    recycledMaterialsPercent: 30,
    sustainablySourcedPercent: 40,
    locallySourcedPercent: 50,
    lowVocMaterials: true
  },
  wasteManagement: {
    constructionWasteRecycledPercent: 55,
    operationalWasteSegregated: true,
    compostingFacility: false
  },
  renewableEnergy: {
    solarCapacityKW: 50,
    renewableEnergyPercent: 20,
    batteryStorageKWh: 0
  },
  greenFeatures: {
    greenRoof: false,
    naturalVentilation: true,
    evChargingStations: 2,
    smartBuildingManagementSystem: false,
    bREEAMorLEEDCertified: false
  }
};

export const DEMO_SAMPLE_BUILDINGS = [
  {
    buildingInfo: {
      name: 'EcoTower Innovation Hub',
      buildingType: 'Commercial',
      location: 'Downtown Silicon District',
      totalAreaSqFt: 120000,
      numOccupants: 650,
      constructionYear: 2022
    },
    energyUsage: {
      annualElectricityKWh: 950000,
      annualGasMJ: 180000,
      hvacEfficiencyRating: 5,
      ledLightingPercent: 95,
      smartThermostats: true
    },
    waterConsumption: {
      annualWaterGallons: 2800000,
      rainwaterHarvesting: true,
      greywaterRecycling: true,
      lowFlowFixtures: true
    },
    materialUsage: {
      recycledMaterialsPercent: 65,
      sustainablySourcedPercent: 75,
      locallySourcedPercent: 80,
      lowVocMaterials: true
    },
    wasteManagement: {
      constructionWasteRecycledPercent: 85,
      operationalWasteSegregated: true,
      compostingFacility: true
    },
    renewableEnergy: {
      solarCapacityKW: 250,
      renewableEnergyPercent: 60,
      batteryStorageKWh: 100
    },
    greenFeatures: {
      greenRoof: true,
      naturalVentilation: true,
      evChargingStations: 12,
      smartBuildingManagementSystem: true,
      bREEAMorLEEDCertified: true
    }
  },
  {
    buildingInfo: {
      name: 'Horizon Heights Residences',
      buildingType: 'Residential',
      location: 'Green Valley Suburb',
      totalAreaSqFt: 45000,
      numOccupants: 180,
      constructionYear: 2018
    },
    energyUsage: {
      annualElectricityKWh: 420000,
      annualGasMJ: 95000,
      hvacEfficiencyRating: 3,
      ledLightingPercent: 50,
      smartThermostats: false
    },
    waterConsumption: {
      annualWaterGallons: 1800000,
      rainwaterHarvesting: false,
      greywaterRecycling: false,
      lowFlowFixtures: true
    },
    materialUsage: {
      recycledMaterialsPercent: 25,
      sustainablySourcedPercent: 30,
      locallySourcedPercent: 40,
      lowVocMaterials: false
    },
    wasteManagement: {
      constructionWasteRecycledPercent: 40,
      operationalWasteSegregated: true,
      compostingFacility: false
    },
    renewableEnergy: {
      solarCapacityKW: 30,
      renewableEnergyPercent: 15,
      batteryStorageKWh: 0
    },
    greenFeatures: {
      greenRoof: false,
      naturalVentilation: true,
      evChargingStations: 2,
      smartBuildingManagementSystem: false,
      bREEAMorLEEDCertified: false
    }
  }
];
