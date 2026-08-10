/**
 * GreenBuild Sustainability Badge & Certification Engine
 * Computes official GreenBuild certification badge tiers and special achievements.
 */

function generateBadges(assessmentData = {}) {
  const { scores = {}, greenFeatures = {}, renewableEnergy = {} } = assessmentData || {};
  const overallScore = Number(scores.overallScore) || 50;
  const categoryScores = scores.categoryScores || {};

  let badgeTier = 'Needs Improvement';
  let badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  if (overallScore >= 90) {
    badgeTier = 'Outstanding (Platinum)';
    badgeColor = 'text-cyan-300 bg-cyan-500/15 border-cyan-500/40 shadow-glow-cyan';
  } else if (overallScore >= 75) {
    badgeTier = 'Excellent (Gold)';
    badgeColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40 shadow-glow-emerald';
  } else if (overallScore >= 60) {
    badgeTier = 'Good (Silver)';
    badgeColor = 'text-teal-300 bg-teal-500/15 border-teal-500/30';
  } else if (overallScore >= 40) {
    badgeTier = 'Moderate (Bronze)';
    badgeColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  }

  const achievements = [];

  if ((categoryScores.renewable || 0) >= 80 || (Number(renewableEnergy.solarCapacityKW) || 0) >= 100) {
    achievements.push({
      id: 'ach_renewable',
      title: 'Renewable Energy Champion',
      icon: '☀️',
      desc: 'High on-site solar capacity & clean energy integration.'
    });
  }

  if ((categoryScores.water || 0) >= 80) {
    achievements.push({
      id: 'ach_water',
      title: 'Water Efficiency Pioneer',
      icon: '💧',
      desc: 'Low-flow restroom fixtures & rainwater conservation.'
    });
  }

  if ((categoryScores.waste || 0) >= 80) {
    achievements.push({
      id: 'ach_waste',
      title: 'Zero Waste Advocate',
      icon: '♻️',
      desc: 'High construction landfill diversion & organic composting.'
    });
  }

  if (greenFeatures.smartBuildingManagementSystem) {
    achievements.push({
      id: 'ach_bms',
      title: 'Smart IoT Building',
      icon: '🏢',
      desc: 'Automated IoT BMS telemetry & intelligent climate controls.'
    });
  }

  if ((Number(greenFeatures.evChargingStations) || 0) >= 4) {
    achievements.push({
      id: 'ach_ev',
      title: 'Clean Transportation Pioneer',
      icon: '🔌',
      desc: 'Multiple Level-2 EV charging bays installed.'
    });
  }

  return {
    badgeTier,
    badgeColor,
    overallScore,
    achievements
  };
}

module.exports = { generateBadges };
