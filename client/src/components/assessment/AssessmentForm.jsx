import React, { useState } from 'react';
import {
  INITIAL_FORM_DATA,
  DEMO_SAMPLE_BUILDINGS
} from '../../utils/constants';
import {
  Building,
  Zap,
  Droplets,
  Boxes,
  Recycle,
  Sun,
  Leaf,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function AssessmentForm({ onSubmitSuccess, onSimulateOnly }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    { id: 1, title: 'Building Info', icon: Building, desc: 'General characteristics' },
    { id: 2, title: 'Energy Usage', icon: Zap, desc: 'Electricity & heating' },
    { id: 3, title: 'Water Usage', icon: Droplets, desc: 'Fixtures & recycling' },
    { id: 4, title: 'Materials', icon: Boxes, desc: 'Sustainable sourcing' },
    { id: 5, title: 'Waste Management', icon: Recycle, desc: 'Diversion & composting' },
    { id: 6, title: 'Renewables & Features', icon: Sun, desc: 'Solar & green tech' },
  ];

  // Helper for deep property update
  const updateNestedField = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSamplePreset = (sampleIndex) => {
    setFormData(DEMO_SAMPLE_BUILDINGS[sampleIndex]);
    setErrorMsg('');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.buildingInfo.name.trim()) {
        setErrorMsg('Please enter a building name before proceeding.');
        return;
      }
    }
    setErrorMsg('');
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.buildingInfo.name.trim()) {
      setErrorMsg('Building name is required.');
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      if (onSubmitSuccess) {
        await onSubmitSuccess(formData);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
      
      {/* Header & Preset Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-eco-400" />
            Sustainability Assessment Form
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Fill in the building characteristics to generate an instant 0–100 sustainability report.
          </p>
        </div>

        {/* Sample Preset Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Load Sample:</span>
          <button
            type="button"
            onClick={() => handleSamplePreset(0)}
            className="px-3 py-1.5 rounded-lg bg-eco-500/10 hover:bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-semibold transition-colors"
          >
            Commercial Eco-Tower
          </button>
          <button
            type="button"
            onClick={() => handleSamplePreset(1)}
            className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-colors"
          >
            Residential Heights
          </button>
        </div>
      </div>

      {/* Step Stepper Header */}
      <div className="py-6 border-b border-slate-800 overflow-x-auto">
        <div className="flex items-center min-w-max space-x-2 sm:space-x-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-eco-500/20 text-eco-300 border border-eco-500/40'
                      : isDone
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-eco-500 text-slate-950'
                        : isCurrent
                        ? 'bg-eco-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <span>{step.title}</span>
                </button>
                {step.id < steps.length && (
                  <div className="w-4 h-0.5 bg-slate-800 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="py-6 space-y-6">

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Building Info */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-eco-400" />
              Building Characteristics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Building Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GreenTech HQ Campus"
                  value={formData.buildingInfo.name}
                  onChange={(e) => updateNestedField('buildingInfo', 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Building Type
                </label>
                <select
                  value={formData.buildingInfo.buildingType}
                  onChange={(e) => updateNestedField('buildingInfo', 'buildingType', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                >
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX"
                  value={formData.buildingInfo.location}
                  onChange={(e) => updateNestedField('buildingInfo', 'location', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Construction / Renovation Year
                </label>
                <input
                  type="number"
                  value={formData.buildingInfo.constructionYear}
                  onChange={(e) => updateNestedField('buildingInfo', 'constructionYear', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Total Gross Floor Area (sq ft)
                </label>
                <input
                  type="number"
                  min="100"
                  value={formData.buildingInfo.totalAreaSqFt}
                  onChange={(e) => updateNestedField('buildingInfo', 'totalAreaSqFt', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Number of Daily Occupants
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.buildingInfo.numOccupants}
                  onChange={(e) => updateNestedField('buildingInfo', 'numOccupants', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Energy Usage */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-eco-400" />
              Energy Consumption & Efficiency
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Annual Electricity Usage (kWh/year)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.energyUsage.annualElectricityKWh}
                  onChange={(e) => updateNestedField('energyUsage', 'annualElectricityKWh', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Annual Natural Gas / Heating (MJ/year)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.energyUsage.annualGasMJ}
                  onChange={(e) => updateNestedField('energyUsage', 'annualGasMJ', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  HVAC Efficiency Rating (1 to 5 Stars)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.energyUsage.hvacEfficiencyRating}
                  onChange={(e) => updateNestedField('energyUsage', 'hvacEfficiencyRating', Number(e.target.value))}
                  className="w-full accent-eco-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-semibold">
                  <span>1 (Standard / Low)</span>
                  <span className="text-eco-400 font-bold">{formData.energyUsage.hvacEfficiencyRating} Stars</span>
                  <span>5 (Ultra High Efficiency VRF)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  LED Lighting Adoption (% of total fixtures)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.energyUsage.ledLightingPercent}
                  onChange={(e) => updateNestedField('energyUsage', 'ledLightingPercent', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.energyUsage.smartThermostats}
                  onChange={(e) => updateNestedField('energyUsage', 'smartThermostats', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500 focus:ring-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Smart Occupancy-Based Thermostats Installed
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Water Usage */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              Water Conservation & Management
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Annual Water Consumption (Gallons/year)
              </label>
              <input
                type="number"
                min="0"
                value={formData.waterConsumption.annualWaterGallons}
                onChange={(e) => updateNestedField('waterConsumption', 'annualWaterGallons', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.waterConsumption.lowFlowFixtures}
                  onChange={(e) => updateNestedField('waterConsumption', 'lowFlowFixtures', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Low-Flow Restroom Fixtures & Aerators
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.waterConsumption.rainwaterHarvesting}
                  onChange={(e) => updateNestedField('waterConsumption', 'rainwaterHarvesting', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Rainwater Harvesting System Installed
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.waterConsumption.greywaterRecycling}
                  onChange={(e) => updateNestedField('waterConsumption', 'greywaterRecycling', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  On-site Greywater Recycling System
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Materials */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-400" />
              Sustainable Materials & Sourcing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Recycled Content (% of total)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.materialUsage.recycledMaterialsPercent}
                  onChange={(e) => updateNestedField('materialUsage', 'recycledMaterialsPercent', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Sustainably Sourced (% FSC/Certified)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.materialUsage.sustainablySourcedPercent}
                  onChange={(e) => updateNestedField('materialUsage', 'sustainablySourcedPercent', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Locally Sourced (% within 500 miles)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.materialUsage.locallySourcedPercent}
                  onChange={(e) => updateNestedField('materialUsage', 'locallySourcedPercent', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.materialUsage.lowVocMaterials}
                  onChange={(e) => updateNestedField('materialUsage', 'lowVocMaterials', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Low-VOC Paints, Coatings, Sealants & Flooring
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Waste */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Recycle className="w-5 h-5 text-amber-400" />
              Waste Management & Diversion
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Construction Waste Recycled / Diverted (% from landfill)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.wasteManagement.constructionWasteRecycledPercent}
                onChange={(e) => updateNestedField('wasteManagement', 'constructionWasteRecycledPercent', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wasteManagement.operationalWasteSegregated}
                  onChange={(e) => updateNestedField('wasteManagement', 'operationalWasteSegregated', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Multi-Stream Operational Recycling Stations Available
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wasteManagement.compostingFacility}
                  onChange={(e) => updateNestedField('wasteManagement', 'compostingFacility', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  On-Site Organic Waste Composting Facility
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Renewables & Green Features */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-pink-400" />
              Renewable Energy & Green Building Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Solar PV Capacity (kW)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.renewableEnergy.solarCapacityKW}
                  onChange={(e) => updateNestedField('renewableEnergy', 'solarCapacityKW', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Renewable Energy Share (% total power)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.renewableEnergy.renewableEnergyPercent}
                  onChange={(e) => updateNestedField('renewableEnergy', 'renewableEnergyPercent', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Battery Storage Capacity (kWh)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.renewableEnergy.batteryStorageKWh}
                  onChange={(e) => updateNestedField('renewableEnergy', 'batteryStorageKWh', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.greenFeatures.greenRoof}
                  onChange={(e) => updateNestedField('greenFeatures', 'greenRoof', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Vegetated Green Roof System
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.greenFeatures.naturalVentilation}
                  onChange={(e) => updateNestedField('greenFeatures', 'naturalVentilation', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Passively Cooled / Natural Ventilation
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.greenFeatures.smartBuildingManagementSystem}
                  onChange={(e) => updateNestedField('greenFeatures', 'smartBuildingManagementSystem', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Automated BMS / IoT Energy Controls
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.greenFeatures.bREEAMorLEEDCertified}
                  onChange={(e) => updateNestedField('greenFeatures', 'bREEAMorLEEDCertified', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-eco-500"
                />
                <span className="text-sm font-medium text-slate-200">
                  Prior LEED or BREEAM Certification
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                EV Charging Stations Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.greenFeatures.evChargingStations}
                onChange={(e) => updateNestedField('greenFeatures', 'evChargingStations', Number(e.target.value))}
                className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-eco-500 text-sm"
              />
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-600'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl bg-gradient-to-r from-eco-500 to-teal-400 hover:from-eco-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-glow-emerald transition-all transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculating Score...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Generate Assessment Report</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
