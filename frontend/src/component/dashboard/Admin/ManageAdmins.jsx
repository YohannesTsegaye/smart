import { useState, useEffect } from "react";
import axios from "axios";

const ManageAdmins = () => {
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const currentUser = getCurrentUser();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    role: "admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/users/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data);
    } catch (error) {
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [isSuperAdmin]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        "http://localhost:5000/users/add-admin",
        {
          email: newAdmin.email,
          role: newAdmin.role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitSuccess(`Admin added successfully! A temporary password has been sent to their email.`);
      setNewAdmin({ email: "", role: "admin" });
      setShowAddForm(false);
      fetchAdmins();
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to add admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    // Prevent super admin from deactivating themselves
    if (adminId === currentUser?.id) {
      alert("You cannot deactivate your own account. Please contact another super admin.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

      await axios.patch(
        `http://localhost:5000/users/toggle-admin-status/${adminId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmins(admins.map(admin => 
        admin.id === adminId ? { ...admin, status: newStatus } : admin
      ));
    } catch (error) {
      alert("Failed to update admin status");
    }
  };

  const removeAdmin = async (adminId) => {
    // Prevent super admin from removing themselves
    if (adminId === currentUser?.id) {
      alert("You cannot remove your own account. Please contact another super admin.");
      return;
    }

    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:5000/users/remove-admin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      alert("Failed to remove admin");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only Super Admins can manage other admins.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Manage Admins</h1>
        <div className="flex space-x-3">
          <button
            onClick={fetchAdmins}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Refresh admin list"
          >
            🔄 Refresh
          </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Admin
        </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-black mb-4">Add New Admin</h2>
          
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{submitError}</div>
          )}
          
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{submitSuccess}</div>
          )}

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
                </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Password Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• A temporary password will be auto-generated (8 digits starting with "SR")</li>
                <li>• The password will be sent to the admin's email address</li>
                <li>• The temporary password expires after 24 hours</li>
                <li>• Admin must change password on first login</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setSubmitError("");
                  setSubmitSuccess("");
                }}
                className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-black uppercase tracking-wider text-xs">Employee ID</th>
                <th className="px-6 py-3 text-left font-medium text-black uppercase tracking-wider text-xs">Email (Current/Previous)</th>
                <th className="px-6 py-3 text-left font-medium text-black uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-3 text-left font-medium text-black uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-3 text-left font-medium text-black uppercase tracking-wider text-xs">Created At</th>
                <th className="px-6 py-3 text-left font-medium text-black uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.employeeId || `ADM${admin.id.toString().padStart(3, "0")}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <div>
                      <div className="font-medium">{admin.email}</div>
                      {admin.previousEmail && (
                        <div className="text-xs text-gray-500 mt-1">
                          Previous: {admin.previousEmail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <span className="capitalize">{admin.role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAdminStatus(admin.id, admin.status)}
                      disabled={admin.id === currentUser?.id}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        admin.id === currentUser?.id
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : admin.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                      title={admin.id === currentUser?.id ? "You cannot change your own status" : ""}
                    >
                      {admin.status}
                      {admin.id === currentUser?.id && " (You)"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <button
                      onClick={() => removeAdmin(admin.id)}
                      disabled={admin.id === currentUser?.id}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 ${
                        admin.id === currentUser?.id
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-700"
                      }`}
                      title={admin.id === currentUser?.id ? "You cannot remove your own account" : ""}
                    >
                      {admin.id === currentUser?.id ? "Remove (You)" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
