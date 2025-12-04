import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F5] text-[#1a1a1a] text-sm pt-12 pb-8 px-6 mt-auto border-t border-gray-200 font-sans">
        <div className="max-w-7xl mx-auto">
            
            {/* Main Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                
                {/* Support */}
                <div className="space-y-3">
                    <h3 className="font-medium text-base">Support</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Manage your trips</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Contact Customer Service</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Safety Resource Center</a></li>
                    </ul>
                </div>

                {/* Discover */}
                <div className="space-y-3">
                    <h3 className="font-medium text-base">Discover</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Genius loyalty program</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Seasonal and holiday deals</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Travel articles</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Medifly for Business</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Traveller Review Awards</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Car rental</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Flight finder</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Restaurant reservations</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Medifly for Travel Agents</a></li>
                    </ul>
                </div>

                {/* Terms and settings */}
                <div className="space-y-3">
                    <h3 className="font-medium text-base">Terms and settings</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Privacy Notice</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Accessibility Statement</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Partner dispute</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Modern Slavery Statement</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Human Rights Statement</a></li>
                    </ul>
                </div>

                {/* Partners */}
                <div className="space-y-3">
                    <h3 className="font-medium text-base">Partners</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Extranet login</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Partner help</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">List your property</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Become an affiliate</a></li>
                    </ul>
                </div>

                {/* About */}
                <div className="space-y-3">
                    <h3 className="font-medium text-base">About</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">About Medifly</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">How We Work</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Sustainability</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Press center</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Investor relations</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Corporate contact</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600 transition-colors">Content guidelines</a></li>
                    </ul>
                </div>
            </div>

            {/* Currency Selector */}
            <div className="mb-10">
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 transition-colors text-slate-700">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg" 
                        alt="IDR" 
                        className="w-5 h-5 rounded-full object-cover border border-gray-300 shadow-sm" 
                    />
                    <span className="font-medium text-base">IDR</span>
                </button>
            </div>

            {/* Footer Note & Logos */}
            <div className="text-center pt-8 border-t border-gray-200/80">
                <p className="text-xs text-gray-500 mb-2">
                    Medifly is part of Medifly Holdings Inc., the world leader in online travel and related services.
                </p>
                <p className="text-xs text-gray-500 mb-8">
                    Copyright © 2025 Medifly.com™. All rights reserved.
                </p>
                
                {/* Partner Logos (Styled Text Representations) */}
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="font-medium text-xl text-[#003580] tracking-tight">Booking.com</span>
                    <span className="font-medium text-xl text-[#0068EF] tracking-tight">priceline</span>
                    <span className="font-extrabold text-xl text-[#FF690F] tracking-tight">KAYAK</span>
                    <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                            <div className="w-2 h-2 rounded-full bg-[#33BA9B]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#99539D]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#E5AA30]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#D64644]"></div>
                        </div>
                        <span className="font-medium text-xl text-slate-800 tracking-tight">agoda</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-[#DA3743]"></div>
                        <span className="font-medium text-xl text-slate-800 tracking-tight">OpenTable</span>
                    </div>
                </div>
            </div>

        </div>
    </footer>
  );
};