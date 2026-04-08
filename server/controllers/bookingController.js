const Booking = require('../models/Booking');
const Train = require('../models/Train');

const createBooking = async (req, res) => {
  const { trainId, travelDate, passengers, selectedClass } = req.body;
  const userId = req.user.id;

  console.log('Booking Request Received:', { trainId, travelDate, selectedClass, passengerCount: passengers?.length });

  try {
    const train = await Train.findById(trainId);
    if (!train) {
      console.log('Train not found:', trainId);
      return res.status(404).json({ message: 'Train not found' });
    }

    const trainClass = train.classes.find(c => c.className === selectedClass);
    if (!trainClass) {
      return res.status(400).json({ message: 'Invalid class selected for this train' });
    }

    const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
    const wifiPrice = 150;
    const convenienceFee = 11.80;
    const insuranceFeePerPax = 0.45;
    
    let baseFareTotal = 0;
    let wifiTotal = 0;

    const processedPassengers = passengers.map((p, index) => {
      // ... (existing logic for status, coach, seat)
      const travelDateObj = new Date(travelDate);
      const today = new Date();
      const diffTime = travelDateObj - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let status = 'CNF';
      let wlNumber = null;
      let racNumber = null;
      let coachNumber = null;
      let seatNumber = null;
      let berth = null;

      if (diffDays <= 5 && diffDays >= 0) {
        const randomVal = Math.random();
        if (randomVal > 0.7) {
          status = 'WL';
          wlNumber = Math.floor(Math.random() * 50) + 1;
        } else if (randomVal > 0.4) {
          status = 'RAC';
          racNumber = Math.floor(Math.random() * 20) + 1;
          coachNumber = `RAC-${Math.floor(Math.random() * 2) + 1}`;
          seatNumber = Math.floor(Math.random() * 72) + 1;
          berth = 'Side Lower';
        }
      }

      if (status === 'CNF') {
        coachNumber = `${selectedClass}-${Math.floor(Math.random() * 5) + 1}`;
        seatNumber = Math.floor(Math.random() * 72) + 1;
        berth = berths[Math.floor(Math.random() * berths.length)];
      }
      
      let wifiId = null;
      let wifiPassword = null;
      
      if (p.wifiSelected) {
        wifiId = `RC_WIFI_${Math.floor(Math.random() * 9000) + 1000}`;
        wifiPassword = Math.random().toString(36).slice(-8).toUpperCase();
        wifiTotal += wifiPrice;
      }
      
      baseFareTotal += trainClass.price;

      return {
        ...p,
        status,
        wlNumber,
        racNumber,
        coachNumber,
        seatNumber,
        berth,
        wifiId,
        wifiPassword
      };
    });

    // Tax calculation
    const gstAmount = (baseFareTotal + wifiTotal) * 0.05; // 5% GST
    const stationFee = baseFareTotal * 0.02; // 2% Station Development Fee based on destination/base fare
    const insuranceTotal = insuranceFeePerPax * passengers.length;
    
    const calculatedTotalPrice = Math.round((baseFareTotal + wifiTotal + gstAmount + stationFee + convenienceFee + insuranceTotal) * 100) / 100;

    const booking = await Booking.create({
      user: userId,
      train: trainId,
      passengers: processedPassengers,
      totalPrice: calculatedTotalPrice,
      travelDate,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    // Delete expired non-cancelled bookings first
    const allUserBookings = await Booking.find({ user: req.user.id, isCancelled: false });
    for (const booking of allUserBookings) {
      const travelDate = new Date(booking.travelDate);
      if (travelDate < twoDaysAgo) {
        await Booking.findByIdAndDelete(booking._id);
      }
    }

    const bookings = await Booking.find({ user: req.user.id })
      .populate('train')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.isCancelled) {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Cancellation logic: Deduct 20% tax or fixed amount
    const cancellationCharge = Math.max(120, booking.totalPrice * 0.2); // Min 120 or 20%
    const refund = Math.max(0, booking.totalPrice - cancellationCharge);

    booking.isCancelled = true;
    booking.refundAmount = refund;
    booking.cancellationDate = new Date();
    
    // Update status for all passengers
    booking.passengers.forEach(p => {
      p.status = 'CANCELLED';
    });

    await booking.save();
    res.json({ message: 'Booking cancelled successfully', refundAmount: refund });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('train')
      .populate('user', 'name email rail_id');

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
};
