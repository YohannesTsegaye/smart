import { useState } from "react";

const AdminProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "HR Manager",
    department: "Human Resources",
    phone: "+1 (123) 456-7890",
    avatar: "A",
    designation: "Senior HR Officer",
    employeeId: "HR001",
  });

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

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle password change if fields are filled
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      // Reset messages
      setPasswordError("");
      setPasswordSuccess("");

      // Validate current password (this is a mock check - replace with actual validation)
      if (passwordData.currentPassword !== "admin123") {
        setPasswordError("Current password is incorrect");
        return;
      }

      // Validate new password
      if (passwordData.newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters long");
        return;
      }

      // Validate password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }

      // Password change success
      setPasswordSuccess("Password changed successfully");
    }

    // Update profile
    setProfile(editedProfile);

    // Show success message and close modal after a short delay
    setTimeout(() => {
      setShowModal(false);
      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
      setPasswordSuccess("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 backdrop-blur-sm">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-bold text-black">Staff Profile</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
              {profile.avatar}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black">
                {profile.name}
              </h3>
              <p className="text-gray-500">{profile.designation}</p>
              <p className="text-sm text-blue-600">
                {profile.department} - {profile.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-black">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <p className="mt-1 text-black">{profile.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <p className="mt-1 text-black">{profile.employeeId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <p className="mt-1 text-black">{profile.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-black">{profile.role}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Update Profile Modal with Password Change */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Profile
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditedProfile(profile);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={editedProfile.employeeId}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={editedProfile.department}
                      onChange={(e) => {
                        const newDepartment = e.target.value;
                        setEditedProfile({
                          ...editedProfile,
                          department: newDepartment,
                          role: roles[newDepartment][0],
                        });
                      }}
                      className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={editedProfile.role}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          role: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                    >
                      {roles[editedProfile.department].map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h4>

                  {passwordError && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-lg mb-4">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                        minLength={8}
                        placeholder="Minimum 8 characters"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                        minLength={8}
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditedProfile(profile);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
