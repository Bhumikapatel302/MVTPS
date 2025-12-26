import React, { useState } from "react";

const PortsPage = () => {
  const [ports, setPorts] = useState([
    {
      id: 1,
      name: "Port of LA",
      location: "Los Angeles, CA",
      country: "USA",
      congestion_score: 65.5,
      avg_wait_time: 12.4,
      arrivals: 120,
      departures: 115,
      last_update: "2025-12-08T10:00:00Z",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    location: "",
    country: "",
    congestion_score: "",
    avg_wait_time: "",
    arrivals: "",
    departures: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newPort = {
      id: ports.length + 1,
      ...form,
      congestion_score: parseFloat(form.congestion_score) || 0,
      avg_wait_time: parseFloat(form.avg_wait_time) || 0,
      arrivals: parseInt(form.arrivals || "0", 10),
      departures: parseInt(form.departures || "0", 10),
      last_update: new Date().toISOString(),
    };
    setPorts((prev) => [...prev, newPort]);
    setForm({
      name: "",
      location: "",
      country: "",
      congestion_score: "",
      avg_wait_time: "",
      arrivals: "",
      departures: "",
    });
  };

  return (
    <div className="space-y-6 pb-6 bg-sky-50 rounded-3xl p-6 md:p-8 border border-sky-100 min-h-screen">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Port Management</h1>
        <p className="text-slate-500 font-medium">
          Monitor port congestion, wait times, and vessel traffic efficiency.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form
          onSubmit={handleAdd}
          className="col-span-1 bg-white rounded-2xl shadow p-4 space-y-3 border border-slate-100"
        >
          <h2 className="text-lg font-semibold">Add Port</h2>
          {[
            { id: "name", label: "Name" },
            { id: "location", label: "Location" },
            { id: "country", label: "Country" },
            { id: "congestion_score", label: "Congestion Score", type: "number", step: "0.1" },
            { id: "avg_wait_time", label: "Avg Wait Time (hrs)", type: "number", step: "0.1" },
            { id: "arrivals", label: "Arrivals", type: "number" },
            { id: "departures", label: "Departures", type: "number" },
          ].map((field) => (
            <label key={field.id} className="block text-sm font-medium text-slate-700">
              {field.label}
              <input
                name={field.id}
                type={field.type || "text"}
                step={field.step}
                value={form[field.id]}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={["name", "location", "country"].includes(field.id)}
              />
            </label>
          ))}
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 text-white py-2 font-semibold hover:bg-teal-700 transition"
          >
            Add Port
          </button>
        </form>

        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Port Operations List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Country</th>
                  <th className="py-3 px-4 font-semibold">Congestion</th>
                  <th className="py-3 px-4 font-semibold">Avg Wait</th>
                  <th className="py-3 px-4 font-semibold">Traffic</th>
                  <th className="py-3 px-4 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ports.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.location}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs bg-slate-100 rounded px-1">{p.country}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.congestion_score > 80 ? 'bg-red-50 text-red-700' : p.congestion_score > 50 ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                        {p.congestion_score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.avg_wait_time}h</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      <div>In: {p.arrivals}</div>
                      <div>Out: {p.departures}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {p.last_update ? new Date(p.last_update).toLocaleDateString() : "-"}
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

export default PortsPage;

