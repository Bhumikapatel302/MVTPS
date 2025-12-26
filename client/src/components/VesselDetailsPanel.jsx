// src/components/VesselDetailsPanel.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigation, TrendingUp, Bell, X, Trash2, CheckCircle, MapPin, Anchor, Clock, ArrowRight, Ship } from 'lucide-react';

const VesselDetailsPanel = ({ vessel, track, onEnableAlerts, onClose }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use centralized API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    checkSubscriptionStatus();
  }, [vessel]);

  // Recheck subscription status when component updates
  useEffect(() => {
    const interval = setInterval(() => {
      checkSubscriptionStatus();
    }, 2000); // Relaxed interval
    return () => clearInterval(interval);
  }, [vessel]);

  const checkSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_URL}/users/subscriptions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const results = Array.isArray(data) ? data : (data.results || []);

      const subscription = results.find(sub => sub.vessel === vessel.id);
      if (subscription) {
        setIsSubscribed(subscription.is_active);
        setAlertType(subscription.alert_type);
      } else {
        setIsSubscribed(false);
        setAlertType('');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleDeleteAlert = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('You must be logged in');
        setIsDeleting(false);
        return;
      }

      await fetch(`${API_URL}/users/subscriptions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vessel: vessel.id,
          alert_type: alertType,
          is_active: false
        })
      });

      setIsSubscribed(false);
      setAlertType('');
      setShowConfirmDelete(false);
      toast.success('Alert removed');
    } catch (error) {
      console.error('Error removing alert:', error);
      toast.error('Failed to remove alert');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 shadow-xl z-20 overflow-y-auto flex flex-col h-full absolute right-0 top-0 bottom-0">
      {/* Header */}
      <div className="p-6 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <Navigation size={20} />
              </span>
              {vessel.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1 pl-1">IMO: {vessel.imo_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Status Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            Current Status
          </h3>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Speed</span>
              <span className="text-lg font-bold text-slate-800">{vessel.speed?.toFixed(1) || '0.0'} <span className="text-xs font-normal text-slate-400">knots</span></span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((vessel.speed || 0) * 5, 100)}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Course</span>
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Navigation size={14} className="transform rotate-45" />
                  {vessel.course?.toFixed(1)}°
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">Status</span>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  Underway
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voyage Info (Vertical Stack) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Anchor size={14} /> Voyage Information
          </h3>

          <div className="relative pl-4 space-y-6 border-l-2 border-slate-100">
            {/* Origin */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
              <div>
                <span className="text-xs text-slate-400 block">Origin</span>
                <span className="text-sm font-semibold text-slate-700">Unknown Port</span>
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-500/10"></div>
              <div>
                <span className="text-xs text-slate-400 block">Destination</span>
                <span className="text-sm font-semibold text-slate-800">{vessel.destination || 'N/A'}</span>
                <span className="text-xs text-emerald-600 block mt-1">ETA: 2 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vessel Details (Vertical List) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Ship size={14} /> Particulars
          </h3>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex justify-between items-center">
              <span className="text-sm text-slate-500">Alert Status</span>
              {isSubscribed ? (
                <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Active
                </span>
              ) : (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-sm text-slate-500">Flag State</span>
              <span className="text-sm font-medium text-slate-700">{vessel.flag || 'Unknown'}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-sm text-slate-500">Vessel Type</span>
              <span className="text-sm font-medium text-slate-700">{vessel.type}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-sm text-slate-500">Position</span>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                {vessel.last_position_lat.toFixed(4)}, {vessel.last_position_lon.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100">
          {isSubscribed ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full text-red-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900">Alerts Enabled</h4>
                  <p className="text-xs text-red-700">Notifying on {alertType.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
              >
                Turn Off Alerts
              </button>
            </div>
          ) : (
            <button
              onClick={onEnableAlerts}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              <Bell size={18} />
              Monitor This Vessel
            </button>
          )}
        </div>

        {/* Track History */}
        {track && track.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} /> 24h History
            </h3>
            <div className="h-40 relative">
              {/* Mini Chart Mock for visual upgrade - functionality relies on list */}
              <div className="absolute inset-0 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                <div className="p-4 space-y-2">
                  {track.slice(0, 5).map((point, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-600">{point.speed?.toFixed(1)}kn</span>
                        <ArrowRight size={10} className="text-slate-300" style={{ transform: `rotate(${point.course}deg)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Stop Monitoring?</h3>
            <p className="text-sm text-slate-500 mb-6">You will no longer receive alerts for this vessel.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAlert}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                {isDeleting ? '...' : 'Stop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VesselDetailsPanel;