db = db.getSiblingDB('resources');

// 1. Insert admin user
db.users.insertMany([
  {
    username: "admin",
    password: "$2a$10$szS52Kf7mUDCBQkhl6BSEe2R3AeJtG6/aDInY1Xmi1aFW7nSvzirC",
    role: "MASTER",
    isActive: true,
    __v: 0
  }
]);

// Prepare ObjectIds for subjects to use in relationships
var subjectProg1Id = ObjectId();
var subjectLogicaId = ObjectId();
var subjectProg2Id = ObjectId();

// 2. Insert Subjects
db.subjects.insertMany([
  { _id: subjectProg1Id, name: "Programación I", slug: "programacion-i", isActive: true, __v: 0 },
  { _id: subjectLogicaId, name: "Lógica de Programación", slug: "logica-de-programacion", isActive: true, __v: 0 },
  { _id: subjectProg2Id, name: "Programación II", slug: "programacion-ii", isActive: true, __v: 0 }
]);

// 3. Insert Document Categories (Units) matching the subjects
db.documentcategories.insertMany([
  {
    name: "Unidad I",
    slug: "unidad-i",
    subjectId: subjectProg1Id,
    __v: 0
  },
  {
    name: "Funciones",
    slug: "funciones",
    subjectId: subjectProg1Id,
    __v: 0
  },
  {
    name: "Apuntadores y Memoria Dinámica",
    slug: "apuntadores-y-memoria-dinamica",
    subjectId: subjectProg2Id,
    __v: 0
  }
]);

print("Database initialized successfully with base data.");
