
import React from 'react';
import { Booking } from '../types';

interface ReceiptProps {
  booking: Booking;
}

const Receipt: React.FC<ReceiptProps> = ({ booking }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto border-2 border-dashed border-gray-200 print:shadow-none print:border-none">
      <div className="text-center mb-6">
        <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white font-bold text-2xl italic mx-auto mb-4">R</div>
        <h1 className="text-2xl font-black text-gray-900 uppercase">Official Receipt</h1>
        <p className="text-gray-500 text-sm">Nairobi Recreation Heights, 5th Floor</p>
      </div>

      <div className="space-y-4 py-6 border-y border-dashed border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">RecPay Reference:</span>
          <span className="text-gray-900 font-bold">#{booking.id}</span>
        </div>
        {booking.transactionCode && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">M-Pesa Reference:</span>
            <span className="text-indigo-600 font-black tracking-wider uppercase">{booking.transactionCode}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Date/Time:</span>
          <span className="text-gray-900 font-bold">{booking.date} @ {booking.time}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Customer:</span>
          <span className="text-gray-900 font-bold">+254{booking.userPhone}</span>
        </div>
      </div>

      <div className="py-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-bold">{booking.serviceName}</span>
          <span className="text-gray-900 font-bold">Ksh {booking.amount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-400">1 x Session Reservation Fee</p>
      </div>

      <div className="pt-6 border-t border-dashed border-gray-300">
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-bold text-gray-900 uppercase">Paid Total</span>
          <span className="text-2xl font-black text-green-600">Ksh {booking.amount.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`} 
            alt="Access QR" 
            className="w-32 h-32 mb-4 border p-2 rounded-lg" 
          />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Valid Entry Pass • Scan at Door</p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
        Thank you for choosing RecPay! Powered by PayHero API.
      </div>

      <div className="mt-8 flex gap-3 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print/Download
        </button>
      </div>
    </div>
  );
};

export default Receipt;
