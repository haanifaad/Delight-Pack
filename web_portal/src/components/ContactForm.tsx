"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateWhatsAppLink } from '@/lib/whatsapp';

// Define the validation schema
const schema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  packagingType: z.enum(["Food Packaging", "Box Packaging", "Industrial Packaging"], {
    message: "Please select a packaging type",
  }),
  quantity: z.number({
    invalid_type_error: "Quantity must be a number",
  }).min(100, "Minimum order quantity is 100"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      packagingType: "Box Packaging",
    }
  });

  const onSubmit = (data: FormData) => {
    // Prevent default implicitly done by react-hook-form's handleSubmit
    const TARGET_PHONE_NUMBER = "+971000000000"; // Replace with actual number
    
    const whatsappUrl = generateWhatsAppLink(TARGET_PHONE_NUMBER, {
      customerName: data.customerName,
      packagingType: data.packagingType,
      quantity: data.quantity,
      message: data.message,
    });
    
    // Dynamically redirect user to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto bg-charcoal p-8 rounded-xl border-4 border-charcoal-light shadow-lg">
      <h3 className="text-3xl font-bold text-foreground mb-6 uppercase">Request a Quote</h3>
      
      <div className="mb-4">
        <label className="block text-text-muted font-bold mb-2">Full Name</label>
        <input 
          {...register("customerName")} 
          className="w-full bg-charcoal-dark text-foreground border-2 border-charcoal-light rounded p-3 focus-visible:outline-none focus-visible:border-primary transition-colors"
          placeholder="John Doe"
        />
        {errors.customerName && <p className="text-secondary mt-1 text-sm font-bold">{errors.customerName.message}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-text-muted font-bold mb-2">Phone Number</label>
        <input 
          {...register("phone")} 
          className="w-full bg-charcoal-dark text-foreground border-2 border-charcoal-light rounded p-3 focus-visible:outline-none focus-visible:border-primary transition-colors"
          placeholder="+971 50 123 4567"
        />
        {errors.phone && <p className="text-secondary mt-1 text-sm font-bold">{errors.phone.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-text-muted font-bold mb-2">Packaging Type</label>
        <select 
          {...register("packagingType")}
          className="w-full bg-charcoal-dark text-foreground border-2 border-charcoal-light rounded p-3 focus-visible:outline-none focus-visible:border-primary transition-colors appearance-none"
        >
          <option value="Food Packaging">Food Packaging</option>
          <option value="Box Packaging">Box Packaging</option>
          <option value="Industrial Packaging">Industrial Packaging</option>
        </select>
        {errors.packagingType && <p className="text-secondary mt-1 text-sm font-bold">{errors.packagingType.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-text-muted font-bold mb-2">Quantity (min 100)</label>
        <input 
          type="number"
          {...register("quantity", { valueAsNumber: true })} 
          className="w-full bg-charcoal-dark text-foreground border-2 border-charcoal-light rounded p-3 focus-visible:outline-none focus-visible:border-primary transition-colors"
          placeholder="500"
        />
        {errors.quantity && <p className="text-secondary mt-1 text-sm font-bold">{errors.quantity.message}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-text-muted font-bold mb-2">Additional Details (Optional)</label>
        <textarea 
          {...register("message")} 
          className="w-full bg-charcoal-dark text-foreground border-2 border-charcoal-light rounded p-3 focus-visible:outline-none focus-visible:border-primary transition-colors min-h-[100px]"
          placeholder="Any specific sizes, materials, or prints?"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full btn-retail disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Send via WhatsApp'}
      </button>
    </form>
  );
}
