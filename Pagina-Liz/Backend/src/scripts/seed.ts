import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import DocumentCategory from '../models/DocumentCategory';
import PageContent from '../models/PageContent';
import { connectDB } from '../config/db';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@paginaliz.com' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        email: 'admin@paginaliz.com',
        password_hash: hashedPassword,
        role: 'ADMIN'
      });
      console.log('Admin user created: admin@paginaliz.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Check default category
    const categoryExists = await DocumentCategory.findOne({ slug: 'general' });
    if (!categoryExists) {
      await DocumentCategory.create({
        name: 'General',
        slug: 'general'
      });
      console.log('Default DocumentCategory "General" created.');
    }

    // Check PageContent for 'home'
    const homeContentExists = await PageContent.findOne({ slug: 'home' });
    if (!homeContentExists) {
      await PageContent.create({
        slug: 'home',
        data: {
          sobreMi: '¡Hola!, soy Estela Lizbeth Muñoz Andrade, Profesora - Investigadora del Departamento de Sistemas Electrónicos, actualmente apoyo como Secretaria de Docencia en el Centro de Ciencias Básicas. Tengo un Doctorado en Ciencias Exactas y como parte de la investigación me enfoco en el desarrollo de Software Educativo para el aprendizaje de la programación.',
          experienciaAnios: '25 Años de Experiencia en:',
          experienciaLista: [
            'Desarrollo y lenguajes de programación',
            'Análisis y diseño de sistemas',
            'Bases de datos',
            'Estructura de datos'
          ],
          carrerasTexto: 'He impartido materias en las carreras de:',
          carrerasLista: [
            'Informática',
            'Sistemas Computacionales',
            'Electrónica',
            'Matemáticas Aplicadas'
          ]
        }
      });
      console.log('Default PageContent for "home" created.');
    }

    console.log('Data seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
