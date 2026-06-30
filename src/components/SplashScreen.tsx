import React, { useState, useEffect } from 'react';
import { LogIn, BarChart3, Settings } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo - in production use proper auth
    if (adminPassword === 'admin123') {
      window.location.href = '/admin';
    } else {
      setAdminError('Invalid password');
      setTimeout(() => setAdminError(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0F0F0F] to-[#1C1C1C] flex items-center justify-center z-50">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 animate-pulse">
            <div className="inline-block">
              <div className="text-5xl font-bold bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] bg-clip-text text-transparent">
                🏷️
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Market Hub
          </h1>
          <p className="text-[#FF2D8D] text-xl font-bold mb-8">Malawi</p>

          {/* Loading Animation */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-[#FF2D8D] animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#FF6FAE] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#FF2D8D] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <p className="text-[#B5B5B5] text-sm">Your Local Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0F0F0F] to-[#1C1C1C] flex items-center justify-center z-50 overflow-hidden">
      <div className="w-full max-w-md mx-4">
        {/* Welcome Section */}
        {!showAdmin ? (
          <div className="text-center space-y-8">
            {/* Logo & Brand */}
            <div>
              <div className="text-6xl mb-4">🏷️</div>
              <h1 className="text-4xl font-black text-white mb-2">Market Hub Malawi</h1>
              <p className="text-[#B5B5B5] text-sm">Buy & Sell Local • Fast • Secure • Trusted</p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-[#1C1C1C] rounded-lg border border-[#FF2D8D]/20">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-xs text-[#B5B5B5]">Thousands of Listings</p>
              </div>
              <div className="p-4 bg-[#1C1C1C] rounded-lg border border-[#FF2D8D]/20">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-xs text-[#B5B5B5]">Verified Sellers</p>
              </div>
              <div className="p-4 bg-[#1C1C1C] rounded-lg border border-[#FF2D8D]/20">
                <div className="text-2xl mb-2">🇲🇼</div>
                <p className="text-xs text-[#B5B5B5]">Malawi Wide</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#FF2D8D]/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Start Shopping
              </button>
              <button
                onClick={() => setShowAdmin(true)}
                className="w-full bg-[#1C1C1C] text-[#B5B5B5] font-semibold py-3 px-4 rounded-lg border border-[#FF2D8D]/30 hover:border-[#FF2D8D] hover:text-[#FF2D8D] transition-colors flex items-center justify-center gap-2"
              >
                <BarChart3 size={20} />
                Admin Dashboard
              </button>
            </div>

            <p className="text-xs text-[#B5B5B5]">No login required • Guest checkout available</p>
          </div>
        ) : (
          /* Admin Login */
          <div className="text-center space-y-6">
            <div>
              <Settings className="text-[#FF2D8D] mx-auto mb-4" size={40} />
              <h2 className="text-2xl font-bold text-white">Admin Access</h2>
              <p className="text-[#B5B5B5] text-sm mt-2">Manage your marketplace</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAdminError('');
                  }}
                  className="w-full bg-[#1C1C1C] border border-[#FF2D8D]/30 rounded-lg px-4 py-3 text-white placeholder-[#B5B5B5] focus:outline-none focus:border-[#FF2D8D]"
                />
              </div>

              {adminError && (
                <p className="text-[#FF2D8D] text-sm">{adminError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FF2D8D]/50 transition-all"
              >
                Access Dashboard
              </button>
            </form>

            <button
              onClick={() => {
                setShowAdmin(false);
                setAdminPassword('');
                setAdminError('');
              }}
              className="w-full text-[#B5B5B5] hover:text-[#FF2D8D] transition-colors font-semibold py-2"
            >
              Back to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
