import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Trophy } from 'lucide-react';
import { Button } from '../UI/Button';
import { GlassCard } from '../UI/GlassCard';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Advanced 3D interface with seamless performance'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Testing',
      description: 'Enterprise-grade security for fair examinations'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Real-time Results',
      description: 'Instant feedback with detailed analytics'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ExamPro
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of online examinations with our premium 3D interface, 
            advanced analytics, and immersive testing environment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="group"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <GlassCard className="p-6 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-20 text-sm text-gray-500"
        >
          Built with React 18, Three.js, and Framer Motion
        </motion.div>
      </div>
    </div>
  );
};