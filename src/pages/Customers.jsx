// src/pages/Customers.jsx
import React, { useState } from "react";

const Customers = ({ customers, setCustomers }) => {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });

  // Filtered list based on search
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Edit existing customer
  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditedCustomer({ ...customer });
  };

  const handleSave = (id) => {
    const updated = customers.map((c) => (c.id === id ? editedCustomer : c));
    setCustomers(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  // Add new customer
  const handleAdd = () => {
    if (!newCustomer.name || !newCustomer.email) return;
    const id = customers.length
      ? Math.max(...customers.map((c) => c.id)) + 1
      : 1;
    setCustomers([...customers, { ...newCustomer, id }]);
    setNewCustomer({ name: "", email: "" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Customers Management
      </h2>

      {/* Add New Customer */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Name"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Customer
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 w-full sm:w-1/2 dark:bg-gray-800 dark:text-gray-100"
      />

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3 text-gray-900 dark:text-gray-100">Name</th>
              <th className="p-3 text-gray-900 dark:text-gray-100">Email</th>
              <th className="p-3 text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {editingId === customer.id ? (
                    <input
                      type="text"
                      value={editedCustomer.name}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          name: e.target.value,
                        })
                      }
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100"
                    />
                  ) : (
                    customer.name
                  )}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {editingId === customer.id ? (
                    <input
                      type="email"
                      value={editedCustomer.email}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          email: e.target.value,
                        })
                      }
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100"
                    />
                  ) : (
                    customer.email
                  )}
                </td>
                <td className="p-3 space-x-2">
                  {editingId === customer.id ? (
                    <button
                      onClick={() => handleSave(customer.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(customer)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="p-5 text-center text-gray-500 dark:text-gray-400"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
