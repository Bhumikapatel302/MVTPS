// src/components/SidebarPanel.jsx
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Anchor, AlertCircle, ChevronDown, ChevronRight, Ship, Flag, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarPanel = ({
  vessels,
  filteredVessels,
  selectedVessel,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onUpdatePositions,
  updating,
  onSelectVessel,
  message
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const vesselCategories = [
    { id: 'cargo', name: 'Cargo' },
    { id: 'tanker', name: 'Tanker' },
    { id: 'container', name: 'Container' },
    { id: 'fishing', name: 'Fishing' },
    { id: 'passenger', name: 'Passenger' },
    { id: 'tug', name: 'Tug' },
    { id: 'other', name: 'Other' }
  ];

  const uniqueFlags = [...new Set(vessels.map(v => v.flag).filter(Boolean))].sort();

  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ types: [], flags: [], speedRange: [0, 30] });
    setSearchQuery('');
  };

  return (
    <div className="w-80 h-full bg-app-bg border-r border-white/20 flex flex-col shadow-xl z-20">
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="p-5 bg-white border-b border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md">
            <Anchor size={20} />
          </div>
          MaritimeTrack
        </h1>
        <p className="text-slate-500 text-xs mt-2 ml-1">Fleet Operations & Tracking</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {/* Message Banner */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-lg flex items-start gap-3 text-xs font-medium shadow-sm ${message.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Input */}
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search vessel or IMO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Filters Accordion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter size={16} className="text-blue-600" />
              <span>Fleet Filters</span>
            </div>
            {isFilterOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100"
              >
                <div className="p-4 space-y-5">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Ship size={12} /> Category
                    </label>
                    <div className="space-y-1.5 pl-1">
                      {vesselCategories.map(category => (
                        <label key={category.id} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.types.includes(category.id)}
                            onChange={() => toggleFilter('types', category.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 checked:bg-blue-600 transition-colors"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Flag Filter */}
                  {uniqueFlags.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Flag size={12} /> Flag State
                      </label>
                      <div className="space-y-1.5 pl-1 max-h-32 overflow-y-auto scrollbar-hide">
                        {uniqueFlags.map(flag => (
                          <label key={flag} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.flags.includes(flag)}
                              onChange={() => toggleFilter('flags', flag)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 checked:bg-blue-600 transition-colors"
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{flag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  {/* Speed Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Gauge size={12} /> Speed (knots)
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <input
                        type="number"
                        value={filters.speedRange[0]}
                        onChange={(e) => setFilters(prev => ({ ...prev, speedRange: [Number(e.target.value), prev.speedRange[1]] }))}
                        className="w-14 text-center bg-white border border-slate-200 rounded-md text-sm py-1"
                      />
                      <div className="h-0.5 w-4 bg-slate-300 rounded-full" />
                      <input
                        type="number"
                        value={filters.speedRange[1]}
                        onChange={(e) => setFilters(prev => ({ ...prev, speedRange: [prev.speedRange[0], Number(e.target.value)] }))}
                        className="w-14 text-center bg-white border border-slate-200 rounded-md text-sm py-1"
                      />
                    </div>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Reset Active Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vessel List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fleet List ({filteredVessels.length})
            </h2>
            <button
              onClick={onUpdatePositions}
              disabled={updating}
              className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={updating ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="space-y-2.5 pb-20">
            {filteredVessels.map((vessel) => (
              <div
                key={vessel.id}
                onClick={() => onSelectVessel(vessel)}
                className={`group relative p-4 bg-white border rounded-xl cursor-pointer transition-all duration-200 ${selectedVessel?.id === vessel.id
                  ? 'border-[rgba(20,143,184,0.8)] shadow-[0_0_15px_rgba(63,220,244,0.4)]'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
              >
                {/* Active Indicator Strip */}
                {selectedVessel?.id === vessel.id && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-[rgba(20,143,184,1)] rounded-r-full" />
                )}

                <div className="flex flex-col gap-1 pl-2">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-sm ${selectedVessel?.id === vessel.id ? 'text-blue-700' : 'text-slate-800'}`}>
                      {vessel.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      IMO {vessel.imo_number}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                      {vessel.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Flag size={10} /> {vessel.flag}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase">Speed</span>
                      <span className="text-xs font-semibold text-slate-700">{vessel.speed?.toFixed(1) || 0} kn</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase">Course</span>
                      <span className="text-xs font-semibold text-slate-700">{vessel.course?.toFixed(0) || 0}°</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredVessels.length === 0 && (
              <div className="text-center py-10 bg-white border border-dashed border-slate-300 rounded-xl">
                <Ship size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm font-medium">No vessels found</p>
                <p className="text-slate-400 text-xs">Try adjusting filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarPanel;