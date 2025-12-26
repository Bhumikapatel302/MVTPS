import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Button from '../components/Button';
import { Edit } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const currentUser = await authAPI.fetchCurrentUser() || authAPI.getCurrentUser();
        if (currentUser) {
          setUser({
            username: currentUser.username || '',
            email: currentUser.email || '',
            role: currentUser.role || 'operator'
          });
        } else {
          setMessage({ type: 'error', text: 'Failed to load user profile.' });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <div className="p-6 text-center text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user.username) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <div className="p-6 text-center text-red-600">Unable to load profile</div>
      </div>
    );
  }

  const userInitial = user.username ? user.username.charAt(0).toUpperCase() : 'U';

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'analyst':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300';
      case 'operator':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-sky-50 rounded-3xl p-6 md:p-8 border border-sky-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section with Background Pattern */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              {/* Avatar with white ring */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl font-bold text-slate-700 border border-slate-200">
                    {userInitial}
                  </div>
                </div>
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${user.role === 'admin' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              </div>

              <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user.username}</h1>
                <p className="text-slate-500 font-medium">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/profile/edit')}
              variant="outline"
              icon={Edit}
              className="mb-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
            >
              Edit Profile
            </Button>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
              <div className={`w-2 h-2 rounded-full ${message.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Username</label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium group-hover:border-blue-200 transition-colors">
                      {user.username}
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Email Address</label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium group-hover:border-blue-200 transition-colors">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                  System Role
                </h3>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-500">Current Role</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {user.role === 'admin'
                      ? 'Full access to all system modules, user management, and configuration settings.'
                      : user.role === 'analyst'
                        ? 'Access to analytics, reporting tools, and vessel tracking data. Read-only access to system events.'
                        : 'Operational access to vessel logs, basic tracking features, and notification settings.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;