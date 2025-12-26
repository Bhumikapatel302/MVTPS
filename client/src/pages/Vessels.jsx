// client/src/pages/Vessels.jsx - Updated with destination field
import React, { useState, useEffect, useRef } from 'react';
import { Anchor, MapPin, Ship, TrendingUp, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import VesselSearchFilter from '../components/VesselSearchFilter';

// Beautiful Loading Animation Component
const LoadingAnimation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes dash {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        .spinner-circle {
          animation: spin 3s linear infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2s infinite;
        }

        .floating {
          animation: float 2s ease-in-out infinite;
        }

        .dash-circle {
          animation: dash 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-8">
        {/* Main circular loader */}
        <div className="relative w-32 h-32">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full pulse-ring border-4 border-blue-400"></div>

          {/* SVG circular progress */}
          <svg
            className="w-32 h-32 -rotate-90"
            viewBox="0 0 120 120"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3))' }}
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="3"
            />
            {/* Animated circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className="dash-circle"
              strokeDasharray="1000"
            />
            <defs>
              <linearGradient
                id="gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner spinning dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 spinner-circle shadow-lg"></div>
          </div>
        </div>

        {/* Text content */}
        <div className="floating text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Loading Fleet Data
          </h2>
          <p className="text-slate-600">Connecting to database...</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-teal-500"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VesselsPage = () => {
  const [allVessels, setAllVessels] = useState([]);
  const [filteredVessels, setFilteredVessels] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [track, setTrack] = useState([]);
  const [vesselStats, setVesselStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [generating, setGenerating] = useState(false);
  const refreshIntervalRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Load vessels on mount
  useEffect(() => {
    loadVessels();
  }, []);

  // Auto-refresh selected vessel data
  useEffect(() => {
    if (!autoRefresh || !selectedVessel) return;

    refreshIntervalRef.current = setInterval(() => {
      loadVesselTrack(selectedVessel.id);
      loadVesselStats(selectedVessel.id);
    }, 10000); // Refresh every 10 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, selectedVessel]);

  // Load vessel details when selected
  useEffect(() => {
    if (selectedVessel) {
      loadVesselTrack(selectedVessel.id);
      loadVesselStats(selectedVessel.id);
    }
  }, [selectedVessel?.id]);

  const loadVessels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        setMessage({ type: 'error', text: 'You must be logged in to view vessels' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/vessels/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const vesselList = Array.isArray(data) ? data : (data.results || []);
      setAllVessels(vesselList);
      setFilteredVessels(vesselList);

      // Auto-select first vessel
      if (vesselList.length > 0 && !selectedVessel) {
        setSelectedVessel(vesselList[0]);
      }
    } catch (error) {
      console.error('Error loading vessels:', error);
      setMessage({ type: 'error', text: 'Failed to load vessels' });
    } finally {
      setLoading(false);
    }
  };

  const loadVesselTrack = async (vesselId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const hours = 24;
      const response = await fetch(
        `${API_URL}/vessels/${vesselId}/positions/?hours=${hours}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to load positions');

      const data = await response.json();

      // Handle both paginated and direct response
      const positions = data.positions || data.results || data;
      setTrack(Array.isArray(positions) ? positions : []);
    } catch (error) {
      console.error('Error loading track:', error);
      setMessage({ type: 'error', text: 'Failed to load position history' });
    }
  };

  const loadVesselStats = async (vesselId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(
        `${API_URL}/vessels/${vesselId}/stats/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to load stats');

      const data = await response.json();
      setVesselStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const generateMockData = async () => {
    try {
      setGenerating(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        setMessage({ type: 'error', text: 'You must be logged in' });
        setGenerating(false);
        return;
      }

      const response = await fetch(`${API_URL}/generate-realistic-mock-data/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_vessels: 5 })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate mock data');
      }

      const data = await response.json();
      setMessage({
        type: 'success',
        text: `Generated ${data.vessels.length} vessels with realistic routes`
      });

      await loadVessels();
    } catch (error) {
      console.error('Error generating mock data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to generate mock data' });
    } finally {
      setGenerating(false);
    }
  };

  const manualRefresh = async () => {
    if (selectedVessel) {
      await loadVesselTrack(selectedVessel.id);
      await loadVesselStats(selectedVessel.id);
      setMessage({ type: 'success', text: 'Data refreshed' });
    }
  };

  const handleFilterChange = (filtered) => {
    setFilteredVessels(filtered);
    // Clear selection if current vessel is filtered out
    if (selectedVessel && !filtered.find(v => v.id === selectedVessel.id)) {
      setSelectedVessel(filtered.length > 0 ? filtered[0] : null);
    }
  };

  // Use beautiful loading animation
  if (loading && allVessels.length === 0) {
    return <LoadingAnimation />;
  }

  return (
    <div className="space-y-6 pb-6 bg-sky-50 rounded-3xl p-6 md:p-8 border border-sky-100 min-h-screen">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fleet Management</h1>
          <p className="text-slate-500 mt-1">Search, filter, and monitor your vessel fleet in real-time</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={manualRefresh}
            disabled={!selectedVessel}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 shadow-sm disabled:opacity-50 flex items-center gap-2 transition font-medium"
          >
            <RefreshCw size={16} /> <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={generateMockData}
            disabled={generating}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 disabled:opacity-50 flex items-center gap-2 transition font-medium"
          >
            <Zap size={16} /> {generating ? 'Generating...' : 'Generate Data'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-2 transition ${message.type === 'error'
          ? 'bg-red-100 text-red-700'
          : 'bg-green-100 text-green-700'
          }`}>
          <AlertCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Auto-Refresh Toggle */}
      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <input
          type="checkbox"
          id="autoRefresh"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
        />
        <label htmlFor="autoRefresh" className="text-sm text-slate-700 cursor-pointer">
          Auto-refresh every 10 seconds {autoRefresh && <span className="ml-2 text-green-600">●</span>}
        </label>
      </div>

      {/* Search and Filter */}
      <VesselSearchFilter vessels={allVessels} onFiltersChange={handleFilterChange} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vessels List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Ship size={18} className="text-blue-600" /> Fleet List <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs ml-auto">{filteredVessels.length}</span>
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {filteredVessels.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Ship size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-900 font-medium">No vessels found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search filters</p>
              </div>
            ) : (
              filteredVessels.map((vessel) => (
                <div
                  key={vessel.id}
                  onClick={() => setSelectedVessel(vessel)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedVessel?.id === vessel.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className={`font-semibold ${selectedVessel?.id === vessel.id ? 'text-blue-700' : 'text-slate-800'}`}>{vessel.name}</div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{vessel.type.slice(0, 3)}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-16">IMO:</span> <span className="font-mono text-slate-700">{vessel.imo_number}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-16">Dest:</span> <span className="font-medium text-slate-700 truncate">{vessel.destination || '—'}</span>
                    </div>
                  </div>

                  {vessel.last_position_lat && vessel.last_position_lon && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100/50">
                      <MapPin size={10} className="text-blue-500" />
                      {vessel.last_position_lat.toFixed(3)}°, {vessel.last_position_lon.toFixed(3)}°
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details and Track */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVessel ? (
            <>
              {/* Vessel Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Anchor size={20} />
                    </div>
                    Vessel Details
                  </h3>
                  <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100">
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</div>
                    <div className="font-medium text-slate-900 text-lg">{selectedVessel.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IMO Number</div>
                    <div className="font-mono text-slate-900 bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">{selectedVessel.imo_number}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</div>
                    <div className="font-medium text-slate-700">{selectedVessel.type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flag</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏳️</span> <span className="font-medium text-slate-700">{selectedVessel.flag}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cargo Type</div>
                    <div className="font-medium text-slate-700">{selectedVessel.cargo_type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operator</div>
                    <div className="font-medium text-slate-700">{selectedVessel.operator}</div>
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</div>
                    <div className="font-bold text-blue-600 flex items-center gap-1">
                      <MapPin size={14} /> {selectedVessel.destination || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Sync</div>
                    <div className="font-medium text-slate-600 text-sm">
                      {new Date(selectedVessel.last_update).toLocaleDateString()} at {new Date(selectedVessel.last_update).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              {vesselStats && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-5 flex items-center gap-3">
                    <TrendingUp size={20} className="text-teal-600" /> Movement Analytics
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center text-center">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Avg Speed</div>
                      <div className="text-2xl font-bold text-slate-900">{vesselStats.avg_speed} <span className="text-xs font-normal text-slate-500">kts</span></div>
                    </div>
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col items-center text-center">
                      <div className="text-xs font-semibold text-blue-400 mb-1">Max Speed</div>
                      <div className="text-2xl font-bold text-blue-700">{vesselStats.max_speed} <span className="text-xs font-normal text-blue-400">kts</span></div>
                    </div>
                    <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex flex-col items-center text-center">
                      <div className="text-xs font-semibold text-orange-400 mb-1">Min Speed</div>
                      <div className="text-2xl font-bold text-orange-700">{vesselStats.min_speed} <span className="text-xs font-normal text-orange-400">kts</span></div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center text-center">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Data Points</div>
                      <div className="text-2xl font-bold text-slate-900">{vesselStats.total_positions}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Position Track */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-orange-600" /> Position History <span className="text-slate-400 font-normal text-sm ml-2">(Last 24 Hours)</span>
                </h3>
                {track.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-8 text-center border dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No position data recorded recently</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Time</th>
                            <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Coordinates</th>
                            <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Speed</th>
                            <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Course</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {track.slice(0, 10).map((pos, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4 text-slate-600 font-medium text-xs">
                                {new Date(pos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                <div className="text-[10px] text-slate-400 font-normal">{new Date(pos.timestamp).toLocaleDateString()}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-mono text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {pos.latitude.toFixed(4)}, {pos.longitude.toFixed(4)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${pos.speed > 10 ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                                  {pos.speed?.toFixed(1) || '0.0'} kts
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 text-xs flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center transform" style={{ transform: `rotate(${pos.course || 0}deg)` }}>
                                  ⬆
                                </div>
                                {pos.course?.toFixed(0) || '0'}°
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ship size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Vessel Selected</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Select a vessel from the list on the left to view its detailed specifications, real-time analytics, and movement history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VesselsPage;