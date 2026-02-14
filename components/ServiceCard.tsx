
import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onBook: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border hover:shadow-2xl transition duration-500 transform hover:-translate-y-2">
      <div className="h-56 relative overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-indigo-600 shadow-sm">
          Ksh {service.price.toLocaleString()}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
           <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {service.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">{service.name}</h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2">{service.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-xs font-medium">{service.duration}</span>
          </div>
          <button 
            onClick={onBook}
            className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition shadow-sm"
          >
            Pay & Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
