import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Home, User } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';
import { User as UserType } from '../../services/authService';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  currentState: string;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, currentState, onNavigateHome }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <GlassCard className="flex items-center justify-between p-4">
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={onNavigateHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ExamPro
            </h1>
            <p className="text-xs text-gray-400">Premium MCQ Platform</p>
          </div>
        </motion.div>

        <nav className="flex items-center space-x-4">
          {currentState !== 'hero' && (
            <motion.button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </motion.button>
          )}

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              
              <motion.button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </motion.button>
            </div>
          )}
        </nav>
      </GlassCard>
    </motion.header>
  );
};