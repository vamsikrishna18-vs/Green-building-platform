import React from 'react';
import { Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BadgeCard({ score = 75, rating = 'Excellent', assessmentData }) {
  let badgeTier = 'Needs Improvement';
  let badgeStyle = 'border-rose-500/30 bg-rose-500/10 text-rose-400';

  if (score >= 90) {
    badgeTier = 'GREENBUILD OUTSTANDING (PLATINUM)';
    badgeStyle = 'border-cyan-400/50 bg-gradient-to-r from-cyan-950/60 to-slate-900 text-cyan-300 shadow-glow-cyan';
  } else if (score >= 75) {
    badgeTier = 'GREENBUILD EXCELLENT (GOLD)';
    badgeStyle = 'border-emerald-400/50 bg-gradient-to-r from-emerald-950/60 to-slate-900 text-emerald-400 shadow-glow-emerald';
  } else if (score >= 60) {
    badgeTier = 'GREENBUILD GOOD (SILVER)';
    badgeStyle = 'border-teal-400/40 bg-gradient-to-r from-teal-950/60 to-slate-900 text-teal-300';
  } else if (score >= 40) {
    badgeTier = 'GREENBUILD MODERATE (BRONZE)';
    badgeStyle = 'border-amber-400/40 bg-gradient-to-r from-amber-950/60 to-slate-900 text-amber-400';
  }

  const categoryScores = assessmentData?.scores?.categoryScores || {};
  const greenFeatures = assessmentData?.greenFeatures || {};
  const renewableEnergy = assessmentData?.renewableEnergy || {};

  const achievements = [];
  if ((categoryScores.renewable || 0) >= 75 || (Number(renewableEnergy.solarCapacityKW) || 0) >= 100) {
    achievements.push({ title: 'Renewable Energy Champion', icon: '☀️' });
  }
  if ((categoryScores.water || 0) >= 75) {
    achievements.push({ title: 'Water Efficiency Pioneer', icon: '💧' });
  }
  if ((categoryScores.waste || 0) >= 75) {
    achievements.push({ title: 'Zero Waste Advocate', icon: '♻️' });
  }
  if (greenFeatures.smartBuildingManagementSystem) {
    achievements.push({ title: 'Smart IoT Building', icon: '🏢' });
  }
  if ((Number(greenFeatures.evChargingStations) || 0) >= 4) {
    achievements.push({ title: 'Clean Transportation Pioneer', icon: '🔌' });
  }

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border ${badgeStyle} relative overflow-hidden space-y-6`}>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
            <Award className="w-8 h-8 text-eco-400" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block">
              Official Platform Certification Badge
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              {badgeTier}
            </h3>
            <span className="text-xs text-slate-300 font-medium">Verified Score: <strong>{score}/100</strong></span>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
          <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Certified
          </span>
        </div>
      </div>

      {/* Special Achievement Badges Grid */}
      {achievements.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <span className="text-xs uppercase font-bold text-slate-400 block">
            Special Environmental Achievements
          </span>

          <div className="flex flex-wrap gap-2.5">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-semibold text-white flex items-center space-x-2"
              >
                <span className="text-base">{ach.icon}</span>
                <span>{ach.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
