import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { candidateNotifications, Notification } from '../data/mockData';
import {
  BellIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  CheckIcon } from
'lucide-react';
const iconFor = (type: Notification['type']) => {
  switch (type) {
    case 'interview':
      return CalendarIcon;
    case 'profile':
      return UserIcon;
    case 'feedback':
      return FileTextIcon;
    default:
      return BellIcon;
  }
};
const colorFor = (type: Notification['type']) => {
  switch (type) {
    case 'interview':
      return 'bg-primary/10 border-primary/20 text-primary';
    case 'profile':
      return 'bg-cyan/10 border-cyan/20 text-cyan';
    case 'feedback':
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600';
    default:
      return 'bg-neutral/10 border-neutral/20 text-neutral';
  }
};
export function CandidateNotifications() {
  const [notifications, setNotifications] = useState(candidateNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const filtered =
  filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const markAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true
      }))
    );
  };
  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
      n.id === id ?
      {
        ...n,
        read: !n.read
      } :
      n
      )
    );
  };
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <DashboardLayout role="candidate" title="Notifications" userName="John Doe">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-8 flex items-center justify-between flex-wrap gap-4">
        
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Notifications
          </h1>
          <p className="text-sm text-secondary/70">
            {unreadCount > 0 ?
            `You have ${unreadCount} unread notifications` :
            'You are all caught up'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white/50 rounded-2xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${filter === 'all' ? 'bg-primary text-white shadow-glass' : 'text-secondary/70'}`}>
              
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${filter === 'unread' ? 'bg-primary text-white shadow-glass' : 'text-secondary/70'}`}>
              
              Unread
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckIcon className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </motion.div>

      <div className="space-y-3">
        {filtered.map((notif, index) => {
          const Icon = iconFor(notif.type);
          return (
            <motion.div
              key={notif.id}
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: index * 0.05
              }}>
              
              <GlassCard
                className={`p-5 cursor-pointer transition-all ${!notif.read ? 'ring-1 ring-primary/20' : ''}`}>
                
                <div
                  className="flex items-start space-x-4"
                  onClick={() => toggleRead(notif.id)}>
                  
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorFor(notif.type)}`}>
                    
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h3 className="text-sm font-semibold text-secondary">
                        {notif.title}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!notif.read &&
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        }
                        <span className="text-xs text-secondary/60">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-secondary/70">{notif.message}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>);

        })}

        {filtered.length === 0 &&
        <GlassCard className="p-12 text-center">
            <BellIcon className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-secondary/60">No notifications</p>
          </GlassCard>
        }
      </div>
    </DashboardLayout>);

}