'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ShieldCheck, CheckCircle2, XCircle, Loader2, ChevronRight } from 'lucide-react';

type Job = {
  id: string;
  sku: string;
  status: string;
  quantity: number;
  qa_lists: QAEntry[];
};

type QAEntry = {
  id: string;
  stage: string;
  passed: boolean;
  notes: string | null;
};

const QA_ITEMS = [
  { label: 'Colour Registration Aligned', key: 'colour_reg' },
  { label: 'Die-Cut Dimensions Within Tolerance (±0.5mm)', key: 'diecut_dim' },
  { label: 'No Ink Smearing or Offsetting', key: 'ink_smear' },
  { label: 'Substrate Matches Job Spec', key: 'substrate_match' },
  { label: 'Lamination Adhesion Test Passed', key: 'lamination' },
  { label: 'Barcode Readability Verified', key: 'barcode' },
];

export default function QAChecklistPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'pass' | 'fail' | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/staff/jobs');
      // Only show jobs in QA stage
      setJobs(data.jobs.filter((j: Job) => j.status === 'QA'));
    } catch (e) {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const selectJob = (job: Job) => {
    setSelectedJob(job);
    setChecks({});
    setNotes('');
    setSubmitResult(null);
  };

  const toggleCheck = (key: string) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allPassed = QA_ITEMS.every(item => checks[item.key] === true);

  const handleSubmit = async (passed: boolean) => {
    if (!selectedJob) return;
    setSubmitting(true);

    try {
      await api.post('/qa', {
        job_id: selectedJob.id,
        stage: selectedJob.status,
        passed,
        notes: notes || null,
      });

      setSubmitResult(passed ? 'pass' : 'fail');

      // If passed, advance job to READY
      if (passed) {
        await api.patch(`/staff/jobs/${selectedJob.id}/status`, { status: 'READY' });
      }

      // Refresh job list after short delay
      setTimeout(() => {
        fetchJobs();
        setSelectedJob(null);
        setSubmitResult(null);
      }, 2000);
    } catch (e) {
      console.error('Failed to submit QA');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center space-x-4 mb-8">
        <ShieldCheck className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-white">QA Checklists</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left: Job Queue */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4">
          <h2 className="text-lg font-bold text-neutral-300 mb-4">Jobs Awaiting QA</h2>
          {jobs.length === 0 ? (
            <p className="text-neutral-500 text-sm">No jobs currently in QA stage.</p>
          ) : (
            <div className="space-y-2">
              {jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => selectJob(job)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors flex items-center justify-between ${
                    selectedJob?.id === job.id
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <div>
                    <div className="font-mono text-sm text-green-400">{job.sku}</div>
                    <div className="text-xs text-neutral-500">Qty: {job.quantity}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Checklist Form */}
        <div className="md:col-span-2 bg-neutral-800 rounded-lg border border-neutral-700 p-6">
          {!selectedJob ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 py-16">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Select a job from the queue to begin inspection.</p>
            </div>
          ) : submitResult ? (
            <div className="flex flex-col items-center justify-center h-full py-16">
              {submitResult === 'pass' ? (
                <>
                  <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                  <p className="text-2xl font-bold text-green-400">QA PASSED</p>
                  <p className="text-neutral-400 mt-2">Job {selectedJob.sku} advanced to READY.</p>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-red-500 mb-4" />
                  <p className="text-2xl font-bold text-red-400">QA FAILED</p>
                  <p className="text-neutral-400 mt-2">Job {selectedJob.sku} held for rework.</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">
                  Inspecting: <span className="text-green-400 font-mono">{selectedJob.sku}</span>
                </h2>
                <p className="text-sm text-neutral-500 mt-1">Complete all checks below. All items must pass for the job to advance.</p>
              </div>

              <div className="space-y-3 mb-8">
                {QA_ITEMS.map(item => (
                  <button
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    className={`w-full text-left p-4 rounded-lg border flex items-center gap-4 transition-all ${
                      checks[item.key]
                        ? 'bg-green-500/10 border-green-600'
                        : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      checks[item.key] ? 'bg-green-500 border-green-500' : 'border-neutral-600'
                    }`}>
                      {checks[item.key] && <CheckCircle2 className="w-4 h-4 text-black" />}
                    </div>
                    <span className={`text-sm font-medium ${checks[item.key] ? 'text-green-300' : 'text-neutral-300'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Inspector Notes (Optional)</label>
                <textarea
                  className="w-full bg-neutral-900 border border-neutral-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={3}
                  placeholder="Any observations, defects, or comments..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={!allPassed || submitting}
                  className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors ${
                    allPassed
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '✓ Pass & Advance'}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="flex-1 py-4 bg-red-800 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-colors"
                >
                  ✗ Fail & Hold
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
