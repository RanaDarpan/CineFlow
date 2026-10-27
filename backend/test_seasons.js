import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const { Series } = await import('./src/models/series.model.js');
    const { Seasons } = await import('./src/models/seasons.model.js');
    
    const series = await Series.findOne({ title: 'Series3' });
    console.log('Series:', series);
    if(series) {
       const seasons = await Seasons.find({ series_id: series._id });
       console.log('Seasons for Series3:', seasons);
    }
    process.exit(0);
  });
