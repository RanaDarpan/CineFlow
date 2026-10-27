import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(`${process.env.MONGODB_URI}/OTT`)
  .then(async () => {
    await mongoose.connection.db.collection('movies').updateMany({}, { $set: { active: true } });
    console.log("Updated");
    process.exit(0);
  });
