import { useState } from "react";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      department: "Human Resources",
      role: "HR Manager",
      employeeId: "HR001",
      status: "Active",
      password: "********",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      department: "Recruitment",
      role: "Recruitment Manager",
      employeeId: "RC001",
      status: "Active",
      password: "********",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@example.com",
      department: "Administration",
      role: "Admin Manager",
      employeeId: "AD001",
      status: "Active",
      password: "********",
    },
  ]);

  const departments = [
    "Human Resources",
    "Recruitment",
    "Administration",
    "IT Support",
  ];

  const roles = {
    "Human Resources": ["HR Manager", "HR Officer", "HR Assistant"],
    Recruitment: [
      "Recruitment Manager",
      "Recruitment Officer",
      "Talent Acquisition Specialist",
    ],
    Administration: ["Admin Manager", "Admin Officer", "System Administrator"],
    "IT Support": ["IT Manager", "Support Specialist", "Technical Officer"],
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    department: "Human Resources",
    role: "HR Officer",
    employeeId: "",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleAddAdmin = (e) => {
    e.preventDefault();

    if (newAdmin.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const admin = {
      id: admins.length + 1,
      ...newAdmin,
      password: "********",
      employeeId: `${newAdmin.department.substring(0, 2).toUpperCase()}${(
        admins.length + 1
      )
        .toString()
        .padStart(3, "0")}`,
    };
    setAdmins([...admins, admin]);
    setNewAdmin({
      name: "",
      email: "",
      department: "Human Resources",
      role: "HR Officer",
      employeeId: "",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowAddForm(false);
  };

  const removeAdmin = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Manage Staff</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Staff
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-black mb-4">
            Add New Staff Member
          </h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Department
                </label>
                <select
                  value={newAdmin.department}
                  onChange={(e) => {
                    const newDepartment = e.target.value;
                    setNewAdmin({
                      ...newAdmin,
                      department: newDepartment,
                      role: roles[newDepartment][0],
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  {roles[newAdmin.department].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newAdmin.confirmPassword}
                  onChange={(e) =>
                    setNewAdmin({
                      ...newAdmin,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setPasswordError("");
                }}
                className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Staff
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {admin.password}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admin.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <button
                      onClick={() => removeAdmin(admin.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
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
