import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Train } from 'lucide-react';

const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (source && destination) {
      navigate(`/trains?source=${source}&destination=${destination}&date=${date}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-3 sm:px-4">
      <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12">
        <h1 className="text-3xl xs:text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Travel with Ease, <span className="text-primary-600">RailConnect</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium px-2">
          Book your train tickets instantly and enjoy seamless onboard WiFi services with our modern booking system.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 p-5 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400 px-1">
              <MapPin size={14} className="text-primary-600" /> Source
            </label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-sm sm:text-base"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400 px-1">
              <MapPin size={14} className="text-primary-600" /> Destination
            </label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-sm sm:text-base"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400 px-1">
              <Calendar size={14} className="text-primary-600" /> Date
            </label>
            <input
              type="date"
              className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-sm sm:text-base appearance-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 sm:h-14 bg-primary-600 text-white rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary-700 transform transition-all active:scale-95 shadow-xl shadow-primary-500/30 text-sm sm:text-base"
          >
            <Search size={20} /> Search Trains
          </button>
        </form>
      </div>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
        {[
          { icon: <Train size={28} className="sm:w-8 sm:h-8" />, title: "Wide Network", desc: "Access thousands of train routes across the country." },
          { icon: <div className="px-2 py-1 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary-600 dark:text-primary-400 font-black text-xs sm:text-sm">WiFi</div>, title: "Onboard WiFi", desc: "Stay connected throughout your journey with our high-speed WiFi." },
          { icon: <Search size={28} className="sm:w-8 sm:h-8" />, title: "Instant Booking", desc: "Secure your tickets in seconds with our user-friendly interface." }
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-3 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-lg">
            <div className="text-primary-600 dark:text-primary-400 mb-2">
              {feature.icon}
            </div>
            <h3 className="font-black text-lg sm:text-xl">{feature.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
