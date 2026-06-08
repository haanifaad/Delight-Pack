import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  Box,
  Layers,
  Truck,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "../utils";
import { DesignFileUpload } from "./DesignFileUpload";
import {
  MATERIAL_OPTIONS,
  URGENCY_OPTIONS,
  MATERIAL_TYPES,
  DELIVERY_URGENCY,
  DIMENSION_UNITS,
} from "../types/customOrder";
import { createOrderId, submitCustomPackagingRequest } from "../lib/customOrderService";
import { InvoiceDownloadButton } from "./InvoiceDownloadButton";

const MAX_STEPS = 4;

const formSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(8, "Phone number is required"),
  company: z.string().trim().min(2, "Company name is required"),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  height: z.coerce.number().positive("Height must be greater than 0"),
  unit: z.enum(DIMENSION_UNITS),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  materialType: z.enum(MATERIAL_TYPES, { message: "Select a material type" }),
  materialNotes: z.string().max(2000).optional(),
  deliveryUrgency: z.enum(DELIVERY_URGENCY, { message: "Select delivery urgency" }),
});

type FormValues = z.infer<typeof formSchema>;

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["firstName", "lastName", "email", "phone", "company"],
  2: ["length", "width", "height", "unit", "quantity"],
  3: ["materialType", "materialNotes"],
  4: ["deliveryUrgency"],
};

const STEP_META = [
  { icon: User, title: "Contact details", subtitle: "How we reach you about your quote." },
  { icon: Box, title: "Box dimensions", subtitle: "Specify the inner or outer dimensions you need." },
  { icon: Layers, title: "Material type", subtitle: "Choose the grade that fits your product." },
  { icon: Truck, title: "Design & delivery", subtitle: "Upload artwork and select your timeline." },
];

function inputClass(hasError: boolean) {
  return cn(
    "px-4 py-3 rounded-xl border bg-background dark:bg-slate-800/50 text-foreground dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none w-full",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-border dark:border-slate-700"
  );
}

export function CustomPackagingForm() {
  const [step, setStep] = useState(1);
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      length: undefined,
      width: undefined,
      height: undefined,
      unit: "cm",
      quantity: undefined,
      materialType: undefined,
      materialNotes: "",
      deliveryUrgency: undefined,
    },
    mode: "onTouched",
  });

  const selectedMaterial = watch("materialType");

  const nextStep = async () => {
    const fields = STEP_FIELDS[step];
    const isValid = await trigger(fields);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, MAX_STEPS));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const orderId = createOrderId();

    try {
      const result = await submitCustomPackagingRequest(
        orderId,
        {
          contact: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
          },
          dimensions: {
            length: data.length,
            width: data.width,
            height: data.height,
            unit: data.unit,
          },
          quantity: data.quantity,
          materialType: data.materialType,
          materialNotes: data.materialNotes || undefined,
          deliveryUrgency: data.deliveryUrgency,
        },
        designFiles
      );

      setSubmittedOrderId(result.orderId);
      setSubmittedEmail(data.email);
      setEmailSent(result.confirmationEmailSent);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrderId) {
    return (
      <div className="bg-card glass-card backdrop-blur-2xl dark:bg-primary border border-border dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col items-center justify-center text-center min-h-[480px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground dark:text-white mb-2">
            Custom packaging request received
          </h3>
          <p className="text-muted-foreground dark:text-slate-400 max-w-md mx-auto mb-4">
            Our specialists will review your specifications and contact you within 1 business day.
          </p>
          <p className="text-sm font-mono text-muted-foreground dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg inline-block">
            Ref: {submittedOrderId.slice(0, 8).toUpperCase()}
          </p>
          {emailSent && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-4">
              A confirmation email has been sent to your inbox.
            </p>
          )}
          {submittedEmail && (
            <div className="mt-8 w-full max-w-md">
              <InvoiceDownloadButton orderId={submittedOrderId} email={submittedEmail} />
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const StepIcon = STEP_META[step - 1].icon;

  return (
    <div className="bg-card glass-card backdrop-blur-2xl dark:bg-primary border border-border dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
        <motion.div
          className="h-full bg-blue-600 dark:bg-blue-500"
          animate={{ width: `${(step / MAX_STEPS) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      <div className="mb-8 mt-2">
        <span className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          Step {step} of {MAX_STEPS}
        </span>
        <div className="flex items-center gap-3 mt-2">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <StepIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground dark:text-white">
              {STEP_META[step - 1].title}
            </h2>
            <p className="text-muted-foreground dark:text-slate-400 text-sm mt-0.5">
              {STEP_META[step - 1].subtitle}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="relative overflow-hidden min-h-[340px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground dark:text-slate-300">First name</label>
                    <input {...register("firstName")} className={inputClass(!!errors.firstName)} placeholder="John" />
                    {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground dark:text-slate-300">Last name</label>
                    <input {...register("lastName")} className={inputClass(!!errors.lastName)} placeholder="Doe" />
                    {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground dark:text-slate-300">Email</label>
                  <input {...register("email")} type="email" className={inputClass(!!errors.email)} placeholder="john@company.ae" />
                  {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground dark:text-slate-300">Phone / WhatsApp</label>
                  <input {...register("phone")} type="tel" className={inputClass(!!errors.phone)} placeholder="+971 50 123 4567" />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground dark:text-slate-300">Company</label>
                  <input {...register("company")} className={inputClass(!!errors.company)} placeholder="Your Company LLC" />
                  {errors.company && <span className="text-xs text-red-500">{errors.company.message}</span>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-3 gap-4">
                  {(["length", "width", "height"] as const).map((field) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground dark:text-slate-300 capitalize">{field}</label>
                      <input
                        {...register(field)}
                        type="number"
                        step="any"
                        min="0"
                        className={inputClass(!!errors[field])}
                        placeholder="0"
                      />
                      {errors[field] && <span className="text-xs text-red-500">{errors[field]?.message}</span>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground dark:text-slate-300">Unit</label>
                    <select {...register("unit")} className={inputClass(false)}>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="in">Inches (in)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground dark:text-slate-300">Quantity</label>
                    <input
                      {...register("quantity")}
                      type="number"
                      min="1"
                      className={inputClass(!!errors.quantity)}
                      placeholder="e.g. 5000"
                    />
                    {errors.quantity && <span className="text-xs text-red-500">{errors.quantity.message}</span>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Enter inner box dimensions unless you need outer shipping dimensions — note that in material notes on the next step.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5"
              >
                <Controller
                  name="materialType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-3">
                      {MATERIAL_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                            field.value === option.value
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-500"
                              : "border-border dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          )}
                        >
                          <input
                            type="radio"
                            className="mt-1"
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                          />
                          <div>
                            <p className="font-medium text-foreground dark:text-white">{option.label}</p>
                            <p className="text-sm text-muted-foreground dark:text-slate-400">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.materialType && (
                  <span className="text-xs text-red-500">{errors.materialType.message}</span>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground dark:text-slate-300">
                    Additional notes <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    {...register("materialNotes")}
                    rows={3}
                    className={cn(inputClass(false), "resize-none")}
                    placeholder={
                      selectedMaterial === "food_grade"
                        ? "E.g., direct food contact, moisture barrier..."
                        : "E.g., ECT rating, stacking strength, coatings..."
                    }
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <DesignFileUpload files={designFiles} onFilesChange={setDesignFiles} />

                <div>
                  <label className="text-sm font-medium text-foreground dark:text-slate-300 mb-3 block">
                    Delivery urgency
                  </label>
                  <Controller
                    name="deliveryUrgency"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {URGENCY_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex flex-col p-4 rounded-xl border-2 cursor-pointer text-center transition-all",
                              field.value === option.value
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-500"
                                : "border-border dark:border-slate-700 hover:border-slate-300"
                            )}
                          >
                            <input
                              type="radio"
                              className="sr-only"
                              value={option.value}
                              checked={field.value === option.value}
                              onChange={() => field.onChange(option.value)}
                            />
                            <span className="font-semibold text-foreground dark:text-white">{option.label}</span>
                            <span className="text-xs text-muted-foreground dark:text-slate-400 mt-1">{option.description}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  />
                  {errors.deliveryUrgency && (
                    <span className="text-xs text-red-500 mt-2 block">{errors.deliveryUrgency.message}</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        <div className="flex items-center gap-4 pt-6 border-t border-border dark:border-slate-800">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border border-border dark:border-slate-700 text-foreground dark:text-slate-300 font-medium hover:bg-background dark:hover:bg-primary-light transition-colors disabled:opacity-50"
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
              disabled={isSubmitting}
              className="flex-1 bg-primary dark:bg-card glass-card backdrop-blur-2xl hover:bg-primary-light dark:hover:bg-slate-100 text-white dark:text-foreground px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Request custom packaging
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
