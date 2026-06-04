export interface OrderData {
  id: string;
  status: 'Completed' | 'Pending' | 'Shipped' | 'Processing';
  amount: number;
  date: string;
  client: string;
}

export interface ActivityData {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}
