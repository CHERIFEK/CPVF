import React from 'react';
import { AnalysisResult } from '../types';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ActionPlanCardProps {
  isLoading: boolean;
  analysis: AnalysisResult | null;
  onGenerate: () => void;
  hasData: boolean;
}

const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ isLoading, analysis, onGenerate, hasData }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 h-full flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">AI Insights</h3>
        </div>

        {!analysis && !isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <p className="text-slate-500 mb-6 text-sm">
              Ready to analyze feedback? Generate an actionable plan for management based on current data.
            </p>
            <button
              onClick={onGenerate}
              disabled={!hasData}
              className={`
                px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all
                ${hasData 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              Generate Action Plan
            </button>
            {!hasData && (
              <p className="text-xs text-slate-400 mt-3">Need at least one response to analyze.</p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-slate-600 animate-pulse">Reading the room...</p>
          </div>
        )}

        {analysis && !isLoading && (
          <div className="flex-grow space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
               <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Executive Summary</h4>
               <p className="text-slate-700 text-sm leading-relaxed font-medium">
                 {analysis.summary}
               </p>
             </div>

             <div className="space-y-3">
               <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 ml-1">3-Point Action Plan</h4>
               {analysis.actionPoints.map((point, idx) => (
                 <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                   <p className="text-slate-600 text-sm">{point}</p>
                 </div>
               ))}
             </div>
             
             <button 
               onClick={onGenerate}
               className="w-full py-2 mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-600 transition-colors"
             >
               Refresh Analysis
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPlanCard;
