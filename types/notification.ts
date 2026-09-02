export type NotificationType =
  | 'rank_update'
  | 'new_game'
  | 'achievement'
  | 'system'
  | 'creator_update'
  | 'admin_update';

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface NotificationItemData {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  metadata?: {
    game_slug?: string;
    game_title?: string;
    old_rank?: number;
    new_rank?: number;
    score?: number;
    achievement_id?: string;
    [key: string]: any;
  };
  is_read: boolean;
  created_at: string;
}