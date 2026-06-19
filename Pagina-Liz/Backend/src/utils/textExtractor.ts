import fs from 'fs';
import path from 'path';

export async function extractText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.pdf') {
      const pdfParse = require('pdf-parse');
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text || '';
    }

    if (ext === '.docx') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }

    if (ext === '.pptx') {
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      let text = '';

      for (const entry of entries) {
        if (entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml')) {
          const xml = entry.getData().toString('utf8');
          // Extract text from <a:t> tags
          const matches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
          if (matches) {
            const slideTexts = matches.map((m: string) => m.replace(/<[^>]+>/g, ''));
            text += slideTexts.join(' ') + '\n\n';
          }
        }
      }
      return text.trim();
    }

    return '';
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    return '';
  }
}
