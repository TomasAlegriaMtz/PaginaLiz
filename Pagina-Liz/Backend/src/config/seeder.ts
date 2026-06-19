import bcrypt from 'bcryptjs';
import User from '../models/User';

export const seedMasterUser = async () => {
  try {
    const masterExists = await User.findOne({ role: 'MASTER' });
    if (!masterExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      await User.create({
        username: 'admin',
        password_hash: hashedPassword,
        role: 'MASTER',
        isActive: true
      });
      console.log('Seeder: Usuario MASTER creado con éxito (admin/admin)');
    } else {
      console.log('Seeder: Usuario MASTER ya existe.');
    }
  } catch (error) {
    console.error('Error al ejecutar el seeder de MASTER:', error);
  }
};
