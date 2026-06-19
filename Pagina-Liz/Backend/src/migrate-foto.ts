import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import PageContent from './models/PageContent';

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://db:27017/resources';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const doc = await PageContent.findOne({ slug: 'gallery' });
  if (doc) {
    let modified = false;
    doc.data.images = doc.data.images.map((img: string) => {
      if (img === '/foto.jpg') {
        modified = true;
        return 'http://localhost:3000/assets/foto.jpg';
      }
      return img;
    });
    if (modified) {
      await doc.save();
      console.log('Updated gallery with migrated foto.jpg');
    } else {
      console.log('No /foto.jpg found to migrate');
    }
  }
  process.exit(0);
};

migrate().catch(e => {
  console.error(e);
  process.exit(1);
});
