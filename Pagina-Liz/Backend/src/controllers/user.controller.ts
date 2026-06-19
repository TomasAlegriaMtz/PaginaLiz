import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// Listar Usuarios
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuarios.' });
  }
};

// Crear Usuario (Solo accesible por MASTER en las rutas)
export const createUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'El usuario ya existe.' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // Evitar que se creen más usuarios MASTER
    const finalRole = role === 'MASTER' ? 'ADMIN' : 'ADMIN'; 

    const newUser = await User.create({ username, password_hash, role: finalRole });
    res.status(201).json({ message: 'Usuario creado', user: { username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creando usuario.' });
  }
};

// Bloquear / Desbloquear Usuario
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // REGLA ESTRICTA: El MASTER no puede ser bloqueado
    if (user.role === 'MASTER') {
      return res.status(403).json({ message: 'Operación denegada: No se puede bloquear al usuario MASTER.' });
    }

    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ message: `Usuario ${user.isActive ? 'reactivado' : 'bloqueado'}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado del usuario.' });
  }
};
