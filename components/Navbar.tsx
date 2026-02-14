
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xl italic">R</div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">RecPay</span>
        </div>
        
        <div className="flex gap-4 md:gap-8">
          <button 
            onClick={() => setView(ViewState.HOME)}
            className={`font-medium transition ${currentView === ViewState.HOME ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView(ViewState.HISTORY)}
            className={`font-medium transition ${currentView === ViewState.HISTORY ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            My Activity
          </button>
          <button 
            onClick={() => setView(ViewState.ADMIN)}
            className={`px-4 py-2 rounded-lg font-medium transition ${currentView === ViewState.ADMIN ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
