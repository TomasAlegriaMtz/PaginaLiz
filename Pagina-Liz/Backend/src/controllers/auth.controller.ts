import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecret123', {
    expiresIn: '30d',
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Usuario no encontrado o inactivo' });
    }

    if (await bcrypt.compare(password, user.password_hash)) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
