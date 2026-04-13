const Train = require('../models/Train');

const getTrains = async (req, res) => {
  const { source, destination } = req.query;

  try {
    const trains = await Train.find({
      source: { $regex: source, $options: 'i' },
      destination: { $regex: destination, $options: 'i' },
    });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (train) {
      res.json(train);
    } else {
      res.status(404).json({ message: 'Train not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed initial train data (for testing)
const seedTrains = async (req, res) => {
  const trains = [
    // Gaya to Ambala (3 trains)
    { 
      trainNumber: '12001', name: 'Gaya-Ambala Express', source: 'Gaya', destination: 'Ambala', timing: '10:30', 
      classes: [{ className: 'SL', price: 550, seats: 50 }, { className: '3A', price: 1400, seats: 40 }, { className: '2A', price: 2000, seats: 20 }]
    },
    { 
      trainNumber: '12002', name: 'Ambala Mail', source: 'Gaya', destination: 'Ambala', timing: '15:45', 
      classes: [{ className: 'SL', price: 520, seats: 60 }, { className: '3A', price: 1350, seats: 40 }]
    },
    { 
      trainNumber: '12003', name: 'Northern Superfast', source: 'Gaya', destination: 'Ambala', timing: '22:15', 
      classes: [{ className: 'SL', price: 580, seats: 50 }, { className: '3A', price: 1500, seats: 40 }, { className: '2A', price: 2200, seats: 20 }, { className: '1A', price: 3500, seats: 10 }]
    },

    // Ambala to New Delhi (5 trains)
    { 
      trainNumber: '13001', name: 'Ambala-Delhi Shatabdi', source: 'Ambala', destination: 'New Delhi', timing: '07:00', 
      classes: [{ className: '3A', price: 800, seats: 40 }, { className: '2A', price: 1200, seats: 20 }]
    },
    { 
      trainNumber: '13002', name: 'Capital Link', source: 'Ambala', destination: 'New Delhi', timing: '09:30', 
      classes: [{ className: 'SL', price: 250, seats: 80 }, { className: '3A', price: 700, seats: 50 }]
    },
    { 
      trainNumber: '13003', name: 'Intercity Express', source: 'Ambala', destination: 'New Delhi', timing: '13:15', 
      classes: [{ className: 'SL', price: 220, seats: 100 }]
    },
    { 
      trainNumber: '13004', name: 'Ambala-Delhi Passenger', source: 'Ambala', destination: 'New Delhi', timing: '17:45', 
      classes: [{ className: 'SL', price: 180, seats: 120 }]
    },
    { 
      trainNumber: '13005', name: 'Night Rider Express', source: 'Ambala', destination: 'New Delhi', timing: '23:30', 
      classes: [{ className: 'SL', price: 280, seats: 60 }, { className: '3A', price: 750, seats: 40 }]
    },

    // Gaya to Kiul (2 trains)
    { 
      trainNumber: '14001', name: 'Gaya-Kiul Passenger', source: 'Gaya', destination: 'Kiul', timing: '06:30', 
      classes: [{ className: 'SL', price: 150, seats: 100 }]
    },
    { 
      trainNumber: '14002', name: 'Kiul Link Exp', source: 'Gaya', destination: 'Kiul', timing: '14:20', 
      classes: [{ className: 'SL', price: 180, seats: 80 }, { className: '3A', price: 500, seats: 40 }]
    },

    // Gaya to WRS (Warisali Ganj) (2 trains)
    { 
      trainNumber: '15001', name: 'Gaya-WRS Local', source: 'Gaya', destination: 'WRS', timing: '08:00', 
      classes: [{ className: 'SL', price: 100, seats: 150 }]
    },
    { 
      trainNumber: '15002', name: 'Gaya-WRS Passenger', source: 'Gaya', destination: 'WRS', timing: '16:45', 
      classes: [{ className: 'SL', price: 120, seats: 100 }]
    },

    // Legacy data for variety
    { 
      trainNumber: '11002', name: 'Delhi-Gaya Mahabodhi', source: 'Delhi', destination: 'Gaya', timing: '12:15', 
      classes: [{ className: 'SL', price: 500, seats: 50 }, { className: '3A', price: 1300, seats: 40 }, { className: '2A', price: 1900, seats: 20 }, { className: '1A', price: 3000, seats: 10 }]
    }
  ];

  try {
    await Train.deleteMany({});
    const createdTrains = await Train.insertMany(trains);
    res.status(201).json({ message: 'Trains seeded successfully', count: createdTrains.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrains, getTrainById, seedTrains };
