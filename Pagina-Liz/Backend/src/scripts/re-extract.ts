import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { extractText } from '../utils/textExtractor';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resources';

async function reExtract() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for re-extraction.');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('No database connection');
    process.exit(1);
  }

  const documentsCol = db.collection('documents');
  const contentCol = db.collection('documentcontents');

  const contents = await contentCol.find().toArray();
  console.log(`Found ${contents.length} documentcontents.`);

  let updated = 0;
  for (const content of contents) {
    if (!content.content || content.content.trim() === '') {
      const doc = await documentsCol.findOne({ _id: content.documentId });
      if (doc) {
        const langData = doc[content.lang];
        if (langData && langData.path) {
          const filePath = path.join(__dirname, '../../../data', langData.path);
          try {
            console.log(`Extracting text for ${langData.path}...`);
            const extracted = await extractText(filePath);
            if (extracted && extracted.trim() !== '') {
              await contentCol.updateOne(
                { _id: content._id },
                { $set: { content: extracted, extractedAt: new Date() } }
              );
              updated++;
              console.log(`  -> Successfully extracted text.`);
            } else {
              console.log(`  -> Still empty.`);
            }
          } catch (err) {
            console.error(`  -> Failed:`, err);
          }
        }
      }
    }
  }

  console.log(`\nRe-extraction complete. Updated ${updated} document contents.`);
  await mongoose.disconnect();
  process.exit(0);
}

reExtract().catch(err => {
  console.error('Re-extraction failed:', err);
  process.exit(1);
});
