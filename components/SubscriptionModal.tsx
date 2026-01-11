
import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string, plan: 'free' | 'pro') => void;
  zodiacName: string;
}

type ModalStep = 'info' | 'payment' | 'success';

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe, zodiacName }) => {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro'>('pro');
  const [step, setStep] = useState<ModalStep>('info');

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    if (plan === 'pro') {
      setStep('payment');
    } else {
      processSuccess();
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this is where you'd call Stripe or Google Play Billing
    processSuccess();
  };

  const processSuccess = () => {
    setStep('success');
    setTimeout(() => {
      onSubscribe(email, plan);
      onClose();
      // Reset for next time
      setStep('info');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="mystic-card w-full max-w-lg p-8 relative overflow-hidden glow-gold border-amber-400/30">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
        >
          <i className="fas fa-times"></i>
        </button>

        {step === 'info' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
                <i className="fas fa-envelope-open-text text-amber-400 text-2xl"></i>
              </div>
              <h2 className="text-3xl font-serif italic text-white mb-2">Celestial Delivery</h2>
              <p className="text-slate-400">Join the elite circle of {zodiacName} seekers.</p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Your Sacred Email</label>
                <input
                  type="email"
                  required
                  placeholder="oracle@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPlan('free')}
                  className={`p-4 rounded-2xl border transition-all text-left group ${
                    plan === 'free' ? 'border-amber-400 bg-amber-400/10' : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="block font-bold text-white group-hover:text-amber-400">Free</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Daily Brief</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan('pro')}
                  className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                    plan === 'pro' ? 'border-amber-400 bg-amber-400/10' : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-amber-400 text-black text-[7px] px-2 py-0.5 font-bold uppercase tracking-tighter">Gold</div>
                  <span className="block font-bold text-white group-hover:text-amber-400">Pro</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tighter">$9.99/mo</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest text-sm"
              >
                {plan === 'pro' ? 'Secure My Reading' : 'Subscribe Free'}
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-serif italic text-white mb-2">Secure Offering</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Plan: Mystic Pro • $9.99 Monthly</p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Service Fee</span>
                <span className="text-white">$9.99</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Celestial Tax</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-amber-400 uppercase tracking-widest text-xs">Total Offering</span>
                <span className="text-white text-xl">$9.99</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                <i className="fas fa-credit-card text-slate-400"></i>
                <span className="text-sm text-slate-500 italic">Simulated Secure Payment Provider...</span>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-sm"
              >
                Confirm Offering
              </button>
              <button 
                type="button" 
                onClick={() => setStep('info')}
                className="w-full text-slate-500 hover:text-white text-xs uppercase tracking-widest transition-colors"
              >
                Back to details
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/40 relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/10"></div>
              <i className="fas fa-check text-emerald-400 text-4xl relative z-10"></i>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Destiny Linked</h3>
            <p className="text-slate-400 max-w-xs mx-auto">Your offering has been accepted. The celestial scrolls will be delivered daily.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
