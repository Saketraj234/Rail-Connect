import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Train, Clock, IndianRupee, MapPin, ChevronRight, Search } from 'lucide-react';

const TrainList = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const quota = searchParams.get('quota') || 'GENERAL';

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/trains?source=${source}&destination=${destination}`);
        setTrains(data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      } finally {
        setLoading(false);
      }
    };

    if (source && destination) {
      fetchTrains();
    }
  }, [source, destination]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600" />
        <p className="text-slate-500 font-medium">Searching for available trains...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-6">
          <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl text-primary-600 dark:text-primary-400">
            <Train size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {source} <ChevronRight size={20} className="text-slate-400" /> {destination}
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-slate-500 dark:text-slate-400 font-medium">{date || 'Any Date'}</p>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="px-3 py-1 bg-primary-600/10 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary-600/20 shadow-sm">
                Quota: {quota}
              </span>
            </div>
          </div>
        </div>
        <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-bold">
          <Search size={20} /> Modify Search
        </Link>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Available Trains <span className="text-sm font-medium text-slate-400">({trains.length})</span>
        </h3>

        {trains.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-dashed border-slate-300 dark:border-slate-600">
            <div className="mb-4 inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400">
              <Train size={40} />
            </div>
            <h3 className="text-xl font-bold">No trains found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try searching with different source or destination.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {trains.map((train) => (
              <div
                key={train._id}
                className="group p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 transition-all transform hover:-translate-y-1 flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{train.name}</h3>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">#{train.trainNumber}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-black">{train.timing}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Departure</p>
                      </div>
                    </div>
                  </div>

                  {/* Class Selection UI */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {train.classes && train.classes.map((cls) => {
                      // Status Logic based on travel date and quota
                      const getStatus = (baseSeats) => {
                        const travelDateObj = new Date(date);
                        const today = new Date();
                        const diffTime = travelDateObj - today;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        // Quota based seat calculation
                        let availableSeats = baseSeats;
                        let statusType = 'AVL';

                        if (quota === 'TATKAL' || quota === 'PREMIUM TATKAL') {
                          // Tatkal has very few seats
                          availableSeats = Math.floor(baseSeats * 0.15); // Only 15% seats for Tatkal
                        } else if (quota === 'SENIOR CITIZEN' || quota === 'LADIES') {
                          availableSeats = Math.floor(baseSeats * 0.1); // Only 10% seats for Senior/Ladies
                        }

                        if (diffDays <= 5 && diffDays >= 0) {
                          // Close to travel date
                          const randomVal = Math.random();
                          if (randomVal > 0.7) return { type: 'WL', val: Math.floor(Math.random() * 50) + 1 };
                          if (randomVal > 0.4) return { type: 'RAC', val: Math.floor(Math.random() * 20) + 1 };
                        }

                        // For Tatkal/Premium Tatkal, show "CURR_AVL" or "WL" more realistically
                        // Tatkal window: Today, Tomorrow, and Day After Tomorrow (2 days advance)
                        if ((quota === 'TATKAL' || quota === 'PREMIUM TATKAL') && diffDays > 2) {
                          return { type: 'NOT_OPEN', val: 0 };
                        }

                        return { type: 'AVL', val: Math.max(1, availableSeats) };
                      };

                      const status = getStatus(cls.seats);
                      
                      // Quota based price calculation
                      const getPrice = (basePrice, className) => {
                        if (quota === 'TATKAL' || quota === 'PREMIUM TATKAL') {
                          // Add specific Tatkal charges: 150 for SL, 300 for AC classes
                          const tatkalCharge = className === 'SL' ? 150 : 300;
                          const multiplier = quota === 'PREMIUM TATKAL' ? 2 : 1.3; // Premium is even more expensive
                          return Math.floor(basePrice * multiplier) + tatkalCharge;
                        }
                        if (quota === 'SENIOR CITIZEN') return Math.floor(basePrice * 0.6); // 40% discount
                        return basePrice;
                      };

                      const finalPrice = getPrice(cls.price, cls.className);

                      return (
                        <div 
                          key={cls._id}
                          onClick={() => {
                            if (status.type === 'NOT_OPEN') return;
                            navigate(`/booking/${train._id}?class=${cls.className}&date=${date}&quota=${quota}`);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all text-center space-y-2 relative overflow-hidden ${
                            status.type === 'NOT_OPEN' 
                            ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60' 
                            : 'cursor-pointer bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700 hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 group/class'
                          }`}
                        >
                          <div className="absolute top-0 right-0 p-1">
                            {status.type !== 'NOT_OPEN' && <ChevronRight size={14} className="text-slate-300 group-hover/class:text-primary-600 group-hover/class:translate-x-1 transition-all" />}
                          </div>
                          <p className="text-sm font-black text-slate-900 dark:text-white group-hover/class:text-primary-600">{cls.className}</p>
                          <div className="flex items-center justify-center gap-1 text-primary-600">
                            <IndianRupee size={14} />
                            <span className="text-lg font-black tracking-tight">{finalPrice}</span>
                          </div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${
                            status.type === 'AVL' ? 'text-emerald-600' : 
                            status.type === 'RAC' ? 'text-amber-600' : 
                            status.type === 'NOT_OPEN' ? 'text-slate-400' : 'text-red-600'
                          }`}>
                            {status.type === 'NOT_OPEN' ? 'Outside Tatkal Window' : `${status.type} ${status.val}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full md:w-px h-px md:h-16 bg-slate-100 dark:bg-slate-700" />

                <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${train.seats > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{train.seats} Seats Left</span>
                  </div>
                  <button
                    onClick={() => navigate(`/booking/${train._id}?date=${date}`)}
                    className="w-full md:w-auto px-10 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transform transition-all active:scale-95 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                  >
                    Book Now <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainList;
