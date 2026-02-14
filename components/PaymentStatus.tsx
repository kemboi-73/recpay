
import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { checkPaymentStatus, searchByTransactionCode } from '../services/payhero';

interface PaymentStatusProps {
  booking: Booking;
  onConfirm: (transactionCode?: string) => void;
  onCancel: () => void;
  onFail: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ booking, onConfirm, onCancel, onFail }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [transactionCode, setTransactionCode] = useState<string | undefined>(undefined);
  const [manualCode, setManualCode] = useState('');
  const [isVerifyingManual, setIsVerifyingManual] = useState(false);
  const [manualError, setManualError] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    let interval: number;

    const pollStatus = async () => {
      setAttempts(prev => prev + 1);
      try {
        const result = await checkPaymentStatus(booking.paymentReference, booking.checkoutId);
        const s = result.status.toLowerCase();
        
        if (s === 'success' || s === 'confirmed' || s === 'complete' || s === 'successful') {
          setTransactionCode(result.transactionCode);
          setStep(3);
          clearInterval(interval);
        } else if (s === 'failed' || s === 'cancelled' || s === 'canceled' || s === 'rejected') {
          setError(s.includes('cancel') ? 'Transaction was cancelled.' : 'Transaction failed.');
          clearInterval(interval);
        }
      } catch (err) {
        console.warn("Poll Error:", err);
      }
    };

    const timer = setTimeout(() => {
      setStep(2);
      interval = window.setInterval(pollStatus, 3000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [booking.paymentReference, booking.checkoutId]);

  const handleManualVerify = async () => {
    if (!manualCode.trim()) return;
    setIsVerifyingManual(true);
    setManualError('');
    
    try {
      const result = await searchByTransactionCode(manualCode);
      if (result) {
        setTransactionCode(result.transactionCode || manualCode);
        setStep(3);
      } else {
        // Fallback for hackathon: if manual query fails but user is persistent,
        // let them proceed after a warning for demo purposes.
        setManualError("Transaction not found yet. Ensure the code is correct.");
        setTimeout(() => setManualError(""), 3000);
      }
    } catch (err) {
      setManualError("Verification service unavailable.");
    } finally {
      setIsVerifyingManual(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/95 backdrop-blur-xl"></div>
      
      <div className="relative bg-white w-full max-w-md rounded-3xl p-10 text-center shadow-2xl animate-scale-in border border-indigo-100">
        {error ? (
          <div className="animate-fade-in">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment {error.includes('cancelled') ? 'Cancelled' : 'Failed'}</h2>
            <p className="text-gray-500 mb-8">{error}</p>
            <div className="space-y-3">
              <button onClick={onCancel} className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition">Return to Home</button>
              <button onClick={onFail} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">Try Again</button>
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="animate-pulse">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Requesting Payment</h2>
                <p className="text-gray-500">Checking for STK Push on <span className="font-bold text-indigo-600">+254{booking.userPhone}</span>...</p>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                 {!showManualInput ? (
                   <>
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                      <svg className="w-12 h-12 text-yellow-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <div className="absolute -top-1 -right-1 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">{attempts}</div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Confirming PIN</h2>
                    <p className="text-gray-500 px-4 mb-8 text-sm leading-relaxed">Please enter your M-Pesa PIN on your phone. We are waiting for the network confirmation.</p>
                    
                    <div className="space-y-4">
                      {attempts > 2 && (
                        <button 
                          onClick={() => setShowManualInput(true)} 
                          className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-bold text-sm border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition"
                        >
                          I have the M-Pesa Code (Enter Manually)
                        </button>
                      )}
                      
                      <button onClick={onCancel} className="text-xs font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-widest block w-full">Cancel Booking</button>
                    </div>
                   </>
                 ) : (
                   <div className="animate-scale-in">
                      <h2 className="text-xl font-black text-gray-900 mb-2">Manual Verification</h2>
                      <p className="text-gray-500 text-xs mb-6">Enter the M-Pesa Transaction Code from your SMS (e.g. RG12345678)</p>
                      
                      <div className="space-y-4 mb-8">
                        <input 
                          type="text" 
                          placeholder="M-Pesa Code" 
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 outline-none text-center font-mono text-lg font-bold uppercase tracking-widest transition"
                        />
                        
                        {manualError && (
                          <p className="text-red-500 text-[10px] font-bold uppercase animate-bounce">{manualError}</p>
                        )}

                        <button 
                          onClick={handleManualVerify}
                          disabled={isVerifyingManual || manualCode.length < 5}
                          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          {isVerifyingManual ? 'Verifying Code...' : 'Verify Manual Payment'}
                        </button>
                        
                        {/* Demo bypass: If the user is stuck, let them forced confirm after 2 tries */}
                        {attempts > 5 && (
                          <button 
                            onClick={() => onConfirm('MP-DEMO-' + Date.now())}
                            className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter hover:text-indigo-600"
                          >
                            Skip Verification (Demo Mode)
                          </button>
                        )}
                      </div>

                      <button onClick={() => setShowManualInput(false)} className="text-xs font-bold text-indigo-400 hover:underline uppercase tracking-widest">Back to Automatic Polling</button>
                   </div>
                 )}
              </div>
            )}

            {step === 3 && (
              <div className="animate-scale-in">
                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-black text-green-600 mb-2">SUCCESSFUL!</h2>
                <p className="text-gray-600 mb-6 font-medium">Payment for <span className="font-bold text-gray-900">{booking.serviceName}</span> confirmed.</p>
                
                {transactionCode && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block w-full">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">M-Pesa Reference</p>
                    <p className="text-xl font-mono font-bold text-indigo-600 tracking-wider">{transactionCode}</p>
                  </div>
                )}

                <button 
                  onClick={() => onConfirm(transactionCode)} 
                  className="w-full gradient-bg text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                >
                  View Digital Receipt
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
