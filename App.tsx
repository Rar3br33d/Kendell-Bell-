
import React, { useState, useEffect } from 'react';
import { ZODIAC_SIGNS } from './constants';
import { ZodiacSign, LuckPrediction } from './types';
import { getZodiacLuck, generateInitialCharm, editCharmImage } from './services/geminiService';
import ZodiacCard from './components/ZodiacCard';
import NumberBall from './components/NumberBall';
import SubscriptionModal from './components/SubscriptionModal';

const App: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [prediction, setPrediction] = useState<LuckPrediction | null>(null);
  const [charmImage, setCharmImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Subscription state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('zodiac_subscribed') === 'true';
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState(() => {
    return localStorage.getItem('zodiac_plan') || 'none';
  });

  const fetchPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);
    try {
      const [luckData, imageBase64] = await Promise.all([
        getZodiacLuck(sign.name),
        generateInitialCharm(sign.name)
      ]);
      setPrediction(luckData);
      setCharmImage(imageBase64);
    } catch (err) {
      console.error(err);
      setError("Celestial bodies are misaligned. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSign = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    fetchPrediction(sign);
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charmImage || !editPrompt) return;
    
    setIsEditing(true);
    setError(null);
    try {
      const newImage = await editCharmImage(charmImage, editPrompt);
      setCharmImage(newImage);
      setEditPrompt('');
    } catch (err) {
      console.error(err);
      setError("The magic failed. Try a different request.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleShare = async () => {
    if (!prediction || !selectedSign) return;
    
    const shareText = `✨ My Zodiac Luck for ${selectedSign.name} ✨\n\n` +
      `Lucky Numbers: ${prediction.numbers.join(', ')}\n` +
      `Daily Message: ${prediction.horoscope}\n\n` +
      `Chant for today: "${prediction.chantingSpell}"\n\n` +
      `Check yours at Zodiac Luck & Magic!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Zodiac Luck',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Luck copied to clipboard!');
    }
  };

  const handleSubscribe = (email: string, plan: 'free' | 'pro') => {
    setIsSubscribed(true);
    setSubscriptionPlan(plan);
    localStorage.setItem('zodiac_subscribed', 'true');
    localStorage.setItem('zodiac_email', email);
    localStorage.setItem('zodiac_plan', plan);
  };

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to sever your cosmic link? You will lose Pro insights.")) {
      setIsSubscribed(false);
      setSubscriptionPlan('none');
      localStorage.removeItem('zodiac_subscribed');
      localStorage.removeItem('zodiac_plan');
      localStorage.removeItem('zodiac_email');
    }
  };

  const reset = () => {
    setSelectedSign(null);
    setPrediction(null);
    setCharmImage(null);
    setError(null);
  };

  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-8xl font-serif text-amber-400 mb-4 italic tracking-tighter">Zodiac Luck</h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-amber-400/30"></div>
          <p className="text-amber-200/60 uppercase tracking-[0.3em] text-xs font-bold">Celestial Readings & Charms</p>
          <div className="h-px w-12 bg-amber-400/30"></div>
        </div>
      </header>

      {!selectedSign ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ZODIAC_SIGNS.map(sign => (
            <ZodiacCard
              key={sign.id}
              sign={sign}
              isSelected={false}
              onSelect={handleSelectSign}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group self-start md:self-center"
            >
              <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              Choose another sign
            </button>
            {!isLoading && (
              <div className="flex gap-3">
                {isSubscribed ? (
                   <button 
                    onClick={handleCancelSubscription}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white px-5 py-2.5 rounded-full transition-all text-xs font-bold"
                  >
                    <i className="fas fa-cog"></i>
                    Manage Billing
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsSubModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2.5 rounded-full transition-all text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
                  >
                    <i className="fas fa-paper-plane"></i>
                    Daily Email Predictions
                  </button>
                )}
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 px-5 py-2.5 rounded-full transition-all text-sm font-bold"
                >
                  <i className="fas fa-share-nodes"></i>
                  Share Reading
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-amber-400/20 rounded-full"></div>
                <div className="absolute top-0 w-24 h-24 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-8 text-amber-400 font-medium animate-pulse uppercase tracking-widest text-sm">Consulting the star charts for {selectedSign.name}...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Side: Main Reading */}
              <div className="lg:col-span-8 space-y-8">
                <div className="mystic-card p-8 md:p-12 glow-gold relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 text-[12rem] opacity-[0.03] select-none pointer-events-none">
                    {selectedSign.icon}
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
                    <span className="text-8xl">{selectedSign.icon}</span>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">{selectedSign.name}</h2>
                      <p className="text-amber-400/80 font-serif italic text-xl">{selectedSign.dateRange} • {selectedSign.element} Essence</p>
                      <p className="text-slate-500 mt-2 uppercase tracking-widest text-xs font-bold">Daily Reading for {dayOfWeek}</p>
                    </div>
                  </div>

                  {prediction && (
                    <div className="space-y-12">
                      {/* Numbers */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-amber-400 uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-2">
                            <i className="fas fa-sparkles"></i>
                            6 Lucky Numbers of Destiny
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4 md:gap-6">
                          {prediction.numbers.map((num, i) => (
                            <NumberBall key={`${num}-${i}`} num={num} delay={i * 0.1} />
                          ))}
                        </div>
                      </div>

                      {/* Detailed Horoscope */}
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <h4 className="text-white font-serif italic text-2xl mb-4">"{prediction.horoscope}"</h4>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                              <p className="text-slate-300 leading-relaxed text-lg italic">
                                {prediction.detailedHoroscope}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-amber-400 text-black p-8 rounded-3xl shadow-2xl relative group">
                            <i className="fas fa-quote-left absolute top-4 left-4 opacity-10 text-4xl"></i>
                            <p className="text-xl font-bold leading-tight relative z-10">
                              {prediction.motivationalMessage}
                            </p>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                          </div>
                        </div>

                        {/* Side Stats */}
                        <div className="space-y-6">
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <h5 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Daily Manifestation</h5>
                            <p className="text-amber-400 font-serif text-xl leading-relaxed italic">
                              {prediction.chantingSpell}
                            </p>
                            <p className="text-[10px] text-slate-600 mt-4 uppercase">Repeat 3 times at dawn</p>
                          </div>

                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <h5 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">I AM Affirmations</h5>
                            <ul className="space-y-3">
                              {prediction.affirmations.map((aff, i) => (
                                <li key={i} className="text-slate-300 text-sm flex gap-2">
                                  <span className="text-amber-400">•</span> {aff}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Characteristics */}
                      <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div>
                          <h5 className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-4">Strong Characteristics</h5>
                          <div className="flex flex-wrap gap-2">
                            {prediction.strongTraits.map((trait, i) => (
                              <span key={i} className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs text-rose-400 uppercase tracking-widest font-bold mb-4">Weak Characteristics</h5>
                          <div className="flex flex-wrap gap-2">
                            {prediction.weakTraits.map((trait, i) => (
                              <span key={i} className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/20">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Charm & Secondary Details */}
              <div className="lg:col-span-4 space-y-8">
                {/* Lucky Charm Image */}
                <div className="mystic-card p-6 glow-gold">
                  <h3 className="text-amber-400 uppercase tracking-widest text-xs font-bold mb-6 flex items-center gap-2">
                    <i className="fas fa-gem"></i>
                    Celestial Charm
                  </h3>
                  {charmImage ? (
                    <div className="space-y-6">
                      <div className="relative group rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-white/10">
                        <img 
                          src={charmImage} 
                          alt="Lucky Charm" 
                          className={`w-full h-full object-cover transition-opacity duration-700 ${isEditing ? 'opacity-30' : 'opacity-100'}`}
                        />
                        {isEditing && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-amber-400 text-xs uppercase tracking-widest">Altering Reality...</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                          <i className="fas fa-wand-magic-sparkles text-amber-400"></i>
                          Refine Your Magic
                        </h4>
                        <form onSubmit={handleEditImage} className="space-y-3">
                          <input
                            type="text"
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="e.g. Add a cosmic halo..."
                            disabled={isEditing || !charmImage}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm disabled:opacity-50 text-white"
                          />
                          <button
                            type="submit"
                            disabled={isEditing || !editPrompt || !charmImage}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-black font-bold px-6 py-3 rounded-xl transition-all text-sm uppercase tracking-widest"
                          >
                            {isEditing ? 'Casting Spell...' : 'Evolve Charm'}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-slate-900 rounded-2xl animate-pulse"></div>
                  )}
                </div>

                {/* Subscription CTA if not subscribed */}
                {!isSubscribed && (
                  <div className="mystic-card p-6 bg-gradient-to-br from-amber-400/10 to-transparent border-amber-400/20">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-amber-400/10 p-3 rounded-xl">
                        <i className="fas fa-star text-amber-400"></i>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Daily Destiny Awaits</h4>
                        <p className="text-xs text-slate-400 mt-1">Don't miss a single alignment. Join 10k+ seekers.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsSubModalOpen(true)}
                      className="w-full bg-amber-400 text-black font-bold py-3 rounded-xl text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Subscribe for $9.99/mo
                    </button>
                  </div>
                )}

                {/* Color & Time Card */}
                {prediction && (
                  <div className="mystic-card p-6 space-y-6">
                    <div>
                      <h5 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Aura Colors</h5>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                          <div className="w-8 h-8 rounded-full border border-white/10" style={{ backgroundColor: prediction.powerColor.toLowerCase() }}></div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Primary Power</span>
                            <span className="text-white font-medium">{prediction.powerColor}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prediction.favoriteColors.map((color, i) => (
                            <span key={i} className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <h5 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Hour of Luck</h5>
                      <div className="flex items-center gap-3 bg-amber-400/5 p-4 rounded-2xl border border-amber-400/10">
                        <i className="far fa-clock text-amber-400 text-xl"></i>
                        <span className="text-amber-400 font-serif text-2xl italic">{prediction.luckyTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals & Popups */}
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
        onSubscribe={handleSubscribe}
        zodiacName={selectedSign?.name || ''}
      />

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
          <i className="fas fa-exclamation-triangle"></i>
          <span className="font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {isSubscribed && (
        <div className="fixed bottom-8 right-8 bg-amber-400 text-black px-6 py-3 rounded-full shadow-2xl font-bold text-sm animate-in slide-in-from-right-4 z-40">
          <i className="fas fa-crown mr-2"></i>
          {subscriptionPlan === 'pro' ? 'Mystic Pro Member' : 'Mystic Seeker'}
        </div>
      )}

      <footer className="mt-32 text-center pb-12">
        <div className="flex justify-center gap-6 mb-8 text-slate-600 text-xl">
          <i className="fab fa-instagram hover:text-amber-400 transition-colors cursor-pointer"></i>
          <i className="fab fa-twitter hover:text-amber-400 transition-colors cursor-pointer"></i>
          <i className="fab fa-facebook-p hover:text-amber-400 transition-colors cursor-pointer"></i>
        </div>
        <div className="h-px w-24 bg-white/5 mx-auto mb-8"></div>
        <p className="text-slate-600 text-xs uppercase tracking-[0.4em] font-bold">
          &copy; {new Date().getFullYear()} Zodiac Luck & Magic • Guided by Gemini
        </p>
      </footer>
    </div>
  );
};

export default App;
