
import React from 'react';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <Activity className="w-6 h-6" />
                <span className="font-semibold tracking-tight">Medifly</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
                <a href="#" className="hover:text-white transition-colors">About Us</a>
                <a href="#" className="hover:text-white transition-colors">Doctors</a>
                <a href="#" className="hover:text-white transition-colors">Hospitals</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>© 2024 Medifly - All rights reserved</span>
                <div className="flex gap-3">
                     <a href="#" className="hover:text-white">Privacy Policy</a>
                     <a href="#" className="hover:text-white">Terms and Condition</a>
                </div>
            </div>
             <button className="px-3 py-1 bg-white text-gray-900 text-[10px] font-bold rounded hover:bg-gray-100">EN-US</button>
        </div>
    </footer>
  );
};
