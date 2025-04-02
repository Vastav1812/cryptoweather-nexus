import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Notification {
  id: string;
  type: 'price_alert' | 'weather_alert';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

// Create slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
        read: false,
      };
      
      state.items.unshift(newNotification);
      state.unreadCount += 1;
      
      // Keep only the last 20 notifications
      if (state.items.length > 20) {
        if (!state.items[state.items.length - 1].read) {
          state.unreadCount -= 1;
        }
        state.items.pop();
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead(state) {
      state.items.forEach(item => {
        item.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
