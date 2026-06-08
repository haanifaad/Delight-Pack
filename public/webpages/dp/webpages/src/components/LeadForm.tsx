import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

const MAX_STEPS = 2;

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  businessName: z.string().min(2, "Business name is required"),
  requirements: z.string().min(10, "Please provide more details about your requirements"),
  budget: z.string().min(1, "Please select a budget range"),
});

type FormValues = z.infer<typeof formSchema>;

export function LeadForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      businessName: "",
      requirements: "",
      budget: "",
    },
    mode: "onTouched",
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'phone']);
    }
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, MAX_STEPS));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted: ", data);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-card glass-card backdrop-blur-2xl  border border-border  rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 " />
          </div>
          <h3 className="text-2xl font-semibold text-foreground  mb-2">Request Received</h3>
          <p className="text-muted-foreground  max-w-md mx-auto">
            Thank you for reaching out. One of our packaging specialists in Dubai will contact you within 24 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-card glass-card backdrop-blur-2xl  border border-border  rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 ">
        <motion.div 
          className="h-full bg-blue-600 "
          initial={{ width: "50%" }}
          animate={{ width: `${(step / MAX_STEPS) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      <div className="mb-8 mt-2">
        <span className="text-sm font-semibold tracking-wider text-blue-600  uppercase">
          Step {step} of {MAX_STEPS}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground  mt-1">
          {step === 1 ? "Your Details" : "Project Requirements"}
        </h2>
        <p className="text-muted-foreground  mt-2">
          {step === 1 ? "Tell us a bit about yourself so we can get back to you." : "Help us understand your packaging needs."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="relative overflow-hidden min-h-[320px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 absolute inset-0"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground ">First Name</label>
                    <input
                      {...register("firstName")}
                      className={cn(
                        "px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none",
                        errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                      )}
                      placeholder="John"
                    />
                    {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground ">Last Name</label>
                    <input
                      {...register("lastName")}
                      className={cn(
                        "px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none",
                        errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                      )}
                      placeholder="Doe"
                    />
                    {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground ">Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    className={cn(
                      "px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none",
                      errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                    )}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground ">Phone / WhatsApp</label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className={cn(
                      "px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none",
                      errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                    )}
                    placeholder="+971 50 123 4567"
                  />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 absolute inset-0"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground ">Business Name</label>
                  <input
                    {...register("businessName")}
                    className={cn(
                      "px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none",
                      errors.businessName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                    )}
                    placeholder="Your Company LLC"
                  />
                  {errors.businessName && <span className="text-xs text-red-500">{errors.businessName.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                   <label className="text-sm font-medium text-foreground ">Estimated Budget (AED)</label>
                   <div className="relative">
                     <select
                       {...register("budget")}
                       className={cn(
                         "w-full px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none appearance-none",
                         errors.budget ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                       )}
                     >
                       <option value="" disabled>Select a budget range...</option>
                       <option value="under_10k">Under 10,000 AED</option>
                       <option value="10k_50k">10,000 - 50,000 AED</option>
                       <option value="50k_100k">50,000 - 100,000 AED</option>
                       <option value="over_100k">Over 100,000 AED</option>
                     </select>
                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                       <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                     </div>
                   </div>
                   {errors.budget && <span className="text-xs text-red-500">{errors.budget.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground ">Packaging Requirements</label>
                  <textarea
                    {...register("requirements")}
                    rows={4}
                    className={cn(
                      "px-4 py-3 rounded-xl border bg-background  text-foreground  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none resize-none",
                      errors.requirements ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border "
                    )}
                    placeholder="E.g., 5000 custom corrugated boxes for cosmetic products..."
                  />
                  {errors.requirements && <span className="text-xs text-red-500">{errors.requirements.message}</span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border ">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-xl border border-border  text-foreground  font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
          )}
          
          {step < MAX_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 bg-primary glass-card backdrop-blur-2xl hover:bg-primary-light text-primary-foreground px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              Submit Request
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
