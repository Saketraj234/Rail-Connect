import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Train, Wifi, CreditCard, ChevronRight, User, MapPin, Clock, Calendar, CheckCircle2, ShieldCheck, RefreshCw, Smartphone, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const searchParams = new URLSearchParams(location.search);
  const travelDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const selectedClass = searchParams.get('class') || 'SL';
  const quota = searchParams.get('quota') || 'GENERAL';

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  
  // Multiple Passengers
  const [passengers, setPassengers] = useState([
    { name: user?.name || '', age: '', gender: 'Male', wifiSelected: false }
  ]);
  
  // Captcha
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Payment
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    generateCaptcha();
    const fetchTrain = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://rail-connect.onrender.com';
        const { data } = await axios.get(`${apiUrl}/api/trains/${id}`);
        setTrain(data);
      } catch (error) {
        console.error('Error fetching train:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrain();
  }, [id]);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserCaptcha('');
    setCaptchaError(false);
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: '', age: '', gender: 'Male', wifiSelected: false }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(newPassengers);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (userCaptcha.toUpperCase() !== captchaText) {
      setCaptchaError(true);
      generateCaptcha();
      return;
    }
    setStep(2);
  };

  const handleFakePayment = async () => {
    setBookingLoading(true);
    setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://rail-connect.onrender.com';
        const { data } = await axios.post(`${apiUrl}/api/bookings`, {
          trainId: id,
          travelDate,
          passengers,
          selectedClass,
        });
        console.log('Booking Created:', data);
        if (data && data._id) {
          setPaymentSuccess(true);
          setTimeout(() => {
            navigate(`/booking-summary/${data._id}`);
          }, 2000);
        } else {
          throw new Error('Booking ID missing from response');
        }
      } catch (error) {
        console.error('Booking failed:', error);
        alert(`Booking failed: ${error.response?.data?.message || error.message}`);
        setBookingLoading(false);
      }
    }, 2000);
  };

  if (loading) return <div className="text-center p-10 animate-pulse">Loading train details...</div>;
  if (!train) return <div className="text-center p-10 text-red-500 font-bold">Train not found.</div>;

  const wifiPrice = 150;
  const convenienceFee = 11.80;
  const insuranceFeePerPax = 0.45;

  const trainClass = train.classes?.find(c => c.className === selectedClass) || { price: 0 };
  const baseTotal = trainClass.price * passengers.length;
  const wifiTotal = passengers.filter(p => p.wifiSelected).length * wifiPrice;
  
  // Tax calculation logic
  const gstAmount = (baseTotal + wifiTotal) * 0.05; // 5% GST
  const stationFee = baseTotal * 0.02; // 2% Station Development Fee based on destination
  const insuranceTotal = insuranceFeePerPax * passengers.length;
  const totalTaxes = gstAmount + stationFee + convenienceFee + insuranceTotal;

  const totalPrice = Math.round((baseTotal + wifiTotal + totalTaxes) * 100) / 100;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center w-full max-w-2xl">
          <div className={`flex flex-col items-center flex-1 relative`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className="text-xs font-bold mt-2 uppercase tracking-widest">Details</span>
            <div className={`absolute top-5 -right-1/2 w-full h-1 z-0 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`} />
          </div>
          <div className={`flex flex-col items-center flex-1 relative`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className="text-xs font-bold mt-2 uppercase tracking-widest">Payment</span>
            <div className={`absolute top-5 -right-1/2 w-full h-1 z-0 ${paymentSuccess ? 'bg-primary-600' : 'bg-slate-200'}`} />
          </div>
          <div className={`flex flex-col items-center flex-1`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${paymentSuccess ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
            <span className="text-xs font-bold mt-2 uppercase tracking-widest">Ticket</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {step === 1 ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                  Passenger <span className="text-primary-600">Details</span>
                </h2>
                <button
                  type="button"
                  onClick={addPassenger}
                  disabled={passengers.length >= 6}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                >
                  <Plus size={20} /> Add Passenger
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 space-y-6 sm:space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 sm:p-6 bg-primary-50 dark:bg-primary-900/10 rounded-2xl sm:rounded-3xl border border-primary-100 dark:border-primary-900/30">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary-600 text-white p-3 rounded-2xl shadow-lg shadow-primary-500/30">
                      <Train size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{train.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">#{train.trainNumber}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="px-2 py-0.5 bg-primary-600/10 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                          Quota: {quota}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Route</p>
                      <p className="text-sm font-black">{train.source} → {train.destination}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time</p>
                      <p className="text-sm font-black">{train.timing}</p>
                    </div>
                  </div>
                </div>

                <form id="detailsForm" onSubmit={handleProceedToPayment} className="space-y-10">
                  {passengers.map((p, index) => (
                    <div key={index} className="relative p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Passenger {index + 1}</span>
                        {passengers.length > 1 && (
                          <button type="button" onClick={() => removePassenger(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                            placeholder="Full Name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Age</label>
                          <input
                            type="number"
                            value={p.age}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                            placeholder="Age"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Gender</label>
                          <select
                            value={p.gender}
                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold appearance-none"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div 
                        onClick={() => handlePassengerChange(index, 'wifiSelected', !p.wifiSelected)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${p.wifiSelected ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${p.wifiSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <Wifi size={18} />
                          </div>
                          <div>
                            <p className="font-black text-sm">Include Onboard WiFi</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">High-speed internet access</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-primary-600 text-sm">₹150</p>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 mx-auto ${p.wifiSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                            {p.wifiSelected && <CheckCircle2 size={12} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-4 pt-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Verification</label>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl flex items-center justify-center gap-6 border-2 border-dashed border-slate-300 dark:border-slate-700 select-none">
                        <span className="text-3xl font-black italic tracking-[0.5em] text-slate-400 dark:text-slate-600 line-through decoration-primary-600/50">{captchaText}</span>
                        <button type="button" onClick={generateCaptcha} className="text-primary-600 hover:rotate-180 transition-all duration-500">
                          <RefreshCw size={24} />
                        </button>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={userCaptcha}
                          onChange={(e) => setUserCaptcha(e.target.value)}
                          placeholder="Enter Captcha"
                          className={`w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-black tracking-widest ${captchaError ? 'border-red-500 animate-shake' : 'border-slate-200 dark:border-slate-700'}`}
                          required
                        />
                        {captchaError && <p className="text-xs font-bold text-red-500 px-2">Incorrect captcha, please try again.</p>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                Secure <span className="text-primary-600">Payment</span>
              </h2>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 space-y-8">
                {paymentSuccess ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-black">Payment Successful!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">Your transaction has been processed. Generating tickets...</p>
                    <div className="pt-6">
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-primary-600 font-black underline underline-offset-4"
                      >
                        Redirecting automatically... or click here if stuck
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Choose Payment Method</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'UPI', icon: <Smartphone size={24} />, name: 'UPI Payment (GPay, PhonePe)' },
                          { id: 'CARD', icon: <CreditCard size={24} />, name: 'Debit / Credit Card' }
                        ].map((method) => (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMode(method.id)}
                            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMode === method.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/30'}`}
                          >
                            <div className={`p-3 rounded-xl ${paymentMode === method.id ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                              {method.icon}
                            </div>
                            <span className="font-black">{method.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-slate-100 dark:border-slate-700 space-y-6">
                      <div className="flex items-center justify-between font-black text-xl">
                        <span>Total Payable ({passengers.length} Pax)</span>
                        <span className="text-primary-600">₹{totalPrice}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 text-center">Clicking the button below will simulate a successful payment transaction.</p>
                      <button
                        onClick={handleFakePayment}
                        disabled={bookingLoading}
                        className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-primary-700 transform transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary-500/30"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="animate-spin h-6 w-6 border-4 border-white/30 border-t-white rounded-full" />
                            Processing...
                          </>
                        ) : (
                          <>Pay ₹{totalPrice} Now</>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <ShieldCheck size={16} className="text-green-500" /> 100% Secure Payment Powered by RailConnect
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
              <h3 className="text-xl font-black border-b border-slate-100 dark:border-slate-700 pb-4">Fare Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold text-sm">
                  <span>Base Fare ({passengers.length} × ₹{trainClass.price})</span>
                  <span className="text-slate-900 dark:text-white">₹{baseTotal}</span>
                </div>
                {wifiTotal > 0 && (
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold text-sm">
                    <span>WiFi Add-ons ({passengers.filter(p => p.wifiSelected).length} × ₹150)</span>
                    <span className="text-green-500">+ ₹{wifiTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold text-sm">
                  <span>Taxes & Service Fees</span>
                  <span className="text-green-500">+ ₹{totalTaxes.toFixed(2)}</span>
                </div>
                <div className="pl-4 space-y-1">
                   <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>GST (5%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Station Dev. Fee (2%)</span>
                      <span>₹{stationFee.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Convenience Fee</span>
                      <span>₹{convenienceFee.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Insurance (x{passengers.length})</span>
                      <span>₹{insuranceTotal.toFixed(2)}</span>
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-black text-lg">Total Amount</span>
                  <span className="text-3xl font-black text-primary-600">₹{totalPrice}</span>
                </div>

                {step === 1 && (
                  <button
                    form="detailsForm"
                    type="submit"
                    className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-700 transform transition-all active:scale-95 shadow-xl shadow-primary-500/30"
                  >
                    Proceed to Payment <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
