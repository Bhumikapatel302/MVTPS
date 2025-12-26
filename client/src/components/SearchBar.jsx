import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ship, Anchor, Route } from 'lucide-react';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                // Search across vessels, ports, and voyages
                const [vesselsRes, portsRes, voyagesRes] = await Promise.all([
                    fetch(`${API_URL}/vessels/?search=${query}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/ports/?search=${query}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/voyages/?search=${query}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                ]);

                const vessels = await vesselsRes.json();
                const ports = await portsRes.json();
                const voyages = await voyagesRes.json();

                const combined = [
                    ...(Array.isArray(vessels) ? vessels : vessels.results || []).slice(0, 3).map(v => ({
                        type: 'vessel',
                        id: v.id,
                        name: v.name,
                        subtitle: v.imo_number
                    })),
                    ...(Array.isArray(ports) ? ports : ports.results || []).slice(0, 3).map(p => ({
                        type: 'port',
                        id: p.id,
                        name: p.name,
                        subtitle: p.country
                    })),
                    ...(Array.isArray(voyages) ? voyages : voyages.results || []).slice(0, 2).map(v => ({
                        type: 'voyage',
                        id: v.id,
                        name: `Voyage ${v.id}`,
                        subtitle: v.status
                    })),
                ];

                setResults(combined);
                setIsOpen(combined.length > 0);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (result) => {
        setIsOpen(false);
        setQuery('');

        if (result.type === 'vessel') {
            navigate('/vessels', { state: { selectedVessel: result.id } });
        } else if (result.type === 'port') {
            navigate('/ports', { state: { selectedPort: result.id } });
        } else if (result.type === 'voyage') {
            navigate('/voyages', { state: { selectedVoyage: result.id } });
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'vessel': return Ship;
            case 'port': return Anchor;
            case 'voyage': return Route;
            default: return Search;
        }
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search vessels, ports, voyages..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-slide-down">
                    {results.map((result, index) => {
                        const Icon = getIcon(result.type);
                        return (
                            <button
                                key={`${result.type}-${result.id}-${index}`}
                                onClick={() => handleSelect(result)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                            >
                                <div className="h-8 w-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                        {result.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {result.subtitle}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 capitalize shrink-0">
                                    {result.type}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
