import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(`${process.env.MONGODB_URI}/OTT`)
  .then(async () => {
    await mongoose.connection.db.collection('reviews').deleteMany({ comment: 'Test comment' });
    console.log("Deleted");
    process.exit(0);
  });
