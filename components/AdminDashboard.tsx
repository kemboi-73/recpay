
import React from 'react';
import { Booking } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  bookings: Booking[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings }) => {
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.amount, 0);
  const confirmedCount = confirmedBookings.length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
  
  const categoryData = [
    { name: 'Sports', value: confirmedBookings.filter(b => b.serviceName.includes('Court') || b.serviceName.includes('Squash')).length },
    { name: 'Fitness', value: confirmedBookings.filter(b => b.serviceName.includes('Gym') || b.serviceName.includes('Yoga')).length },
    { name: 'Wellness', value: confirmedBookings.filter(b => b.serviceName.includes('Sauna') || b.serviceName.includes('Swimming')).length },
  ];

  const COLORS = ['#4f46e5', '#7c3aed', '#ec4899'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Staff Dashboard</h2>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm text-gray-500">
          Sync Status: <span className="text-green-600 font-bold">Live</span> • {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-indigo-600">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-indigo-600">Ksh {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-gray-900">{confirmedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-red-400">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Cancellations</p>
          <p className="text-3xl font-bold text-red-500">{cancelledCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-pink-500">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Utilization</p>
          <p className="text-3xl font-bold text-gray-900">{confirmedCount > 0 ? '78%' : '0%'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Booking Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
            <button className="text-xs text-indigo-600 font-bold uppercase tracking-wider hover:underline">Export CSV</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
                 <p className="text-gray-400 italic text-sm">Waiting for transactions...</p>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-500' : booking.status === 'Cancelled' ? 'bg-gray-400' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{booking.serviceName}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{booking.userPhone} • {booking.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">Ksh {booking.amount.toLocaleString()}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'Cancelled' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
