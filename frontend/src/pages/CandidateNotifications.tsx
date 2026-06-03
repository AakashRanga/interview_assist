import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { API_BASE_URL } from '../config';
import {
  BellIcon,
  CheckIcon,
  AlertTriangleIcon,
  InfoIcon } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  icon?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  redirect_url?: string | null;
}

const iconFor = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return CheckIcon;
    case 'WARNING':
      return AlertTriangleIcon;
    case 'ERROR':
      return AlertTriangleIcon;
    case 'INFO':
      return InfoIcon;
    default:
      return BellIcon;
  }
};
const colorFor = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return 'bg-emerald-100 border-emerald-200 text-emerald-700';
    case 'WARNING':
      return 'bg-amber-100 border-amber-200 text-amber-700';
    case 'ERROR':
      return 'bg-red-100 border-red-200 text-red-700';
    case 'INFO':
      return 'bg-blue-100 border-blue-200 text-blue-700';
    default:
      return 'bg-neutral-100 border-neutral-200 text-neutral-700';
  }
};

const formatIndiaTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  }).format(date);
};

export function CandidateNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user?.id) {
        setLoading(false);
        return;
      }

      fetch(`${API_BASE_URL}/user/${user.id}/notifications?limit=50&offset=0`)
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data?.data ?? []);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  const markAllRead = async () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          await fetch(`${API_BASE_URL}/user/${user.id}/notifications/mark-all-read`, {
            method: 'PUT'
          });
        }
      } catch {
        // fallback to local state update only
      }
    }

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        is_read: true
      }))
    );
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      )
    );

    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT'
      });
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('notificationUnreadCountUpdated', {
        detail: unreadCount
      })
    );
  }, [unreadCount]);

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
        {loading ? (
          <GlassCard className="p-12 text-center">
            <p className="text-sm text-secondary/70">Loading notifications...</p>
          </GlassCard>
        ) : filtered.length > 0 ? (
          filtered.map((notif, index) => {
            const Icon = iconFor(notif.notification_type);
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
                  className={`p-5 cursor-pointer transition-all ${!notif.is_read ? 'ring-1 ring-primary/20' : ''}`}>
                  <div
                    className="flex items-start space-x-4"
                    onClick={() => markNotificationAsRead(notif.id)}>
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorFor(notif.notification_type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-secondary">
                          {notif.title}
                        </h3>
                        {!notif.is_read && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            Unread
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs text-secondary/60">
                          {formatIndiaTime(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-secondary/70">{notif.message}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        ) : (
          <GlassCard className="p-12 text-center">
            <BellIcon className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-secondary/60">No notifications</p>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>);

}