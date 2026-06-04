/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Package, TrendingUp, AlertCircle, RefreshCw, FileText, Send } from 'lucide-react';

interface Prediction {
  id: number;
  prediction_month: string;
  trends: string;
  materials_required: {
    materialName: string;
    requiredQuantity: number;
    justification: string;
  }[];
  created_at: string;
}

export default function App() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [blogTriggering, setBlogTriggering] = useState(false);
  const [marketingTriggering, setMarketingTriggering] = useState(false);
  const [marketingResult, setMarketingResult] = useState<{linkedinPost: string; instagramCaption: string; hashtags: string[]} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/predictions');
      if (!res.ok) throw new Error('Failed to fetch predictions');
      const data = await res.json();
      setPredictions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    try {
      setTriggering(true);
      const res = await fetch('/api/run-prediction', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to trigger prediction task');
      // Adding a small delay to simulate the background job running in case they retry fetching
      setTimeout(() => {
        fetchPredictions();
      }, 3000);
    } catch (err: any) {
       setError(err.message);
    } finally {
      setTriggering(false);
    }
  };

  const runBlogGeneration = async () => {
    try {
      setBlogTriggering(true);
      const res = await fetch('/api/generate-blog', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to trigger blog generation');
      alert('Blog generation started! It will be saved to the /content directory.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBlogTriggering(false);
    }
  };

  const runMarketingGeneration = async () => {
    try {
      setMarketingTriggering(true);
      setMarketingResult(null);
      const res = await fetch('/api/generate-marketing', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate marketing data');
      const data = await res.json();
      setMarketingResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMarketingTriggering(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" />
              Delight Pack Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Supply chain predictions, marketing automation & SEO blogging.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={runMarketingGeneration}
              disabled={marketingTriggering}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
            >
              <Send className={"w-4 h-4 " + (marketingTriggering ? 'animate-bounce' : '')} />
              {marketingTriggering ? 'Generating...' : 'Marketing Copy'}
            </button>
            <button
              onClick={runBlogGeneration}
              disabled={blogTriggering}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
            >
              <FileText className={"w-4 h-4 " + (blogTriggering ? 'animate-pulse' : '')} />
              {blogTriggering ? 'Writing...' : 'Generate SEO Blog'}
            </button>
            <button
              onClick={runPrediction}
              disabled={triggering}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
            >
              <RefreshCw className={"w-4 h-4 " + (triggering ? 'animate-spin' : '')} />
              {triggering ? 'Running...' : 'Run Prediction'}
            </button>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {marketingResult && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold tracking-tight">Generated Marketing Assets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">LinkedIn</span>
                  Post Draft
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap text-sm text-slate-700">
                  {marketingResult.linkedinPost}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">Instagram</span>
                  Caption
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap text-sm text-slate-700">
                  {marketingResult.instagramCaption}
                  <div className="mt-4 text-indigo-600 font-medium tracking-wide">
                    {marketingResult.hashtags.map(h => "#" + h.replace('#','')).join(' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="space-y-6">
          {loading ? (
             <div className="flex justify-center py-12">
               <RefreshCw className="w-8 h-8 animate-spin text-slate-300" />
             </div>
          ) : predictions.length === 0 ? (
             <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
               <p>No predictions available.</p>
               <p className="text-sm mt-1">Click "Run Prediction Now" to start the worker.</p>
             </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                {predictions.map((p) => (
                  <div key={p.id} className="contents">
                    {/* Summary Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-max sticky top-8">
                      <div className="text-sm font-mono text-slate-500 mb-1">Target Month</div>
                      <h2 className="text-3xl font-bold tracking-tight mb-6">{p.prediction_month}</h2>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium text-slate-700 pb-2 border-b border-slate-100">
                           <TrendingUp className="w-4 h-4 text-emerald-500" />
                           Detected Trends
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {p.trends}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                         Generated: {new Date(p.created_at).toLocaleString()}
                      </div>
                    </div>

                    {/* Materials Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-4 text-lg">Predicted Materials Required</h3>
                      <div className="space-y-4">
                         {Array.isArray(p.materials_required) ? p.materials_required.map((mat, i) => (
                           <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="flex items-center justify-between mb-2">
                               <div className="font-semibold text-slate-800">{mat.materialName}</div>
                               <div className="font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                                 {mat.requiredQuantity} units
                               </div>
                             </div>
                             <p className="text-sm text-slate-500">
                               <span className="font-medium text-slate-600 text-xs uppercase tracking-wider">Reason:</span> {mat.justification}
                             </p>
                           </div>
                         )) : (
                            <p className="text-sm text-slate-500">Could not parse materials list.</p>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
