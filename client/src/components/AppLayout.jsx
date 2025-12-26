import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authAPI, default as api } from "../services/api";
import { useNotificationWebSocket } from "../hooks/useNotificationWebSocket.jsx";
import DarkModeToggle from "./DarkModeToggle";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import { Ship, Bell, Trash2, CheckCheck, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/vessels", label: "Vessels" },
  { to: "/ports", label: "Ports" },
  { to: "/voyages", label: "Voyages" },
  { to: "/live-tracking", label: "Live Tracking" },
];

const LogoutLoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
      </div>
      <p className="text-white font-medium">Logging out...</p>
    </div>
  </div>
);

const NotificationPopup = ({ isOpen, onClose, onMarkAllAsRead, onClearAll, notifications, onMarkAsRead, onDelete, onViewAll, formatTime }) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end pt-20 pr-4">
      {/* Overlay to close popup */}
      <div className="fixed inset-0 z-30" onClick={onClose}></div>

      {/* Notification Rectangle Popup */}
      <div className="relative z-40 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3 border-b border-slate-100 flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-700 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 dark:text-primary-300 transition text-sm font-medium"
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition text-sm font-medium"
              title="Delete all notifications"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <p className="text-sm">No notifications</p>
              <p className="text-xs text-slate-400 mt-1">You're all caught up! 🎉</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition ${notification.is_read ? '' : 'bg-primary-50 dark:bg-primary-900/20'
                  }`}
              >
                <div className="flex items-start gap-3">
                  {/* Unread Indicator */}
                  {!notification.is_read && (
                    <div className="h-2 w-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-2 shrink-0" />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {notification.type_display || 'NOTIFICATION'}
                      </p>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.vessel_name && (
                      <p className="text-xs text-slate-500">
                        🚢 {notification.vessel_name}
                      </p>
                    )}
                    {notification.event_type_display && (
                      <p className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-2 py-0.5 rounded inline-block mt-2">
                        {notification.event_type_display}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 shrink-0">
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                        }}
                        className="p-1.5 rounded hover:bg-primary-200 text-primary-600 dark:hover:bg-primary-900/50 dark:text-primary-400 transition"
                        title="Mark as read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-200 text-red-600 transition"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
            <button
              onClick={onViewAll}
              className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition py-2"
            >
              View All Notifications →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = ({ isConnected }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = authAPI.getCurrentUser();

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    // Only fetch notifications if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/users/notifications/');
      const data = response.data;
      const notificationsList = Array.isArray(data) ? data : (data.results || []);
      notificationsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(notificationsList);
      const unread = notificationsList.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.patch(`/users/notifications/${notificationId}/mark-read/`);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/users/notifications/${notificationId}/delete/`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      const response = await api.delete('/users/notifications/clear-all/');
      setNotifications([]);
      setUnreadCount(0);
      toast.success('Notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/users/notifications/mark-all-read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    authAPI.logout();
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <>
      {isLoggingOut && <LogoutLoadingScreen />}

      <header className="sticky top-0 z-30 bg-white border-b border-amber-200/50 shadow-sm transition-all duration-300">
        <div className="mx-auto flex items-center justify-between px-6 py-3 gap-4">
          {/* Logo and Title - Left - Minimal */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-lg shadow-blue-500/20">
              <Ship className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">MVTPS</h1>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Enterprise</span>
            </div>
          </div>

          {/* Search - Center - Enhanced */}
          <div className="hidden md:flex flex-1 justify-center max-w-4xl mx-auto px-6">
            <div className="w-full max-w-3xl">
              <SearchBar />
            </div>
          </div>

          {/* Right Toolbar - Clean Vertical Separators */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </button>
                <NotificationPopup
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                  onMarkAllAsRead={markAllAsRead}
                  onClearAll={clearAllNotifications}
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onDelete={deleteNotification}
                  onViewAll={() => { setNotificationsOpen(false); navigate('/notifications'); }}
                  formatTime={formatTime}
                />
              </div>

              {/* Dark Mode */}
              <div className="text-slate-500 hover:text-amber-500 transition-colors">
                <DarkModeToggle />
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* User Profile - Dropdown */}
            <UserDropdown user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
          </div>
        </div>
      </header>
    </>
  );
};

const Footer = () => (
  <footer className="border-t border-slate-200/70 bg-white">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm text-slate-500">
      <span>© {new Date().getFullYear()} MVTPS Team</span>
      <span className="text-slate-400">Maritime Excellence & Innovation</span>
    </div>
  </footer>
);

const AppLayout = () => {
  const [wsConnected, setWsConnected] = useState(false);

  useNotificationWebSocket((notification) => {
    console.log('Notification received:', notification);
    setWsConnected(true);
  });

  return (
    <div className="min-h-screen bg-sky-50 text-app-body transition-colors duration-300 font-sans">
      {/* Enhanced Toast Configuration */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#000000',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            fontWeight: '500',
            padding: '16px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#000000',
              color: '#fff',
              border: 'none',
            },
            icon: '✓',
          },
          error: {
            duration: 3000,
            style: {
              background: '#ef4444',
              color: '#fff',
              border: 'none',
            },
            icon: '✕',
          },
        }}
      />

      <Navbar isConnected={wsConnected} />
      {/* Breadcrumbs removed or styled transparently if needed, assumed handled by component or Global CSS */}
      <div className="flex relative">
        <Sidebar className="bg-app-bg" />
        <main className={`flex-1 bg-sky-50 text-app-body ${location.pathname === '/live-tracking' ? 'p-0 overflow-hidden h-[calc(100vh-70px)]' : 'px-4 py-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;