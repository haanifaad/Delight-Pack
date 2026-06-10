import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, User, Briefcase, GraduationCap, Clock, Star, Mail, Phone, MapPin } from 'lucide-react';

const GATEWAY_URL = '../../index.html';

export function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  const handleIframeLoad = () => {
    if (isSubmitting) {
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60 group-hover:border-muted-foreground/30';

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans">
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full relative z-10">
        <a href={GATEWAY_URL} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl group-hover:opacity-90 transition-opacity shadow-lg">
            D
          </div>
          <span className="font-semibold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">Delight Pack</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href={GATEWAY_URL} className="hover:text-primary transition-colors">Gateway</a>
          <a href="#/careers" className="text-primary font-semibold">Careers</a>
          <a href="#/contact" className="hover:text-primary transition-colors">Contact</a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          We're actively hiring
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
          Shape the Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Manufacturing</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light">
          Establish your professional baseline, evaluate your current skill set, and define future career aspirations with our comprehensive profile evaluation.
        </p>

        <a
          href="#application-form"
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          Build Your Career Profile
          <ArrowRight className="w-5 h-5" />
        </a>
      </main>

      <section id="application-form" className="max-w-3xl mx-auto px-6 pb-32 relative z-10 scroll-mt-24">
        {submitted ? (
          <div className="glass-card bg-card border border-border rounded-3xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Profile Submitted!</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Thank you for establishing your professional baseline with Delight Pack. Our talent team will review your profile and reach out if there's a strong mutual fit.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-card hover:bg-card-hover border border-border rounded-full font-medium text-foreground transition-all"
            >
              Submit Another Profile
            </button>
          </div>
        ) : (
          <div className="glass-card bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">Comprehensive Career Profile</h2>
              <p className="text-muted-foreground">Complete this form to evaluate your current skill set and join our talent network.</p>
            </div>

            <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }} onLoad={handleIframeLoad} title="form-submit" />

            <form
              action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSeTY7iF_KeG0xAW2TC7Nz4G_TI297fTflaSLHQvVELCFjFKKg/formResponse"
              method="POST"
              target="hidden_iframe"
              onSubmit={handleSubmit}
              className="space-y-8 relative z-10"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 text-primary" /> Name
                  </label>
                  <input type="text" name="entry.2040230183" required className={inputClass} placeholder="Name" />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 text-primary" /> Gmail
                  </label>
                  <input type="email" name="entry.1660689047" className={inputClass} placeholder="email@gmail.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 text-primary" /> Phone No.
                  </label>
                  <input type="tel" name="entry.1605398322" required className={inputClass} placeholder="+971 55 961 0972" />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <MapPin className="w-4 h-4 text-primary" /> City/Street
                  </label>
                  <input type="text" name="entry.1713189887" className={inputClass} placeholder="Dubai, UAE" />
                </div>
              </div>

              <div className="w-full h-px bg-border my-8" />

              <div className="space-y-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 text-primary" /> Full Legal Name
                  </label>
                  <input type="text" name="entry.534585305" className={inputClass} placeholder="John Doe" />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Current or Most Recent Job Title
                  </label>
                  <input type="text" name="entry.597353357" className={inputClass} placeholder="e.g. Senior Operations Manager" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 text-primary" /> Total Years of Experience
                  </label>
                  <div className="relative">
                    <select name="entry.337034254" required className={`${inputClass} appearance-none`} defaultValue="">
                      <option value="" disabled>Select experience...</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1 - 3 years">1 - 3 years</option>
                      <option value="4 - 7 years">4 - 7 years</option>
                      <option value="8 - 15 years">8 - 15 years</option>
                      <option value="16+ years">16+ years</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <GraduationCap className="w-4 h-4 text-primary" /> Highest Education Level
                  </label>
                  <div className="relative">
                    <select name="entry.298322415" required className={`${inputClass} appearance-none`} defaultValue="">
                      <option value="" disabled>Select education...</option>
                      <option value="High School Diploma/GED">High School Diploma/GED</option>
                      <option value="Associate's Degree">Associate's Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Doctorate (PhD, EdD, JD, MD, etc.)">Doctorate (PhD, EdD, JD, MD, etc.)</option>
                      <option value="Professional Certification/Other">Professional Certification/Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-border my-8" />

              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> Skill Set Matrix
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Rate your current proficiency (1 = Novice, 5 = Expert)</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Technical Domain Expertise', name: 'entry.306881122' },
                    { label: 'Problem Solving and Critical Thinking', name: 'entry.537133097' },
                    { label: 'Communication and Presentation Skills', name: 'entry.818182378' },
                    { label: 'Leadership and Team Management', name: 'entry.1491572959' },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-muted-foreground/20 transition-colors"
                    >
                      <span className="font-medium text-foreground text-sm md:text-base">{skill.label}</span>
                      <div className="flex items-center gap-2 md:gap-4 self-start md:self-auto">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label key={num} className="relative flex items-center justify-center cursor-pointer group/radio">
                            <input type="radio" name={skill.name} value={num} required className="peer sr-only" />
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium border border-border bg-background text-muted-foreground peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all group-hover/radio:border-primary/50">
                              {num}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Profile...
                    </>
                  ) : (
                    'Submit Career Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
