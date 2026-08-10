import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function CategoryRadarChart({ categoryScores = {} }) {
  const data = [
    { category: 'Energy', score: categoryScores.energy || 0, fullMark: 100 },
    { category: 'Water', score: categoryScores.water || 0, fullMark: 100 },
    { category: 'Materials', score: categoryScores.materials || 0, fullMark: 100 },
    { category: 'Waste', score: categoryScores.waste || 0, fullMark: 100 },
    { category: 'Renewable', score: categoryScores.renewable || 0, fullMark: 100 },
    { category: 'Green Features', score: categoryScores.greenFeatures || 0, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Category Score"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
