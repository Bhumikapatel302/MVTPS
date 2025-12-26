import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Anchor, Map, Bell, Activity, Layers, ArrowRight } from 'lucide-react';

const Dashboard = ({ title }) => {
    const cards = [
        {
            title: 'Vessels',
            count: '12',
            desc: 'Fleet overview & status',
            to: '/vessels',
            icon: Ship,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Ports',
            count: '5',
            desc: 'Congestion & schedules',
            to: '/ports',
            icon: Anchor,
            color: 'text-teal-600',
            bg: 'bg-teal-50'
        },
        {
            title: 'Voyages',
            count: '8',
            desc: 'Active routes',
            to: '/voyages',
            icon: Map,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            title: 'Events',
            count: '3',
            desc: 'Operational updates',
            to: '/events',
            icon: Activity,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            title: 'Notifications',
            count: '9+',
            desc: 'Alerts & warnings',
            to: '/notifications',
            icon: Bell,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        {
            title: 'Live Tracking',
            count: 'Active',
            desc: 'Real-time monitoring',
            to: '/live-tracking',
            icon: Layers,
            color: 'text-violet-600',
            bg: 'bg-violet-50'
        },
    ];

    return (
        <div className="w-full bg-sky-50 rounded-3xl p-6 md:p-10 shadow-2xl border border-sky-100 backdrop-blur-sm">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {title || "Overview"}
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold border border-slate-200">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats/Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.to}
                        className="group relative bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1 block overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3.5 rounded-xl ${card.bg} ${card.color} transition-transform group-hover:scale-110 duration-300`}>
                                <card.icon size={26} strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                                <ArrowRight size={14} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium">
                                {card.desc}
                            </p>
                        </div>

                        {/* Decorative background element */}
                        <div className={`absolute -bottom-4 -right-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500`}>
                            <card.icon size={120} className="text-black transform rotate-12" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Stats or Graph Placeholder (Optional) */}
            <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-900">System Status</h4>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            All Systems Operational
                        </div>
                    </div>
                </div>
                {/* Simple visual bar for aesthetic */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-900 w-[70%]" title="Server Load"></div>
                    <div className="h-full bg-slate-300 w-[15%]" title="Memory"></div>
                    <div className="h-full bg-slate-200 w-[15%]" title="Idle"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
