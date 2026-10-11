import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  BarChart3,
  Award,
  Users,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';

export const SalesAnalytics: React.FC = () => {
  const { targets, brands, patches, users, doctors } = usePharma();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('October 2026');

  // Aggregates
  const totalTargetRevenue = targets.reduce((a, b) => a + b.targetRevenue, 0);
  const totalAchievedRevenue = targets.reduce((a, b) => a + b.achievedRevenue, 0);
  const revenueAchievementRate = Math.round(
    (totalAchievedRevenue / (totalTargetRevenue || 1)) * 100
  );

  const totalCallTarget = targets.reduce((a, b) => a + b.callTarget, 0);
  const totalCallsDone = targets.reduce((a, b) => a + b.callsDone, 0);
  const callAchievementRate = Math.round((totalCallsDone / (totalCallTarget || 1)) * 100);

  const totalKolTarget = targets.reduce((a, b) => a + b.kolCallTarget, 0);
  const totalKolCallsDone = targets.reduce((a, b) => a + b.kolCallsDone, 0);
  const kolAchievementRate = Math.round((totalKolCallsDone / (totalKolTarget || 1)) * 100);

  // Category-wise Breakdown
  const categoryStats = [
    {
      name: 'Cardiovascular & Hypertension',
      target: 2800000,
      achieved: 2540000,
      growth: '+14.2%',
      brandCount: brands.filter((b) => b.category === 'Cardiovascular & Hypertension').length,
    },
    {
      name: 'Diabetology & Metabolic',
      target: 2400000,
      achieved: 2210000,
      growth: '+18.5%',
      brandCount: brands.filter((b) => b.category === 'Diabetology & Metabolic').length,
    },
    {
      name: 'Anti-Infectives & Critical Care',
      target: 1200000,
      achieved: 1040000,
      growth: '+9.1%',
      brandCount: brands.filter((b) => b.category === 'Anti-Infectives & Critical Care').length,
    },
    {
      name: 'Gastroenterology & Hepatology',
      target: 1100000,
      achieved: 1080000,
      growth: '+22.0%',
      brandCount: brands.filter((b) => b.category === 'Gastroenterology & Hepatology').length,
    },
    {
      name: 'Respiratory & Pulmonology',
      target: 900000,
      achieved: 810000,
      growth: '+11.4%',
      brandCount: brands.filter((b) => b.category === 'Respiratory & Pulmonology').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sales Target & Achievements Analysis
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Territory revenue vs target, call frequency attainment, KOL coverage index, and category sales velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-xs">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-slate-900">{selectedPeriod}</span>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue Target vs Achieved */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Primary Revenue Target</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {revenueAchievementRate}% Achieved
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              ₹{totalAchievedRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              of ₹{totalTargetRevenue.toLocaleString()}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-teal-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, revenueAchievementRate)}%` }}
            />
          </div>

          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Variance: ₹{(totalTargetRevenue - totalAchievedRevenue).toLocaleString()}</span>
            <span className="text-teal-700 font-medium">On pace for month-end target</span>
          </div>
        </div>

        {/* Total Doctor Calls Attainment */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Field Call Frequency (Total)</span>
            <span className="font-semibold text-teal-600">
              {callAchievementRate}% of Target
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalCallsDone}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              of {totalCallTarget} Target Calls
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, callAchievementRate)}%` }}
            />
          </div>

          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Daily Call Average: 11.2 calls/rep</span>
            <span className="text-emerald-700 font-medium">Standard ≥ 10/day</span>
          </div>
        </div>

        {/* KOL Visit Attainment */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>KOL Doctor Coverage Frequency</span>
            <span className="font-semibold text-amber-600 flex items-center gap-0.5">
              <Award className="w-3.5 h-3.5" /> {kolAchievementRate}% Attainment
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalKolCallsDone}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              of {totalKolTarget} Target KOL Visits
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, kolAchievementRate)}%` }}
            />
          </div>

          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Tier A (KOL) Priority Rate</span>
            <span className="text-amber-700 font-medium">91.4% Coverage</span>
          </div>
        </div>
      </div>

      {/* Field Force Representatives Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Medical Representative Performance Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-500">Ranked by Target Achievement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-3">Assigned Patch / Beat</th>
                <th className="py-3 px-3 text-right">Target Revenue</th>
                <th className="py-3 px-3 text-right">Achieved Revenue</th>
                <th className="py-3 px-3 text-right">% Achievement</th>
                <th className="py-3 px-3 text-right">Calls (Actual / Target)</th>
                <th className="py-3 px-3 text-right">KOL Visits</th>
                <th className="py-3 px-4 text-right">Incentive Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {targets.map((tgt, i) => {
                const percent = Math.round((tgt.achievedRevenue / tgt.targetRevenue) * 100);
                const callPercent = Math.round((tgt.callsDone / tgt.callTarget) * 100);

                return (
                  <tr key={tgt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                          #{i + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{tgt.repName}</div>
                          <div className="text-[11px] text-slate-400">Field Executive</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-800">{tgt.patchName}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      ₹{tgt.targetRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                      ₹{tgt.achievedRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                        percent >= 90
                          ? 'bg-emerald-50 text-emerald-700'
                          : percent >= 80
                          ? 'bg-teal-50 text-teal-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {percent}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      {tgt.callsDone} / {tgt.callTarget} ({callPercent}%)
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-amber-700 font-semibold">
                      {tgt.kolCallsDone} / {tgt.kolCallTarget}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {percent >= 90 ? (
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Tier 1 Incentive Eligible
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">
                          Active in Field
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category-Wise Performance Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Category-Wise Revenue Achievement Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-500">5 Active Therapeutic Divisions</span>
        </div>

        <div className="space-y-4">
          {categoryStats.map((cat, idx) => {
            const achRate = Math.round((cat.achieved / cat.target) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{cat.name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500">{cat.brandCount} Brands</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="text-slate-600">
                      ₹{cat.achieved.toLocaleString()} / ₹{cat.target.toLocaleString()}
                    </span>
                    <span className="font-bold text-slate-900 text-xs w-12 text-right">
                      {achRate}%
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {cat.growth} YoY
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${Math.min(100, achRate)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
