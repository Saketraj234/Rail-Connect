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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl w-full text-center space-y-8 mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Travel with Ease, <span className="text-primary-600">RailConnect</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Book your train tickets instantly and enjoy seamless onboard WiFi services with our modern booking system.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin size={16} className="text-primary-600" /> Source
            </label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin size={16} className="text-primary-600" /> Destination
            </label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar size={16} className="text-primary-600" /> Date
            </label>
            <input
              type="date"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transform transition-all active:scale-95 shadow-lg shadow-primary-500/30"
          >
            <Search size={20} /> Search Trains
          </button>
        </form>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        {[
          { icon: <Train size={32} />, title: "Wide Network", desc: "Access thousands of train routes across the country." },
          { icon: <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary-600 dark:text-primary-400">WiFi</div>, title: "Onboard WiFi", desc: "Stay connected throughout your journey with our high-speed WiFi." },
          { icon: <Search size={32} />, title: "Instant Booking", desc: "Secure your tickets in seconds with our user-friendly interface." }
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-700">
            <div className="text-primary-600 dark:text-primary-400 mb-2">
              {feature.icon}
            </div>
            <h3 className="font-bold text-lg">{feature.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
