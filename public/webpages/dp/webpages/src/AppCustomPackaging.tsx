import React, { useState, useEffect } from "react";
import { Moon, Sun, MapPin, Phone, Clock } from "lucide-react";
import { CustomPackagingForm } from "./components/CustomPackagingForm";

export default function AppCustomPackaging() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 transition-colors duration-300 font-sans text-foreground dark:text-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card glass-card backdrop-blur-2xl/80 dark:bg-primary/80 backdrop-blur-lg border-b border-border dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/delight-pack-logo.svg"
              alt="Delight Pack"
              className="h-10 w-auto"
            />
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-muted-foreground dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white leading-tight mb-6">
              Request custom packaging
            </h1>
            <p className="text-lg text-muted-foreground dark:text-slate-400 mb-10">
              Tell us your box dimensions, material requirements, and artwork. Our Dubai team will prepare a tailored quote.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">Location</p>
                  <p className="text-muted-foreground dark:text-slate-400 text-sm">Ras Al Khor Industrial Area 2, Dubai, UAE</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">Phone</p>
                  <a href="tel:+971559610972" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    055 961 0972
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">Response time</p>
                  <p className="text-muted-foreground dark:text-slate-400 text-sm">Quote within 1 business day</p>
                </div>
              </li>
            </ul>
          </div>
          <CustomPackagingForm />
        </div>
      </main>

      <footer className="border-t border-border dark:border-slate-800 bg-card glass-card backdrop-blur-2xl dark:bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground dark:text-slate-400">
          &copy; {new Date().getFullYear()} Delight Pack LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
