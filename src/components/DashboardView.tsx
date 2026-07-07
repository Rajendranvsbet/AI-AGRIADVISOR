import React from "react";
import { motion } from "motion/react";
import { 
  CloudSun, 
  Thermometer, 
  Droplet, 
  Wind, 
  Compass, 
  Sprout, 
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  DollarSign, 
  Clipboard, 
  TrendingUp, 
  BrainCircuit, 
  BellRing
} from "lucide-react";
import { User, Expense, CropRecRecord, DiseaseRecord } from "../types";

interface DashboardViewProps {
  user: User;
  expenses: Expense[];
  cropRecs: CropRecRecord[];
  diseases: DiseaseRecord[];
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ user, expenses, cropRecs, diseases, onNavigate }: DashboardViewProps) {
  // Aggregate statistics
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Custom Category Cost Aggregation
  const categoryCosts = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = ["Seeds", "Labor", "Machinery", "Fuel", "Fertilizer", "Transport", "Other"];
  const categoryData = categories.map(cat => ({
    name: cat,
    amount: categoryCosts[cat] || 0
  }));
  const maxExpense = Math.max(...categoryData.map(d => d.amount), 1);

  // Recent logs
  const allLogs = [
    ...cropRecs.map(cr => ({
      id: cr.id,
      title: "Crop Recommendation",
      detail: `Recommended: ${cr.recommendation.bestCrop} (Conf: ${cr.recommendation.confidenceScore}%)`,
      date: new Date(cr.createdAt).toLocaleDateString(),
      type: "crop"
    })),
    ...diseases.map(d => ({
      id: d.id,
      title: "Disease Diagnosis",
      detail: `${d.diseaseName} detected on ${d.crop} (Conf: ${d.confidence}%)`,
      date: new Date(d.createdAt).toLocaleDateString(),
      type: "disease"
    })),
    ...expenses.map(e => ({
      id: e.id,
      title: `Logged ${e.category} cost`,
      detail: `${e.description || e.category} - ₹${e.amount}`,
      date: new Date(e.date).toLocaleDateString(),
      type: "expense"
    }))
  ].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Howdy, {user?.name || "Premium Farmer"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your dynamic farming analytics dashboard. Soil moisture levels are looking healthy today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs font-semibold">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          Active Role: {user?.role || "Farmer"}
        </div>
      </div>

      {/* Dynamic Microclimate Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Air Temperature</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">29.4°C</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Optimal Range</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Soil Moisture</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">68%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Perfect moisture</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wind Speed</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">14.2 km/h</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Direction: SW</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rain Probability</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">15%</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Next 48 hrs dry</div>
          </div>
        </div>
      </div>

      {/* Warning System Banner */}
      <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900 uppercase">Automated Advisory Alert</h4>
          <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
            Summer temperature anomalies: Heat index is expected to rise to 38°C on Wednesday. We recommend scheduling deep root irrigation during late evening hours to prevent root transpiration.
          </p>
        </div>
      </div>

      {/* Main Analysis and Metrics Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SVG Budget distribution graph (Enterprise Quality) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Seasonal Cost Distribution</h3>
              <p className="text-xs text-slate-400">Analysis across operational cost categories</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase">Total Logged</div>
              <div className="text-base font-black text-emerald-600">₹{totalExpense.toLocaleString()}</div>
            </div>
          </div>

          {/* Clean custom SVG chart */}
          <div className="pt-4">
            <div className="space-y-4">
              {categoryData.map((d, index) => {
                const percentage = (d.amount / maxExpense) * 100;
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{d.name}</span>
                      <span className="text-slate-800">₹{d.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Utilities Panel & Recent Logs */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Tasks */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Platform Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate("crop-rec")}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs transition-all border border-slate-100 flex flex-col items-center justify-center gap-2 text-center"
              >
                <BrainCircuit className="w-5 h-5 text-emerald-600" />
                Crop Advisor
              </button>
              <button 
                onClick={() => onNavigate("disease")}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-bold text-xs transition-all border border-slate-100 flex flex-col items-center justify-center gap-2 text-center"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                AI Diagnosis
              </button>
              <button 
                onClick={() => onNavigate("market")}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs transition-all border border-slate-100 flex flex-col items-center justify-center gap-2 text-center"
              >
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Yard Rates
              </button>
              <button 
                onClick={() => onNavigate("expenses")}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition-all border border-slate-100 flex flex-col items-center justify-center gap-2 text-center"
              >
                <DollarSign className="w-5 h-5 text-blue-600" />
                Cost Tracker
              </button>
            </div>
          </div>

          {/* Recent Operations Log */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Recent Farm Logs</h3>
            
            <div className="space-y-4">
              {allLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  No activities logged yet.
                </div>
              ) : (
                allLogs.map((log, idx) => (
                  <div key={log.id} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      log.type === "crop" ? "bg-emerald-50 text-emerald-600" :
                      log.type === "disease" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {log.type === "crop" ? <Sprout className="w-4 h-4" /> :
                       log.type === "disease" ? <AlertTriangle className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{log.title}</h4>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{log.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{log.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
