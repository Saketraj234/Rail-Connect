const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/railconnect');
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Drop the users collection to clear conflicting indexes and null entries
    try {
      await mongoose.connection.db.dropCollection('users');
      console.log('Successfully dropped "users" collection. Old indexes and null values cleared.');
    } catch (err) {
      if (err.code === 26) {
        console.log('Users collection does not exist, nothing to drop.');
      } else {
        throw err;
      }
    }

    console.log('Database fix complete. You can now register successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixDatabase();
