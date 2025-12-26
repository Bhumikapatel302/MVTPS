import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Ship,
    Anchor,
    Route,
    Radio,
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vessels', label: 'Vessels', icon: Ship },
    { to: '/ports', label: 'Ports', icon: Anchor },
    { to: '/voyages', label: 'Voyages', icon: Route },
    { to: '/live-tracking', label: 'Live Tracking', icon: Radio },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/notifications', label: 'Notifications', icon: Bell },
];

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Save collapsed state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col fixed left-0 top-[70px] bottom-0 bg-white border-r border-slate-200 transition-all duration-300 z-20 ${isCollapsed ? 'w-16' : 'w-64'
                    }`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 h-6 w-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-3 w-3" />
                    ) : (
                        <ChevronLeft className="h-3 w-3" />
                    )}
                </button>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {!isCollapsed && (
                                    <span className="font-medium truncate">{item.label}</span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Spacer for main content */}
            <div className={`hidden md:block transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} />
        </>
    );
};

export default Sidebar;
