
export interface Service {
  id: string;
  name: string;
  category: 'Sports' | 'Fitness' | 'Wellness' | 'Equipment';
  price: number;
  duration: string;
  image: string;
  description: string;
  available: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Failed' | 'Cancelled';
  paymentReference: string;
  checkoutId?: string; 
  transactionCode?: string; // M-Pesa Transaction Code
  qrCode: string;
  userPhone: string;
}

export interface PayHeroResponse {
  success: boolean;
  status: string;
  reference: string;
  checkout_id?: string;
  message: string;
}

export enum ViewState {
  HOME = 'HOME',
  BOOKING = 'BOOKING',
  ADMIN = 'ADMIN',
  HISTORY = 'HISTORY'
}
