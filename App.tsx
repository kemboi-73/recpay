
import React, { useState, useEffect } from 'react';
import { ViewState, Service, Booking } from './types';
import { SERVICES } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCard from './components/ServiceCard';
import BookingModal from './components/BookingModal';
import PaymentStatus from './components/PaymentStatus';
import AdminDashboard from './components/AdminDashboard';
import Receipt from './components/Receipt';
import { getServiceRecommendation } from './services/gemini';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mood, setMood] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<{ activity: string; reason: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
  };

  const handleRecommendation = async () => {
    if (!mood.trim()) return;
    setIsAiLoading(true);
    const rec = await getServiceRecommendation(mood);
    setAiRecommendation(rec);
    setIsAiLoading(false);
  };

  const handleCompleteBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    setCurrentBooking(booking);
    setSelectedService(null);
  };

  const handlePaymentResolution = (status: 'Confirmed' | 'Failed' | 'Cancelled', transactionCode?: string) => {
    if (currentBooking) {
      const updated = { ...currentBooking, status, transactionCode };
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      setCurrentBooking(null);
      if (status === 'Confirmed') {
        setCurrentView(ViewState.HISTORY);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar currentView={currentView} setView={setCurrentView} />

      {currentView === ViewState.HOME && (
        <main className="container mx-auto px-4">
          <Hero />
          
          <section className="mt-12 bg-indigo-50 p-8 rounded-3xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">How are you feeling today?</h2>
              <p className="text-indigo-700 mb-6">Let RecPay AI suggest the perfect activity for your mood.</p>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="e.g. Stressed, Energetic, Tired..."
                  className="flex-1 px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  onClick={handleRecommendation}
                  disabled={isAiLoading}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isAiLoading ? 'Thinking...' : 'Recommend'}
                </button>
              </div>
              {aiRecommendation && (
                <div className="mt-6 p-4 bg-white rounded-xl border border-indigo-100 animate-fade-in flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 uppercase text-xs tracking-widest">AI Suggestion</span>
                    <h4 className="text-lg font-bold text-gray-900">{aiRecommendation.activity}</h4>
                    <p className="text-gray-600 mt-1 italic">"{aiRecommendation.reason}"</p>
                  </div>
                  <button 
                    onClick={() => {
                       const found = SERVICES.find(s => s.name.toLowerCase().includes(aiRecommendation.activity.toLowerCase()));
                       if (found) handleBookService(found);
                    }}
                    className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md"
                  >
                    Try it Now
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="mt-16">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-3xl font-bold text-gray-900">Available Activities</h2>
                  <p className="text-gray-500">Pick a session and pay instantly via M-Pesa</p>
               </div>
               <div className="flex gap-2">
                 {['Sports', 'Wellness', 'Fitness'].map(cat => (
                   <span key={cat} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-indigo-400 cursor-pointer transition uppercase tracking-tighter">{cat}</span>
                 ))}
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onBook={() => handleBookService(service)} 
                />
              ))}
            </div>
          </section>
        </main>
      )}

      {currentView === ViewState.ADMIN && (
        <div className="container mx-auto px-4 mt-8">
          <AdminDashboard bookings={bookings} />
        </div>
      )}

      {currentView === ViewState.HISTORY && (
        <div className="container mx-auto px-4 mt-8">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-3xl font-bold text-gray-900">Your Bookings</h2>
             <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold">
               Total Activities: {bookings.filter(b => b.status === 'Confirmed').length}
             </span>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-gray-500 text-lg">No bookings yet. Start your fitness journey!</p>
              <button onClick={() => setCurrentView(ViewState.HOME)} className="mt-4 text-indigo-600 font-bold hover:underline">Explore Activities &rarr;</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-xl transition duration-300 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full ${booking.status === 'Confirmed' ? 'bg-green-500' : booking.status === 'Cancelled' ? 'bg-gray-400' : 'bg-red-500'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{booking.serviceName}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'Cancelled' ? 'bg-gray-100 text-gray-600' : 
                      'bg-red-100 text-red-700'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">📅</span> {booking.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">🕒</span> {booking.time}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-indigo-600">
                      <span>💰</span> Ksh {booking.amount.toLocaleString()}
                    </div>
                    {booking.transactionCode && (
                       <div className="text-[10px] bg-indigo-50 p-1 px-2 rounded-lg font-mono">
                         REF: {booking.transactionCode}
                       </div>
                    )}
                  </div>

                  {booking.status === 'Confirmed' ? (
                    <div className="pt-4 border-t flex flex-col items-center gap-4">
                      <div className="relative">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`} alt="QR Proof" className="w-24 h-24 blur-[1px] group-hover:blur-0 transition duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition">
                           <span className="bg-white/90 px-3 py-1 rounded text-[10px] font-bold border">HOVER TO VIEW</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setReceiptBooking(booking)}
                        className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition shadow-sm border border-indigo-100"
                      >
                        Receipt & Proof
                      </button>
                    </div>
                  ) : booking.status === 'Cancelled' ? (
                     <div className="pt-4 border-t text-center">
                        <p className="text-xs text-gray-400 italic">This booking was cancelled.</p>
                        <button onClick={() => setBookings(prev => prev.filter(b => b.id !== booking.id))} className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-tighter">Remove from history</button>
                     </div>
                  ) : (
                    <div className="pt-4 border-t text-center">
                      <p className="text-red-500 text-xs font-bold mb-2">Payment Failed</p>
                      <button 
                        onClick={() => handleBookService(SERVICES.find(s => s.id === booking.serviceId)!)}
                        className="w-full bg-red-50 text-red-600 py-2 rounded-xl font-bold text-xs"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedService && (
        <BookingModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
          onSuccess={handleCompleteBooking}
        />
      )}

      {currentBooking && currentBooking.status === 'Pending' && (
        <PaymentStatus 
          booking={currentBooking} 
          onConfirm={(code) => handlePaymentResolution('Confirmed', code)}
          onCancel={() => handlePaymentResolution('Cancelled')}
          onFail={() => handlePaymentResolution('Failed')}
        />
      )}

      {receiptBooking && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setReceiptBooking(null)}></div>
          <div className="relative animate-scale-in">
             <Receipt booking={receiptBooking} />
             <button 
              onClick={() => setReceiptBooking(null)}
              className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2 hover:text-indigo-300"
             >
               Close <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
