import React, { useState, useEffect } from 'react';
import { Feedback, AnalysisResult } from './types';
import { analyzeFeedback } from './services/geminiService';
import MoodSelector from './components/MoodSelector';
import MoodChart from './components/MoodChart';
import ActionPlanCard from './components/ActionPlanCard';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  ArrowRight, 
  RefreshCcw,
  MessageSquareQuote
} from 'lucide-react';

const STORAGE_KEY = 'culture-survey-data';

const App: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard'>('survey');
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved feedback", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim() || !currentMood) return;

    const newFeedback: Feedback = {
      id: crypto.randomUUID(),
      text: currentText,
      mood: currentMood,
      timestamp: Date.now(),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    setCurrentText('');
    setCurrentMood(null);
    setAnalysis(null); // Invalidate old analysis
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setCurrentText('');
    setCurrentMood(null);
  };

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFeedback(feedbacks);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to generate analysis. Please check your API key configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all feedback data? This cannot be undone.")) {
      setFeedbacks([]);
      setAnalysis(null);
      localStorage.removeItem(STORAGE_KEY);
      setActiveTab('survey');
      setShowSuccess(false);
    }
  };
  
  const handleLoadDemo = () => {
      const demoData: Feedback[] = [
          { id: '1', text: "I feel like our meetings are too long and could be emails.", mood: 2, timestamp: Date.now() },
          { id: '2', text: "Love the new coffee machine! It's a small thing but makes a difference.", mood: 5, timestamp: Date.now() },
          { id: '3', text: "The team spirit is great, but workload is getting heavy.", mood: 3, timestamp: Date.now() },
          { id: '4', text: "I'm struggling with the lack of clear direction on the new project.", mood: 2, timestamp: Date.now() },
          { id: '5', text: "Friday lunches are the best!", mood: 5, timestamp: Date.now() },
          { id: '6', text: "Management is really listening to us lately. Good job.", mood: 4, timestamp: Date.now() },
          { id: '7', text: "The noise in the open office is distracting.", mood: 1, timestamp: Date.now() },
      ];
      setFeedbacks(demoData);
      setAnalysis(null);
      setActiveTab('dashboard');
  }

  // --- Views ---

  const renderSurveyView = () => (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showSuccess ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-xl shadow-soft-200/50 border border-white text-center flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Feedback Received!</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10">
            Thank you for helping us improve our culture. Your input has been anonymously recorded.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <button
              onClick={() => { setShowSuccess(false); setActiveTab('dashboard'); }}
              className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              View Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetForm}
              className="flex-1 py-3 px-6 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              Submit Another <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-soft-200/50 border border-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Check In</h2>
            <p className="text-slate-500">How are you feeling about work this week?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider text-center mb-4">
                Select a Mood
              </label>
              <MoodSelector selectedMood={currentMood} onSelect={setCurrentMood} />
            </div>

            <div className="space-y-4">
               <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider text-center">
                Your Thoughts
              </label>
              <div className="relative">
                <textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Share your honest feedback. What's working? What isn't?"
                  className="w-full h-40 p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400 text-lg leading-relaxed"
                  required
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm">
                  Anonymous
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!currentMood || !currentText.trim()}
              className={`
                w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform
                ${(!currentMood || !currentText.trim()) 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0'}
              `}
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  );

  const renderDashboardView = () => (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center">
            <span className="text-4xl font-bold text-indigo-600">{feedbacks.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Responses</span>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center">
            <span className="text-4xl font-bold text-emerald-500">
              {feedbacks.length > 0 
                ? (feedbacks.reduce((a, b) => a + b.mood, 0) / feedbacks.length).toFixed(1) 
                : '-'}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Avg Mood</span>
         </div>
         <div className="col-span-2 md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-2xl text-white flex items-center justify-between shadow-lg shadow-indigo-200">
            <div>
              <h3 className="font-bold text-lg">Team Pulse</h3>
              <p className="text-indigo-100 text-sm">Real-time culture analytics</p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-1 rounded-[2rem] shadow-xl shadow-soft-200/50 border border-white h-[400px]">
              <MoodChart feedbacks={feedbacks} />
           </div>

           {/* Recent Comments List */}
           <div className="bg-white rounded-[2rem] shadow-xl shadow-soft-200/50 border border-white overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                  Recent Voices
                </h3>
              </div>
              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {feedbacks.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    No comments yet. Be the first to share!
                  </div>
                ) : (
                  feedbacks.map((f) => (
                    <div key={f.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                         <div className={`
                            w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm
                            ${f.mood >= 4 ? 'bg-emerald-400 shadow-emerald-200' : f.mood === 3 ? 'bg-yellow-400 shadow-yellow-200' : 'bg-rose-400 shadow-rose-200'}
                          `}></div>
                          <div>
                            <p className="text-slate-600 text-base leading-relaxed">"{f.text}"</p>
                            <span className="text-xs text-slate-300 mt-2 block font-medium">
                              {new Date(f.timestamp).toLocaleDateString()} • Anonymous
                            </span>
                          </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>

        {/* Sidebar: AI Action Plan */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 h-auto min-h-[500px]">
            <ActionPlanCard 
              isLoading={isAnalyzing} 
              analysis={analysis} 
              onGenerate={handleGenerateAnalysis}
              hasData={feedbacks.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-soft-50 font-sans text-slate-800 pb-24 md:pb-0 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-soft-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('survey')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 transform hover:rotate-12 transition-transform">
                P
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Culture<span className="text-indigo-600">Pulse</span></h1>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => { setActiveTab('survey'); setShowSuccess(false); }}
                 className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'survey' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Survey
               </button>
               <button 
                 onClick={() => setActiveTab('dashboard')}
                 className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Dashboard
               </button>
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-3">
              {feedbacks.length === 0 && (
                  <button onClick={handleLoadDemo} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                      Load Demo Data
                  </button>
              )}
              {feedbacks.length > 0 && (
                <button 
                  onClick={handleClearData}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Clear Data"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {activeTab === 'survey' ? renderSurveyView() : renderDashboardView()}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 px-6 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => { setActiveTab('survey'); setShowSuccess(false); }}
            className={`flex flex-col items-center p-3 rounded-2xl w-full transition-colors ${activeTab === 'survey' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
          >
            <PlusCircle className={`w-6 h-6 mb-1 ${activeTab === 'survey' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Survey</span>
          </button>
          <div className="w-px h-8 bg-slate-100 mx-2"></div>
          <button 
             onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-3 rounded-2xl w-full transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
          >
            <LayoutDashboard className={`w-6 h-6 mb-1 ${activeTab === 'dashboard' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default App;
