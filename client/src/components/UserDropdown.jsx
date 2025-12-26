import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

const UserDropdown = ({ user, onLogout, isLoggingOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white grid place-items-center font-semibold">
                    {user?.username ? user.username.slice(0, 2).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Signed in</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                        {user?.username || "User"}
                    </p>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl py-2 text-sm z-50 animate-slide-down">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {user?.email || user?.username || "User"}
                        </p>
                    </div>

                    <NavLink
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                        <User className="h-4 w-4" />
                        View Profile
                    </NavLink>

                    <NavLink
                        to="/profile/edit"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </NavLink>

                    <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            disabled={isLoggingOut}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
