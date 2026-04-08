const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cron = require('node-cron');
const Booking = require('./models/Booking');
const Train = require('./models/Train');

dotenv.config();
connectDB();

// Cron job to delete expired bookings (2 days after travel date)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cleanup: Deleting expired bookings...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate date 2 days ago
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    
    // Find all bookings
    const bookings = await Booking.find({});
    
    let deletedCount = 0;
    for (const booking of bookings) {
      const travelDate = new Date(booking.travelDate);
      if (travelDate < twoDaysAgo) {
        await Booking.findByIdAndDelete(booking._id);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      console.log(`Successfully deleted ${deletedCount} expired bookings.`);
    } else {
      console.log('No expired bookings found.');
    }
  } catch (error) {
    console.error('Error during booking cleanup:', error.message);
  }
});

// Cron job to auto-promote WL and RAC tickets daily
cron.schedule('0 1 * * *', async () => {
  console.log('Running daily status promotion: Updating WL and RAC...');
  try {
    const bookings = await Booking.find({});
    let promotedCount = 0;

    for (const booking of bookings) {
      let changed = false;
      const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

      for (const p of booking.passengers) {
        if (p.status === 'WL') {
          // Promote WL to RAC
          if (p.wlNumber > 1) {
            p.wlNumber -= 1;
          } else {
            p.status = 'RAC';
            p.racNumber = 20;
            p.wlNumber = null;
            p.coachNumber = `RAC-${Math.floor(Math.random() * 2) + 1}`;
            p.seatNumber = Math.floor(Math.random() * 72) + 1;
            p.berth = 'Side Lower';
          }
          changed = true;
        } else if (p.status === 'RAC') {
          // Promote RAC to CNF
          if (p.racNumber > 1) {
            p.racNumber -= 1;
          } else {
            p.status = 'CNF';
            p.racNumber = null;
            const train = await Train.findById(booking.train);
            const className = p.coachNumber?.split('-')[0] || 'SL';
            p.coachNumber = `${className}-${Math.floor(Math.random() * 5) + 1}`;
            p.seatNumber = Math.floor(Math.random() * 72) + 1;
            p.berth = berths[Math.floor(Math.random() * berths.length)];
          }
          changed = true;
        }
      }

      if (changed) {
        await booking.save();
        promotedCount++;
      }
    }
    console.log(`Successfully promoted status for ${promotedCount} bookings.`);
  } catch (error) {
    console.error('Error during status promotion:', error.message);
  }
});

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
