'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { storage, db } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CareersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !email) return;

    setUploading(true);
    try {
      // 1. Upload to Storage
      const fileRef = ref(storage, `resumes/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Write to Firestore
      await addDoc(collection(db, 'job_applications'), {
        name,
        email,
        resumeUrl: downloadURL,
        status: 'pending',
        appliedAt: serverTimestamp()
      });

      setSuccess(true);
      setFile(null);
      setName('');
      setEmail('');
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Join Delight Pack</h1>
        <p className="text-muted-foreground text-center mb-12">Submit your resume and details to apply for a position on our factory floor, logistics, or administration teams.</p>
        
        {success ? (
          <div className="bg-muted border border-emerald-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Application Received!</h2>
            <p className="text-muted-foreground">We will review your profile and get back to you shortly.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-8 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full hover:bg-emerald-500/20 transition-colors"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-muted border border-slate-800 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-slate-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted border border-slate-800 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-slate-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm text-muted-foreground">Resume / CV (PDF, DOCX)</label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-slate-600 bg-[#111]'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-10 h-10 text-emerald-400" />
                    <span className="text-sm font-medium text-foreground">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading || !file || !name || !email}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl mt-6 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
