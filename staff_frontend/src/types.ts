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

// Phase 4/5 Advanced Types
export interface Warehouse {
  id: string;
  name: string;
  capacityPercentage: number;
  alertMessage?: string;
}

export interface RfidLog {
  id: string;
  timestamp: string;
  gateId: string;
  lpn: string;
  direction: 'Inbound' | 'Outbound';
  status: 'Cleared' | 'Flagged';
}

export interface RMA {
  id: string;
  supplierName: string;
  itemName: string;
  reason: string;
  status: 'Pending Approval' | 'Ready for Pickup' | 'Completed';
}

export interface MaintenanceOrder {
  id: string;
  machineName: string;
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Scheduled' | 'Pending' | 'In Progress' | 'Completed';
}

export interface ToolItem {
  id: string;
  name: string;
  code: string;
  status: 'Available' | 'Checked Out' | 'Lost';
  checkedOutBy?: string;
}

export interface EnvironmentalLog {
  id: string;
  zone: string;
  temperature: number;
  humidity: number;
  loggedBy: string;
  timestamp: string;
}

// Phase 6/7 Advanced Logistics & Workforce Types
export interface GatePass {
  id: string;
  courierName: string;
  vehiclePlate: string;
  linkedOrders: string[];
  issuedBy: string;
  timestamp: string;
  status: 'Active' | 'Completed';
}

export interface FuelLog {
  id: string;
  driverId: string;
  liters: number;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  description: string;
  type: 'Near Miss' | 'Injury' | 'Hazard';
  reportedBy: string;
  timestamp: string;
  status: 'Open' | 'Investigating' | 'Closed';
}

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  requesterShift: string;
  targetShift: string;
  status: 'Pending' | 'Approved' | 'Declined';
  timestamp: string;
}

// Phase 9/10 Quality & Sustainability Types
export interface QualityAudit {
  id: string;
  target: string;
  status: 'Passed' | 'Failed' | 'Pending';
  notes: string;
  staffId: string;
  timestamp: string;
}

export interface EcoMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  loggedBy: string;
  timestamp: string;
}
