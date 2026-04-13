import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Train, Wifi, IndianRupee, MapPin, Calendar, Clock, User, Download, Share2, LayoutDashboard, Printer, Key, Radio, Signal, SignalLow, SignalHigh, WifiOff, AlertTriangle, ChevronRight } from 'lucide-react';

const BookingSummary = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketRef = useRef();

  // Simulated WiFi Logic
  const [journeyStatus, setJourneyStatus] = useState('upcoming'); // upcoming, in-progress, completed
  const [wifiConnected, setWifiConnected] = useState(false);
  const [wifiMsg, setWifiMsg] = useState('');
  const [reconnectTimer, setReconnectTimer] = useState(0);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching Booking Data for ID:', id);
        const apiUrl = import.meta.env.VITE_API_URL || 'https://rail-connect.onrender.com';
        const { data } = await axios.get(`${apiUrl}/api/bookings/${id}`);
        console.log('Booking Data Received:', data);
        setBooking(data);
        
        // Simulate journey logic based on "today"
        const travelDate = new Date(data.travelDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (travelDate < today) setJourneyStatus('completed');
        else if (travelDate.getTime() === today.getTime()) setJourneyStatus('in-progress');
        else setJourneyStatus('upcoming');

      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.response?.data?.message || 'Failed to load ticket details. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  useEffect(() => {
    let interval;
    if (journeyStatus === 'in-progress' && booking?.passengers?.some(p => p.wifiSelected)) {
      setWifiConnected(true);
      setWifiMsg('Connected to Onboard High-Speed WiFi');
      
      // Random disconnection simulation
      interval = setInterval(() => {
        if (Math.random() < 0.3 && wifiConnected) {
          setWifiConnected(false);
          setWifiMsg('Disconnected! Reconnecting in 10 minutes...');
          setReconnectTimer(600); // 10 minutes in seconds
        }
      }, 10000);
    } else if (journeyStatus === 'completed') {
      setWifiConnected(false);
      setWifiMsg('Journey Completed. WiFi Session Expired.');
    } else if (journeyStatus === 'upcoming') {
      setWifiConnected(false);
      setWifiMsg('WiFi will activate once your journey starts.');
    }
    return () => clearInterval(interval);
  }, [journeyStatus, booking, wifiConnected]);

  useEffect(() => {
    let timer;
    if (reconnectTimer > 0) {
      timer = setInterval(() => {
        setReconnectTimer(prev => {
          if (prev <= 1) {
            setWifiConnected(true);
            setWifiMsg('Connected to Onboard High-Speed WiFi');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [reconnectTimer]);

  const handleDownload = () => {
    window.print();
  };

  const generateWifiCredentials = (passenger, pnr) => {
    if (!passenger.wifiSelected) return null;
    // Unique ID: RC_PNR_First3CharsOfName
    const wifiId = `RC_${pnr.slice(-5)}_${passenger.name?.slice(0, 3).toUpperCase()}`;
    // Secure Password: PNR_Last4_Age
    const wifiPass = `${pnr.slice(-4)}${passenger.age}`;
    return { id: wifiId, pass: wifiPass };
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600" />
      <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest text-xs">Fetching Secure Ticket...</p>
    </div>
  );
  
  if (error || !booking) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 text-center space-y-6">
      <div className="inline-flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Oops! Error</h2>
      <p className="text-slate-500 dark:text-slate-400 font-bold">{error || 'Booking not found or has been expired.'}</p>
      <Link to="/dashboard" className="block w-full py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 px-4 pb-20">
      <div className="text-center space-y-6 pt-10 no-print">
        <div className="inline-flex items-center justify-center p-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-2">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">E-Ticket Generated</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">Confirmed for {booking.passengers?.length || 0} passenger(s).</p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border-2 border-primary-600/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${journeyStatus === 'in-progress' ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
              <Radio size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Journey Status</p>
              <p className="font-black text-slate-900 dark:text-white capitalize">{journeyStatus.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100 dark:bg-slate-700 hidden md:block" />
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-all duration-500 ${wifiConnected ? 'bg-primary-600 text-white' : 'bg-red-500/10 text-red-500'}`}>
              {wifiConnected ? <SignalHigh size={24} /> : <WifiOff size={24} />}
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Onboard WiFi</p>
              <p className={`font-black text-sm ${wifiConnected ? 'text-primary-600' : 'text-red-500'}`}>
                {wifiMsg} {reconnectTimer > 0 && `(${Math.floor(reconnectTimer/60)}m ${reconnectTimer%60}s)`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black hover:scale-105 transition-all shadow-lg">
            <Printer size={20} /> Print Ticket
          </button>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar pb-10">
        <div ref={ticketRef} className="relative bg-white text-slate-900 overflow-hidden border border-slate-300 print:shadow-none print:border-slate-400 print:rounded-none mx-auto min-w-[600px] md:min-w-0 max-w-[800px] p-4 sm:p-8 font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b-2 border-slate-800 pb-4 mb-6 gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">IR</div>
                <span className="text-[7px] sm:text-[8px] font-bold text-blue-900 mt-1 uppercase text-center">Indian Railways</span>
              </div>
            </div>
            <div className="text-center order-first sm:order-none">
              <h1 className="text-lg sm:text-xl font-black underline uppercase tracking-tight">Electronic Reservation Slip (ERS)</h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 mt-1">Normal User</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-xl flex items-center justify-center text-primary-600 font-black text-xl sm:text-2xl border-2 border-primary-600/20">RC</div>
              <span className="text-[7px] sm:text-[8px] font-bold text-primary-600 mt-1 uppercase text-center">RailConnect</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 items-center">
            <div className="text-center space-y-1">
              <p className="text-[9px] sm:text-xs font-black uppercase text-slate-500">Booked From</p>
              <h4 className="text-xs sm:text-sm font-black text-blue-900 uppercase">{booking.train?.source || 'N/A'}</h4>
              <p className="text-[8px] sm:text-[10px] font-bold">Start Date* {booking.travelDate}</p>
            </div>
            <div className="relative flex flex-col items-center justify-center">
               <div className="bg-blue-100 text-blue-800 px-2 sm:px-4 py-0.5 sm:py-1 rounded-sm text-[8px] sm:text-[10px] font-black uppercase mb-1 relative z-10">Boarding At</div>
               <div className="w-full h-3 sm:h-4 bg-blue-400/30 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-3 sm:h-4 h-3 sm:w-4 bg-blue-500 transform rotate-45 translate-x-1.5 sm:translate-x-2"></div>
               </div>
               <p className="text-[8px] sm:text-[10px] font-bold mt-1 text-center">Departure* {booking.train?.timing || 'N/A'}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[9px] sm:text-xs font-black uppercase text-slate-500">To</p>
              <h4 className="text-xs sm:text-sm font-black text-blue-900 uppercase">{booking.train?.destination || 'N/A'}</h4>
              <p className="text-[8px] sm:text-[10px] font-bold">Arrival* N.A.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 border-y-2 border-slate-800 py-3 mb-6 bg-slate-50 gap-4 sm:gap-0">
            <div className="text-center sm:border-r border-slate-300">
              <p className="text-[10px] font-black uppercase text-slate-500">PNR</p>
              <p className="text-lg font-black text-blue-600">{booking._id?.slice(-10).toUpperCase() || 'N/A'}</p>
              <div className="mt-1">
                 <p className="text-[8px] font-black uppercase text-slate-400">Quota</p>
                 <p className="text-[10px] font-bold uppercase">General (GN)</p>
              </div>
            </div>
            <div className="text-center sm:border-r border-slate-300">
              <p className="text-[10px] font-black uppercase text-slate-500">Train No./Name</p>
              <p className="text-sm font-black text-blue-900">{booking.train?.trainNumber} / {booking.train?.name}</p>
              <div className="mt-1">
                 <p className="text-[8px] font-black uppercase text-slate-400">Distance</p>
                 <p className="text-[10px] font-bold uppercase">1378 KM</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase text-slate-500">Class</p>
              <p className="text-sm font-black text-blue-900 uppercase">{booking.passengers?.[0]?.coachNumber?.split('-')[0] || 'SL'} CLASS</p>
              <div className="mt-1">
                 <p className="text-[8px] font-black uppercase text-slate-400">Booking Date</p>
                 <p className="text-[10px] font-bold uppercase">{new Date(booking.createdAt).toLocaleDateString()} 00:44:00 HRS</p>
              </div>
            </div>
          </div>

          {/* Passenger Details Table IRCTC Style */}
          <div className="mb-8 overflow-x-auto no-scrollbar">
            <h3 className="text-sm font-black uppercase border-b border-slate-800 pb-1 mb-3">Passenger Details & WiFi Access</h3>
            <table className="w-full text-[10px] min-w-[600px]">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-2 font-black"># Name</th>
                  <th className="py-2 font-black">Age/Sex</th>
                  <th className="py-2 font-black">Booking Status</th>
                  <th className="py-2 font-black">WiFi ID</th>
                  <th className="py-2 font-black">WiFi Password</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {booking.passengers?.map((p, idx) => {
                  const wifi = generateWifiCredentials(p, booking._id);
                  return (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-2">{idx + 1}. {p.name?.toUpperCase() || 'N/A'}</td>
                      <td className="py-2">{p.age} / {p.gender === 'Male' ? 'M' : 'F'}</td>
                      <td className="py-2">
                        {p.status === 'WL' ? `WL/${p.wlNumber}` : p.status === 'RAC' ? `RAC/${p.racNumber}` : `CNF/${p.coachNumber}/${p.seatNumber}`}
                      </td>
                      <td className="py-2">
                        {wifi ? (
                          <span className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded border border-primary-100 font-black">{wifi.id}</span>
                        ) : (
                          <span className="text-slate-300">Not Opted</span>
                        )}
                      </td>
                      <td className="py-2">
                        {wifi ? (
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-black font-mono tracking-tighter">{wifi.pass}</span>
                        ) : (
                          <span className="text-slate-300">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-t-2 border-slate-800 pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase">Transaction ID: <span className="text-blue-900">10000{booking._id?.slice(-10)}</span></p>
                <p className="text-[9px] font-bold text-slate-500 mt-1 italic">IR recovers only 57% of cost of travel on an average.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase underline">Payment Details</h4>
                <div className="space-y-1 text-[10px] font-bold">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Ticket Fare (Base)</span>
                    <span>₹ {((booking.totalPrice || 0) - ((booking.totalPrice || 0) * 0.07 + 11.80 + 0.45 * (booking.passengers?.length || 0))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>WiFi Add-ons</span>
                    <span>₹ {(booking.passengers?.filter(p => p.wifiSelected).length || 0) * 150}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>GST (5%)</span>
                    <span>₹ {((booking.totalPrice || 0) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Station Development Fee (2%)</span>
                    <span>₹ {((booking.totalPrice || 0) * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Convenience Fee</span>
                    <span>₹ 11.80</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Insurance Premium</span>
                    <span>₹ {(0.45 * (booking.passengers?.length || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 pt-1">
                    <span>Total Fare (all inclusive)</span>
                    <span>₹ {booking.totalPrice || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-32 h-32 border-2 border-slate-200 p-2 bg-white mb-2 shadow-sm">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PNR_${booking._id?.slice(-10).toUpperCase() || 'N/A'}`} alt="QR Code" className="w-full h-full" />
              </div>
              <p className="text-[8px] font-bold text-slate-400 text-right uppercase leading-tight">Verified by RailConnect Digital Gateway<br/>Personal User ID Booking</p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-300 pt-4 space-y-4 text-[8px] font-bold text-slate-700 leading-tight">
            <p className="font-black text-[9px]">* Beware of fraudulent customer care number. For any assistance, use only the IRCTC e-ticketing Customer care number: 14646.</p>
            <p className="font-black text-[9px]">* The printed Departure and Arrival Times are liable to change. Please Check correct departure, arrival from Railway Station Enquiry or Dial 139.</p>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <p className="uppercase font-black mb-1">Instructions:</p>
              <ol className="list-decimal pl-3 space-y-1">
                <li>Prescribed original ID proof is required while travelling along with SMS/ ERS otherwise will be treated as without ticket.</li>
                <li>PNRs having fully waitlisted status will be dropped and automatic refund of the ticket amount after deducting the applicable CLERKAGE by Railway shall be credited.</li>
                <li>This ticket is booked on a personal User ID, its sale/purchase is an offence u/s 143 of the Railways Act, 1989.</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-2 no-print">
             <div className="bg-blue-900 text-white p-2 rounded-sm flex items-center justify-between overflow-hidden relative">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">RC</div>
                   <div className="text-[10px]">
                      <p className="font-black uppercase">BEWARE OF FRAUDSTERS!</p>
                      <p className="font-bold opacity-80 text-[8px]">Never share your OTP or Login details with anyone.</p>
                   </div>
                </div>
                <div className="bg-blue-700 px-3 py-1 rounded text-[8px] font-black uppercase">RailConnect Security</div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 no-print">
        <Link to="/" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black hover:bg-slate-200 transition-all">Book Another</Link>
        <Link to="/dashboard" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 flex items-center gap-2">
          <LayoutDashboard size={20} /> My Dashboard
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, nav, footer, button { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-slate-300 { border-color: #cbd5e1 !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          @page { margin: 0.5cm; size: auto; }
          header, footer { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default BookingSummary;
