import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

import Subject from '../models/Subject';
import DocumentCategory from '../models/DocumentCategory';

const migrateSubjects = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://db:27017/paginaliz';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Create or get "Programación I" Subject
    let subject = await Subject.findOne({ slug: 'programacion-i' });
    if (!subject) {
      subject = new Subject({
        name: 'Programación I',
        slug: 'programacion-i'
      });
      await subject.save();
      console.log('Created Subject: Programación I');
    } else {
      console.log('Subject Programación I already exists');
    }

    // 2. Find all categories without subjectId
    const categories = await DocumentCategory.find({ subjectId: { $exists: false } });
    console.log(`Found ${categories.length} categories without subject`);

    for (const cat of categories) {
      cat.subjectId = subject._id as mongoose.Types.ObjectId;
      
      // Remove "Programación I - " if it exists in the name
      if (cat.name.startsWith('Programación I - ')) {
        cat.name = cat.name.replace('Programación I - ', '').trim();
        // We keep the old slug or generate a new one, better generate a new one
        cat.slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      await cat.save();
      console.log(`Updated category: ${cat.name}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateSubjects();
