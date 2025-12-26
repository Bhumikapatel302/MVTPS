import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map route segments to readable labels
    const routeLabels = {
        'admin': 'Admin',
        'dashboard': 'Dashboard',
        'vessels': 'Vessels',
        'ports': 'Ports',
        'voyages': 'Voyages',
        'live-tracking': 'Live Tracking',
        'events': 'Events',
        'notifications': 'Notifications',
        'profile': 'Profile',
        'edit': 'Edit',
    };

    const getLabel = (segment) => {
        return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    };

    if (pathnames.length === 0) {
        return null; // Don't show breadcrumbs on home page
    }

    return (
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 py-3 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
            <Link
                to="/"
                className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
            </Link>

            {pathnames.map((segment, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                return (
                    <React.Fragment key={routeTo}>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                        {isLast ? (
                            <span className="font-medium text-primary-600 dark:text-primary-400">
                                {getLabel(segment)}
                            </span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                {getLabel(segment)}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
