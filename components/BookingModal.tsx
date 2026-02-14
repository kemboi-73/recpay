
import React, { useState } from 'react';
import { Service, Booking } from '../types';
import { initiatePayment } from '../services/payhero';

interface BookingModalProps {
  service: Service;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsProcessing(true);
    setError('');

    try {
      const ref = `REC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const response = await initiatePayment(service.price, phone, ref);

      if (response.success) {
        const newBooking: Booking = {
          id: ref,
          serviceId: service.id,
          serviceName: service.name,
          amount: service.price,
          date: date,
          time: time,
          status: 'Pending',
          paymentReference: ref,
          checkoutId: response.checkout_id, // Important for polling!
          qrCode: `QR-${ref}`,
          userPhone: phone
        };
        onSuccess(newBooking);
      } else {
        setError(response.message);
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Connection failed. Please check credentials.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="gradient-bg p-8 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 className="text-2xl font-bold mb-1">Confirm Booking</h2>
          <p className="text-white/80">{service.name}</p>
        </div>
        
        <form onSubmit={handlePay} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">M-Pesa Phone Number</label>
            <div className="flex items-center">
              <span className="bg-gray-50 border border-r-0 border-gray-200 px-4 py-3 rounded-l-xl text-gray-500 font-medium">+254</span>
              <input type="tel" placeholder="712345678" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl flex justify-between items-center">
            <span className="text-indigo-900 font-medium">Total Amount</span>
            <span className="text-xl font-bold text-indigo-600">Ksh {service.price.toLocaleString()}</span>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <button type="submit" disabled={isProcessing} className="w-full gradient-bg text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition transform active:scale-95 disabled:opacity-70">
            {isProcessing ? 'Initiating STK Push...' : 'Pay with M-Pesa'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
