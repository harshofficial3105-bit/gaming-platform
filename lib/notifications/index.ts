import { createAdminClient } from '@/lib/supabase/admin';
import { NotificationType, NotificationPriority } from '@/types/notification';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Server-Side Notification Dispatcher
 * Securely writes notifications using the isolated admin client.
 */
export async function dispatchNotification(params: CreateNotificationParams) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        priority: params.priority || 'normal',
        title: params.title,
        message: params.message,
        action_url: params.actionUrl || null,
        metadata: params.metadata || {},
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.warn('[Notifications] Failed to dispatch notification:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('[Notifications] Dispatch error:', err);
    return null;
  }
}