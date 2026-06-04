import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface QuotationRequest {
  quantity: number;
  category: string;
  custom_printing: boolean;
  urgency: string;
}

export interface QuotationResult {
  basePrice: number;
  printingCost: number;
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  quotationId?: string;
}

export async function calculateQuotation(
  request: QuotationRequest,
  clientId: string = "guest"
): Promise<QuotationResult> {
  let baseMaterialRate = 0.5; // Default fallback
  let inkCostPerUnit = 0;
  let capacityOverhead = 1.0;

  try {
    // 1. Fetch live matrix from Firestore
    const inventoryRef = doc(db, 'inventory', 'pricing_matrix');
    const inventorySnap = await getDoc(inventoryRef);

    if (inventorySnap.exists()) {
      const data = inventorySnap.data();
      // Map category to base rate
      if (request.category === 'food_packaging' && data.rates?.food_packaging) {
        baseMaterialRate = data.rates.food_packaging;
      } else if (request.category === 'custom_box' && data.rates?.custom_box) {
        baseMaterialRate = data.rates.custom_box;
      } else if (data.rates?.default) {
        baseMaterialRate = data.rates.default;
      }

      if (request.custom_printing && data.printing_ink_cost) {
        inkCostPerUnit = data.printing_ink_cost;
      }

      if (request.urgency === 'high' && data.capacity_overheads?.rush) {
        capacityOverhead = data.capacity_overheads.rush;
      }
    } else {
      console.warn("Pricing matrix document not found in inventory collection, using defaults.");
      if (request.custom_printing) inkCostPerUnit = 0.2;
      if (request.urgency === 'high') capacityOverhead = 1.2;
    }
  } catch (error) {
    console.error("Error fetching pricing matrix:", error);
    // Proceed with fallback values
    if (request.custom_printing) inkCostPerUnit = 0.2;
    if (request.urgency === 'high') capacityOverhead = 1.2;
  }

  // 2. Calculate Costs
  const basePrice = request.quantity * baseMaterialRate * capacityOverhead;
  const printingCost = request.custom_printing ? (request.quantity * inkCostPerUnit) : 0;
  
  const subtotal = basePrice + printingCost;
  const vat = subtotal * 0.05; // 5% Dubai VAT
  const total = subtotal + vat;

  const result: QuotationResult = {
    basePrice: Number(basePrice.toFixed(2)),
    printingCost: Number(printingCost.toFixed(2)),
    subtotal: Number(subtotal.toFixed(2)),
    vat: Number(vat.toFixed(2)),
    total: Number(total.toFixed(2)),
    currency: "AED"
  };

  // 3. Save to Client's Quotation Profile
  try {
    // We assume there's a 'clients' collection with 'quotations' subcollection
    const quotationsRef = collection(db, 'clients', clientId, 'quotations');
    const docRef = await addDoc(quotationsRef, {
      request,
      calculation: result,
      createdAt: serverTimestamp(),
      status: 'pending_approval'
    });
    result.quotationId = docRef.id;
  } catch (error) {
    console.error("Failed to save quotation to Firestore:", error);
  }

  return result;
}
