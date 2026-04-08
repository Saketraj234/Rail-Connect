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
    { 
      trainNumber: '12345', 
      name: 'Rajdhani Express', 
      source: 'Delhi', 
      destination: 'Mumbai', 
      timing: '16:00', 
      classes: [
        { className: 'SL', price: 600, seats: 50 },
        { className: '3A', price: 1500, seats: 40 },
        { className: '2A', price: 2200, seats: 20 },
        { className: '1A', price: 3500, seats: 10 }
      ]
    },
    { 
      trainNumber: '23456', 
      name: 'Shatabdi Express', 
      source: 'Delhi', 
      destination: 'Chandigarh', 
      timing: '07:30', 
      classes: [
        { className: 'SL', price: 400, seats: 60 },
        { className: '3A', price: 1000, seats: 40 },
        { className: '2A', price: 1600, seats: 20 }
      ]
    },
    { 
      trainNumber: '34567', 
      name: 'Duronto Express', 
      source: 'Kolkata', 
      destination: 'Mumbai', 
      timing: '20:15', 
      classes: [
        { className: 'SL', price: 700, seats: 50 },
        { className: '3A', price: 1800, seats: 40 },
        { className: '2A', price: 2500, seats: 20 },
        { className: '1A', price: 4000, seats: 10 }
      ]
    },
    { 
      trainNumber: '45678', 
      name: 'Garib Rath', 
      source: 'Delhi', 
      destination: 'Patna', 
      timing: '18:45', 
      classes: [
        { className: 'SL', price: 350, seats: 100 },
        { className: '3A', price: 800, seats: 80 }
      ]
    },
    { 
      trainNumber: '56789', 
      name: 'Tejas Express', 
      source: 'Lucknow', 
      destination: 'Delhi', 
      timing: '06:10', 
      classes: [
        { className: '3A', price: 1200, seats: 40 },
        { className: '2A', price: 1800, seats: 20 },
        { className: '1A', price: 2800, seats: 10 }
      ]
    },
    // New Routes Requested
    { 
      trainNumber: '11001', 
      name: 'Gaya-Ambala Express', 
      source: 'Gaya', 
      destination: 'Ambala Cantt', 
      timing: '10:30', 
      classes: [
        { className: 'SL', price: 550, seats: 50 },
        { className: '3A', price: 1400, seats: 40 },
        { className: '2A', price: 2000, seats: 20 }
      ]
    },
    { 
      trainNumber: '11002', 
      name: 'Delhi-Gaya Mahabodhi', 
      source: 'Delhi', 
      destination: 'Gaya', 
      timing: '12:15', 
      classes: [
        { className: 'SL', price: 500, seats: 50 },
        { className: '3A', price: 1300, seats: 40 },
        { className: '2A', price: 1900, seats: 20 },
        { className: '1A', price: 3000, seats: 10 }
      ]
    },
    { 
      trainNumber: '11003', 
      name: 'Gaya-Delhi Express', 
      source: 'Gaya', 
      destination: 'Delhi', 
      timing: '22:00', 
      classes: [
        { className: 'SL', price: 500, seats: 50 },
        { className: '3A', price: 1300, seats: 40 },
        { className: '2A', price: 1900, seats: 20 }
      ]
    },
    { 
      trainNumber: '11004', 
      name: 'Ambala-Gaya Express', 
      source: 'Ambala Cantt', 
      destination: 'Gaya', 
      timing: '14:45', 
      classes: [
        { className: 'SL', price: 550, seats: 50 },
        { className: '3A', price: 1400, seats: 40 },
        { className: '2A', price: 2000, seats: 20 }
      ]
    },
    { 
      trainNumber: '11005', 
      name: 'Patna-Deoghar Passenger', 
      source: 'Patna', 
      destination: 'Deoghar', 
      timing: '05:30', 
      classes: [
        { className: 'SL', price: 200, seats: 80 },
        { className: '3A', price: 600, seats: 40 }
      ]
    },
    { 
      trainNumber: '11006', 
      name: 'Warisaliganj-Delhi Exp', 
      source: 'Warisaliganj', 
      destination: 'Delhi', 
      timing: '19:15', 
      classes: [
        { className: 'SL', price: 450, seats: 50 },
        { className: '3A', price: 1200, seats: 40 },
        { className: '2A', price: 1800, seats: 20 }
      ]
    }
  ];

  try {
    await Train.deleteMany({});
    const createdTrains = await Train.insertMany(trains);
    res.status(201).json(createdTrains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrains, getTrainById, seedTrains };
