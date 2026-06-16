import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import DocumentCategory from '../models/DocumentCategory';
import DocumentModel from '../models/Document';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// The hardcoded structure from topics.ts
const unidadesProgramacion = [
  {
    numero: '1',
    tituloEs: 'Funciones',
    materialesEs: [
      { title: 'Funciones en C', file: 'materials/programacion-1/unidad-1/Funciones.pdf', type: 'pdf', contentKey: 'u1-funciones.es' }
    ]
  },
  {
    numero: '2',
    tituloEs: 'Tipos de Datos Estructurados',
    materialesEs: [
      { title: 'Tipos de Datos Estructurados (Unidad 2)', file: 'materials/programacion-1/unidad-2/Unidad2-TiposDatosEstr.pdf', type: 'pdf', contentKey: 'u2-tipos-datos-estr.es' },
      { title: 'Enumeraciones', file: 'materials/programacion-1/unidad-2/Enumeraciones.pdf', type: 'pdf', contentKey: 'u2-enumeraciones.es' },
      { title: 'Uniones - Parte I', file: 'materials/programacion-1/unidad-2/Uniones_ParteI.pdf', type: 'pdf', contentKey: 'u2-uniones-i.es' },
      { title: 'Uniones - Parte II', file: 'materials/programacion-1/unidad-2/Uniones_ParteII.pdf', type: 'pdf', contentKey: 'u2-uniones-ii.es' },
      { title: 'Uniones - Parte III', file: 'materials/programacion-1/unidad-2/Uniones_ParteIII.pdf', type: 'pdf', contentKey: 'u2-uniones-iii.es' }
    ]
  },
  {
    numero: '3',
    tituloEs: 'Apuntadores y Memoria Dinámica',
    materialesEs: [
      { title: 'Apuntadores en C', file: 'materials/programacion-1/unidad-3/pointersC.pdf', type: 'pdf', contentKey: 'u3-apuntadores.es' },
      { title: 'Aritmética de Apuntadores', file: 'materials/programacion-1/unidad-3/AritmeticaPunteros.pptx', type: 'pptx', contentKey: 'u3-aritmetica-punteros.es' },
      { title: 'Memoria Dinámica', file: 'materials/programacion-1/unidad-3/U3.MemoriaDinamica.docx', type: 'docx', contentKey: 'u3-memoria-dinamica.es' }
    ]
  }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pagina-liz';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'admin@paginaliz.com' });
    if (!adminUser) {
      throw new Error('Admin user not found. Run seed script first.');
    }

    const frontendPublicPath = path.join(__dirname, '../../materials_temp');
    const backendUploadsPath = path.join(__dirname, '../../data/uploads');

    if (!fs.existsSync(backendUploadsPath)) {
      fs.mkdirSync(backendUploadsPath, { recursive: true });
    }

    for (const unidad of unidadesProgramacion) {
      const categoryName = `Programación I - ${unidad.tituloEs}`;
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      let category = await DocumentCategory.findOne({ slug });
      if (!category) {
        category = await DocumentCategory.create({ name: categoryName, slug });
        console.log(`Created category: ${categoryName}`);
      }

      for (const material of unidad.materialesEs) {
        const relativeFilePath = material.file.replace('materials/', '');
        const sourcePath = path.join(frontendPublicPath, relativeFilePath);
        
        if (fs.existsSync(sourcePath)) {
          const filename = path.basename(sourcePath);
          const destPath = path.join(backendUploadsPath, filename);
          
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${filename}`);

          let description = '';
          if (material.contentKey) {
            const jsonPath = path.join(frontendPublicPath, `programacion-1/content/${material.contentKey}.json`);
            if (fs.existsSync(jsonPath)) {
              try {
                const contentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                if (contentData.blocks && Array.isArray(contentData.blocks)) {
                  description = contentData.blocks.map((b: any) => b.text).join('\n\n');
                }
              } catch (e) {
                console.error(`Error reading json for ${material.contentKey}`, e);
              }
            }
          }

          // Check if document already exists
          const existingDoc = await DocumentModel.findOne({ originalName: filename, categoryId: category._id });
          if (!existingDoc) {
            await DocumentModel.create({
              title: material.title,
              description,
              filename,
              originalName: filename,
              path: `/uploads/${filename}`,
              categoryId: category._id,
              uploaderId: adminUser._id
            });
            console.log(`Created DB record for ${material.title}`);
          } else {
            console.log(`Record for ${material.title} already exists`);
          }
        } else {
          console.error(`Source file not found: ${sourcePath}`);
        }
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
