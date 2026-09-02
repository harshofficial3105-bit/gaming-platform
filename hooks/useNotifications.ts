'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { NotificationItemData } from '@/types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Calculate unread counter
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // 1. Fetch notifications
  const fetchNotifications = useCallback(async (uid: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        setNotifications(data as NotificationItemData[]);
      }
    } catch (err) {
      console.warn('[Notifications] Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initialize and setup Supabase Realtime Subscription
  useEffect(() => {
    let channel: any = null;
    const supabase = createClient();

    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await fetchNotifications(user.id);

          // Realtime Channel subscription for instant updates
          channel = supabase
            .channel(`user-notifications-${user.id}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`,
              },
              (payload) => {
                const newNotif = payload.new as NotificationItemData;
                setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`,
              },
              (payload) => {
                const updated = payload.new as NotificationItemData;
                setNotifications((prev) =>
                  prev.map((n) => (n.id === updated.id ? updated : n))
                );
              }
            )
            .subscribe();
        } else {
          // Guest User (Default state)
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    init();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchNotifications]);

  // 3. Mark Single Notification as Read
  const markAsRead = async (id: string) => {
    // Optimistic state update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    if (userId) {
      try {
        const supabase = createClient();
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('[Notifications] Error marking notification as read:', err);
      }
    }
  };

  // 4. Mark All Notifications as Read
  const markAllAsRead = async () => {
    // Optimistic state update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    if (userId) {
      try {
        const supabase = createClient();
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', userId)
          .eq('is_read', false);
      } catch (err) {
        console.warn('[Notifications] Error marking all as read:', err);
      }
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    userId,
    markAsRead,
    markAllAsRead,
    refresh: () => userId && fetchNotifications(userId),
  };
}