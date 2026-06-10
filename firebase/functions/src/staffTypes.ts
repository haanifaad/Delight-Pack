export type MaterialUnit = 'Rolls' | 'Meters' | 'Units' | 'Liters' | 'Boxes' | 'Pallets';

export interface RawMaterial {
  id: string;
  sku: string;
  name: string;
  location: string;
  systemStock: number;
  safetyThreshold: number;
  unit: MaterialUnit;
  lotNumber?: string;
  lastUpdated: string;
}

export interface MaterialUsageLog {
  id: string;
  materialId: string;
  quantityUsed: number;
  staffId: string;
  timestamp: string;
  jobId?: string;
  type: 'production' | 'wastage' | 'reconciliation';
  reason?: string; // used for wastage
}

export type OrderStatus = 'Pending' | 'Printing' | 'Cutting' | 'Finished' | 'Dispatched';

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  itemsDescription: string;
  status: OrderStatus;
  isRush: boolean;
  timerSeconds: number;
  qaPassed: boolean;
  podUrl?: string; // Proof of delivery image URL
  routeGroup?: string;
  destination?: string;
  driverId?: string;
  updatedAt: string;
}

export type MachineState = 'Active' | 'Idle' | 'Under Maintenance' | 'Broken';

export interface Machine {
  id: string;
  name: string;
  status: MachineState;
  downtimeReason?: string;
  lastUpdated: string;
}

export interface ShiftLog {
  id: string;
  staffId: string;
  staffName: string;
  shiftType: string;
  message: string;
  timestamp: string;
}

export interface DispatchDriver {
  id: string;
  name: string;
  vehicleStatus: 'Loading' | 'Available' | 'On Route';
  assignedOrderIds: string[];
}
