const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    buildingInfo: {
      name: { type: String, required: true, trim: true },
      buildingType: {
        type: String,
        required: true,
        enum: ['Commercial', 'Residential', 'Industrial', 'Mixed-Use'],
        default: 'Commercial'
      },
      location: { type: String, default: 'Unspecified' },
      totalAreaSqFt: { type: Number, required: true, min: 1 },
      numOccupants: { type: Number, required: true, min: 1 },
      constructionYear: { type: Number, default: new Date().getFullYear() }
    },

    energyUsage: {
      annualElectricityKWh: { type: Number, default: 0, min: 0 },
      annualGasMJ: { type: Number, default: 0, min: 0 },
      hvacEfficiencyRating: { type: Number, default: 3, min: 1, max: 5 },
      ledLightingPercent: { type: Number, default: 0, min: 0, max: 100 },
      smartThermostats: { type: Boolean, default: false }
    },

    waterConsumption: {
      annualWaterGallons: { type: Number, default: 0, min: 0 },
      rainwaterHarvesting: { type: Boolean, default: false },
      greywaterRecycling: { type: Boolean, default: false },
      lowFlowFixtures: { type: Boolean, default: false }
    },

    materialUsage: {
      recycledMaterialsPercent: { type: Number, default: 0, min: 0, max: 100 },
      sustainablySourcedPercent: { type: Number, default: 0, min: 0, max: 100 },
      locallySourcedPercent: { type: Number, default: 0, min: 0, max: 100 },
      lowVocMaterials: { type: Boolean, default: false }
    },

    wasteManagement: {
      constructionWasteRecycledPercent: { type: Number, default: 0, min: 0, max: 100 },
      operationalWasteSegregated: { type: Boolean, default: false },
      compostingFacility: { type: Boolean, default: false }
    },

    renewableEnergy: {
      solarCapacityKW: { type: Number, default: 0, min: 0 },
      renewableEnergyPercent: { type: Number, default: 0, min: 0, max: 100 },
      batteryStorageKWh: { type: Number, default: 0, min: 0 }
    },

    greenFeatures: {
      greenRoof: { type: Boolean, default: false },
      naturalVentilation: { type: Boolean, default: false },
      evChargingStations: { type: Number, default: 0, min: 0 },
      smartBuildingManagementSystem: { type: Boolean, default: false },
      bREEAMorLEEDCertified: { type: Boolean, default: false }
    },

    scores: {
      overallScore: { type: Number, required: true, min: 0, max: 100 },
      rating: {
        type: String,
        required: true,
        enum: ['Excellent', 'Good', 'Moderate', 'Needs Improvement']
      },
      categoryScores: {
        energy: { type: Number, required: true },
        water: { type: Number, required: true },
        materials: { type: Number, required: true },
        waste: { type: Number, required: true },
        renewable: { type: Number, required: true },
        greenFeatures: { type: Number, required: true }
      },
      metrics: {
        eui: Number,
        waterPerOcc: Number
      }
    },

    recommendations: [
      {
        category: String,
        title: String,
        description: String,
        potentialScoreIncrease: Number,
        priority: { type: String, enum: ['High', 'Medium', 'Low'] }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index for fast search and filtering
assessmentSchema.index({ 'buildingInfo.name': 'text', 'buildingInfo.buildingType': 1, createdAt: -1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
