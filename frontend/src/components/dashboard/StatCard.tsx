import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  icon: BoxIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: 'primary' | 'cyan' | 'green' | 'yellow';
}
export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'primary'
}: StatCardProps) {
  const colors = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    cyan: 'bg-cyan/10 border-cyan/20 text-cyan',
    green: 'bg-green-500/10 border-green-500/20 text-green-600',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600'
  };
  return (
    <motion.div
      whileHover={{
        scale: 1.02
      }}>
      
      <GlassCard className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colors[color]}`}>
            
            <Icon className="w-4 h-4" />
          </div>
          {trend &&
          <span className="text-[10px] font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full">
              {trend}
            </span>
          }
        </div>
        <div className="text-xl font-bold text-secondary">{value}</div>
        <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
          {label}
        </div>
      </GlassCard>
    </motion.div>);

}