import React, { useState } from "react";

const EventsPage = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      vessel_id: 1,
      event_type: "arrival",
      location: "Port of LA",
      timestamp: "2025-12-08T09:30:00Z",
      details: "Arrived on schedule",
    },
  ]);

  const [form, setForm] = useState({
    vessel_id: "",
    event_type: "arrival",
    location: "",
    timestamp: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      ...form,
    };
    setEvents((prev) => [...prev, newEvent]);
    setForm({
      vessel_id: "",
      event_type: "arrival",
      location: "",
      timestamp: "",
      details: "",
    });
  };

  return (
    <div className="space-y-6 pb-6 bg-sky-50 rounded-3xl p-6 md:p-8 border border-sky-100 min-h-screen">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vessel Events</h1>
        <p className="text-slate-500 font-medium">
          Log and monitor vessel occurrences, arrivals, and operational incidents.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form
          onSubmit={handleAdd}
          className="col-span-1 bg-white rounded-2xl shadow p-4 space-y-3 border border-slate-100"
        >
          <h2 className="text-lg font-semibold">Add Event</h2>
          {[
            { id: "vessel_id", label: "Vessel ID" },
            { id: "location", label: "Location" },
            { id: "timestamp", label: "Timestamp", type: "datetime-local" },
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
            Event Type
            <select
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["arrival", "departure", "maintenance", "inspection", "incident", "other"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Details
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 text-white py-2 font-semibold hover:bg-teal-700 transition"
          >
            Add Event
          </button>
        </form>

        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Event Logs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4 font-semibold">Vessel</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600">ID #{ev.vessel_id}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${ev.event_type === 'incident' ? 'bg-red-50 text-red-700' :
                        ev.event_type === 'arrival' ? 'bg-green-50 text-green-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                        {ev.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{ev.location}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : "-"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic text-sm">{ev.details || "-"}</td>
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

export default EventsPage;