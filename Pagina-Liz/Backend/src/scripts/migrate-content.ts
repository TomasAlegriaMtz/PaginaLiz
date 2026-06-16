import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import PageContent from '../models/PageContent';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const migrateContent = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://db:27017/paginaliz';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Projects Content
    const projectsData = {
      proyectosCol1: [
        { codigo: 'PII25-1', titulo: 'Aplicación de la Inteligencia Artificial Generativa en la enseñanza aprendizaje de la programación.', anio: 2024, shape: 'diamond' },
        { codigo: 'PII23-5', titulo: 'Estudio de los efectos de Inversión de la Experticia y Trabajo Colectivo en el aprendizaje de la programación, aplicando la Teoría de Carga Cognitiva.', anio: 2022, shape: 'circle' },
        { codigo: 'PII17-4', titulo: 'Impacto del uso de las redes sociales en el rendimiento académico de los estudiantes de Ingeniería de la Universidad Autónoma de Aguascalientes.', anio: 2016, shape: 'triangle' }
      ],
      proyectosCol2: [
        { codigo: 'PII21-1', titulo: 'Efectos del uso de material didáctico instruccional basado en la Teoría de Carga Cognitiva en el aprendizaje de estructuras de datos y algoritmos de programación.', anio: 2020, shape: 'diamond' },
        { codigo: 'PII18-2', titulo: 'Elementos para el diseño de ambientes visuales como herramienta de apoyo al proceso de enseñanza-aprendizaje de la Lógica de Programación.', anio: 2017, shape: 'triangle' }
      ],
      tesis: [
        { titulo: 'Modelo instruccional "Mapa Ruta" basado en la Teoría de la Carga Cognitiva como apoyo en la enseñanza-aprendizaje de la programación.', nivel: 'Doctorado', estado: 'En Proceso' },
        { titulo: 'Estrategia didáctica basada en la gamificación para el aprendizaje significativo de la dinámica en el Tecnológico Nacional de México.', nivel: 'Doctorado', estado: 'En Proceso' },
        { titulo: 'Uso de Repositorios de Software Educativo en el Proceso Personal de Software en estudiantes de Instituciones de Educación Superior.', nivel: 'Doctorado', estado: 'En Proceso' },
        { titulo: 'Uso del Efecto de Auto-explicación como Apoyo en el Aprendizaje de la Programación, Aplicando la Teoría de la Carga Cognitiva.', nivel: 'Maestría', estado: 'Terminada', anio: '2022' },
        { titulo: 'El análisis de datos de redes sociales para la determinación de factores que dificulten el proceso de aprendizaje en estudiantes de nivel superior.', nivel: 'Maestría', estado: 'Terminada', anio: '2020' },
        { titulo: 'Enseñanza de Programación de Estructura de Datos aplicando estrategias didácticas basadas en la Teoría de Carga Cognitiva.', nivel: 'Maestría', estado: 'Terminada', anio: '2020' },
        { titulo: 'Diseño y uso de Planes de Programación como apoyo para la enseñanza de la programación.', nivel: 'Maestría', estado: 'Terminada', anio: '2018' },
        { titulo: 'Identificación de los Estilos de Enseñanza y su nivel de influencia en la motivación del estudiante novato en programación.', nivel: 'Maestría', estado: 'Terminada', anio: '2016' },
        { titulo: 'Factores conductuales y cognitivos del estudiante universitario que tiene éxito en los primeros cursos de programación.', nivel: 'Maestría', estado: 'Terminada', anio: '2016' },
        { titulo: 'Trazabilidad de Componentes en Líneas de Producción Automotrices mediante RFID.', nivel: 'Maestría', estado: 'Terminada', anio: '2016' },
        { titulo: 'Motivación en el aprendizaje de la programación a nivel bachillerato utilizando un lenguaje de programación educativo.', nivel: 'Maestría', estado: 'Terminada', anio: '2016' },
        { titulo: 'Efectos del aprendizaje basado en juegos en el pensamiento algorítmico de aprendices de programación.', nivel: 'Maestría', estado: 'Terminada', anio: '2014' },
        { titulo: 'Construcción de un Buscador Semántico para un Sistema Web de apoyo para el aprendizaje de la programación: un estudio descriptivo.', nivel: 'Maestría', estado: 'Terminada', anio: '2014' },
        { titulo: 'Aplicación de un método de evaluación de software que mejore la calidad final.', nivel: 'Maestría', estado: 'Terminada', anio: '2008' }
      ],
      publicaciones: [
        { titulo: 'Applying Cognitive Load Theory and the Split Attention Effect to Learning Data Structures.', fuente: 'IEEE Revista Iberoamericana de Tecnologías del Aprendizaje', anio: 2023, autores: 'Carlos Argelio Arévalo Mercado, Estela Lizbeth Muñoz Andrade, Héctor Cardona Reyes' },
        { titulo: 'Repositorio de Software Educativo: Una Aproximación de Desarrollo Conceptual.', fuente: 'Revista EDMETIC', anio: 2022, autores: 'Verónica Rodríguez Aguilar, Sandra Luz Canchola Magdaleno, Estela Lizbeth Muñoz Andrade, Rebeca Garzón Clemente' },
        { titulo: 'El Efecto de la Teoría de Carga Cognitiva en el Aprendizaje de la Programación Básica.', fuente: 'Revista Entorno, Universidad Tecnológica de El Salvador', anio: 2019, autores: 'Carlos Argelio Arévalo Mercado, Blanca Guadalupe Estrada Rentería, Estela Lizbeth Muñoz Andrade' },
        { titulo: 'Diseño de Software Educativo para Elevar el Aprendizaje Significativo de los Estudiantes de Nivel Básico: Un Caso de Estudio.', fuente: 'Investigación', anio: 2019, autores: 'Estela Lizbeth Muñoz Andrade, Mariana Consuelo Fernández Espinosa' },
        { titulo: 'A Software Tool to Visualize Verbal Protocols to Enhance Strategic and Metacognitive Abilities in Basic Programming.', fuente: 'International Journal of Interactive Mobile Technologies', anio: 2011, autores: 'Carlos Argelio Arévalo Mercado, Estela Lizbeth Muñoz Andrade, Juan Manuel Gómez Reynoso' },
        { titulo: 'Improve Teaching and Learning: Comparison Between Web Pages and Multimedia-Interactive Systems.', fuente: 'Conference Proceedings', anio: 2009, autores: 'Estela Lizbeth Muñoz Andrade, Juan Manuel Gómez Reynoso' },
        { titulo: 'The Effect of Learning Objects on a C++ Programming Lesson.', fuente: 'Communications of the IIMA', anio: 2008, autores: 'Carlos Argelio Arévalo Mercado, Estela Lizbeth Muñoz Andrade' },
        { titulo: 'Learning Data Structures Using Multimedia-Interactive Systems.', fuente: 'Communications of the IIMA', anio: 2008, autores: 'Estela Lizbeth Muñoz Andrade, Carlos Argelio Arévalo Mercado' }
      ],
      capitulos: [
        { titulo: 'Revisión Documental Significativa: Propuesta de un Método Alternativo para la Gestión de Información.', editorial: 'Editorial Transdigital', anio: 2022, numeroCapitulo: 'Capítulo 4', autores: 'Verónica Rodríguez Aguilar, Sandra Luz Canchola Magdaleno, Estela Lizbeth Muñoz Andrade' },
        { titulo: 'Aplicación de la Tecnología Educativa en la Enseñanza-Aprendizaje de la Programación: Una Propuesta para el Diseño de una Herramienta Visual.', editorial: 'Universidad Autónoma de Querétaro', anio: 2021, autores: 'Estela Lizbeth Muñoz Andrade, Carlos Argelio Arévalo Mercado, Sandra Luz Canchola Magdaleno' },
        { titulo: 'Herramienta para la Enseñanza de Estructuras de Control en Programación.', editorial: 'Universidad Autónoma de Aguascalientes', anio: 2021, autores: 'Estela Lizbeth Muñoz Andrade, Carlos Argelio Arévalo Mercado' },
        { titulo: 'NUSKA: Red de Artesanos.', editorial: 'Universidad Popular Autónoma del Estado de Puebla', anio: 2020, autores: 'Mariana Consuelo Fernández Espinosa, Luis David Rodarte Domínguez, María Isabel Muñoz de Loera, Estela Lizbeth Muñoz Andrade' }
      ]
    };

    await PageContent.findOneAndUpdate({ slug: 'projects' }, { data: projectsData }, { upsert: true });
    console.log('Migrated projects content');

    // Footer Content
    const footerData = {
      facebook: '#',
      instagram: '#',
      tiktok: '#',
      copyright: 'Universidad Autónoma de Aguascalientes'
    };
    await PageContent.findOneAndUpdate({ slug: 'footer' }, { data: footerData }, { upsert: true });
    console.log('Migrated footer content');

    // Gallery Content (defaulting to the 7 placeholders)
    const galleryData = {
      images: [
        '/foto.jpg',
        '/foto.jpg',
        '/foto.jpg',
        '/foto.jpg',
        '/foto.jpg',
        '/foto.jpg',
        '/foto.jpg'
      ]
    };
    await PageContent.findOneAndUpdate({ slug: 'gallery' }, { data: galleryData }, { upsert: true });
    console.log('Migrated gallery content');

    console.log('Content migration successful');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateContent();
