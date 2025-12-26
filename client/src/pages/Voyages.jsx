import React, { useState } from "react";

const VoyagesPage = () => {
  const [voyages, setVoyages] = useState([
    {
      id: 1,
      vessel_id: 1,
      port_from: 1,
      port_to: 2,
      departure_time: "2025-12-10T08:00:00Z",
      arrival_time: "2025-12-15T14:00:00Z",
      status: "scheduled",
    },
  ]);

  const [form, setForm] = useState({
    vessel_id: "",
    port_from: "",
    port_to: "",
    departure_time: "",
    arrival_time: "",
    status: "scheduled",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newVoyage = {
      id: voyages.length + 1,
      ...form,
    };
    setVoyages((prev) => [...prev, newVoyage]);
    setForm({
      vessel_id: "",
      port_from: "",
      port_to: "",
      departure_time: "",
      arrival_time: "",
      status: "scheduled",
    });
  };

  return (
    <div className="space-y-6 pb-6 bg-sky-50 rounded-3xl p-6 md:p-8 border border-sky-100 min-h-screen">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Voyage Schedules</h1>
        <p className="text-slate-500 font-medium">
          Plan, track, and manage active vessel voyages and routes.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form
          onSubmit={handleAdd}
          className="col-span-1 bg-white rounded-2xl shadow p-4 space-y-3 border border-slate-100"
        >
          <h2 className="text-lg font-semibold">Add Voyage</h2>
          {[
            { id: "vessel_id", label: "Vessel ID" },
            { id: "port_from", label: "Port From (ID)" },
            { id: "port_to", label: "Port To (ID)" },
            { id: "departure_time", label: "Departure Time", type: "datetime-local" },
            { id: "arrival_time", label: "Arrival Time", type: "datetime-local" },
          ].map((field) => (
            <label key={field.id} className="block text-sm font-medium text-slate-700">
              {field.label}
              <input
                name={field.id}
                type={field.type || "text"}
                value={form[field.id]}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
          ))}
          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["scheduled", "in_progress", "completed", "cancelled"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 text-white py-2 font-semibold hover:bg-teal-700 transition"
          >
            Add Voyage
          </button>
        </form>

        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Active Voyages</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4 font-semibold">Vessel</th>
                  <th className="py-3 px-4 font-semibold">Route</th>
                  <th className="py-3 px-4 font-semibold">Departure</th>
                  <th className="py-3 px-4 font-semibold">Arrival (Est)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voyages.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600">ID #{v.vessel_id}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded">{v.port_from}</span>
                      <span className="mx-2 text-slate-400">→</span>
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded">{v.port_to}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {v.departure_time ? new Date(v.departure_time).toLocaleString() : "-"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {v.arrival_time ? new Date(v.arrival_time).toLocaleString() : "-"}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${v.status === 'scheduled' ? 'bg-yellow-50 text-yellow-700' :
                        v.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                          v.status === 'completed' ? 'bg-green-50 text-green-700' :
                            'bg-red-50 text-red-700'
                        }`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VoyagesPage;