
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative py-20 rounded-3xl overflow-hidden mt-8">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000" 
          alt="Gym Background" 
          className="w-full h-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Unlock Your <span className="text-indigo-400 italic">Full Potential</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
          The ultimate platform for seamless recreational bookings and instant micro-payments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition transform hover:scale-105 shadow-xl">
            Book a Session
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition shadow-xl">
            Explore Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
