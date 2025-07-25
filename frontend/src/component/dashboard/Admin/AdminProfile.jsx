import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Current password validation states
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [currentPasswordValid, setCurrentPasswordValid] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // Success and error messages for profile updates
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Check if user needs to re-login
  const checkTokenValidity = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = Date.now() > payload.exp * 1000;
      
      if (isExpired) {
        alert("Your session has expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error parsing JWT:", error);
      alert("Invalid authentication token. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return false;
    }
  };

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const user = getUserData();

  const [profile, setProfile] = useState({
    email: user?.email || "admin@example.com",
    role: user?.role || "admin",
    avatar: user?.email?.charAt(0).toUpperCase() || "A",
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  // Update editedProfile when user data changes
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  // Validate current password in real-time
  const validateCurrentPassword = async (password) => {
    if (!password) {
      setCurrentPasswordError("");
      setCurrentPasswordValid(false);
      return;
    }

    if (password.length < 6) {
      setCurrentPasswordError("Password must be at least 6 characters long");
      setCurrentPasswordValid(false);
      return;
    }

    setIsCheckingPassword(true);
    setCurrentPasswordError("");

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `http://localhost:5000/users/test-password`,
        {
          currentPassword: password,
        },
        { headers }
      );
      
      if (response.data.passwordValid) {
        setCurrentPasswordValid(true);
        setCurrentPasswordError("");
      } else {
        setCurrentPasswordValid(false);
        setCurrentPasswordError("Current password is incorrect");
      }
    } catch (error) {
      setCurrentPasswordValid(false);
      if (error.response?.status === 401) {
        setCurrentPasswordError("Current password is incorrect");
      } else {
        setCurrentPasswordError("Unable to verify password. Please try again.");
      }
    } finally {
      setIsCheckingPassword(false);
    }
  };

  // Debounced password validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (passwordData.currentPassword) {
        validateCurrentPassword(passwordData.currentPassword);
      } else {
        setCurrentPasswordError("");
        setCurrentPasswordValid(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [passwordData.currentPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check token validity first
    if (!checkTokenValidity()) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Enhanced debugging
      console.log('=== PASSWORD UPDATE DEBUG ===');
      console.log('Token from localStorage:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('Full token:', token);
      console.log('Headers being sent:', headers);
      
      // Debug password details
      console.log('Raw current password:', passwordData.currentPassword);
      console.log('Current password length:', passwordData.currentPassword.length);
      console.log('Current password character codes:', [...passwordData.currentPassword].map(c => c.charCodeAt(0)));
      console.log('Trimmed current password:', passwordData.currentPassword.trim());
      console.log('Raw new password:', passwordData.newPassword);
      console.log('New password length:', passwordData.newPassword.length);
      
      console.log('Password data being sent:', {
        currentPassword: passwordData.currentPassword ? '***' : 'empty',
        newPassword: passwordData.newPassword ? '***' : 'empty'
      });

      // Handle email update if email has changed
      if (editedProfile.email !== profile.email) {
        try {
          await axios.patch(
            `http://localhost:5000/users/update-email`,
            { email: editedProfile.email },
            { headers }
          );
          console.log("Email updated to:", editedProfile.email);
          setProfileSuccess("Email updated successfully");
          setProfileError("");

          // Add note about refreshing manage admin page if email was changed
          if (editedProfile.email !== profile.email && profileSuccess) {
            setProfileSuccess(prev => prev + ". Note: Email changes will be visible in the Manage Admins page after refresh.");
          }
        } catch (error) {
          console.error("Error updating email:", error);
          setProfileError("Failed to update email. Please try again.");
          setProfileSuccess("");
          setIsLoading(false);
          return;
        }
      }

      // Note: Role updates are disabled - only email can be updated from this interface

    // Handle password change if fields are filled
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      // Reset messages
      setPasswordError("");
      setPasswordSuccess("");

        // Validate that all password fields are filled
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          setPasswordError("All password fields are required");
          setIsLoading(false);
        return;
      }

        // Validate new password length
      if (passwordData.newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters long");
          setIsLoading(false);
        return;
      }

      // Validate password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New passwords do not match");
          setIsLoading(false);
        return;
      }

      // Validate current password is correct
      if (!currentPasswordValid) {
        setPasswordError("Please enter the correct current password");
        setIsLoading(false);
        return;
      }

      // Don't submit if still checking password
      if (isCheckingPassword) {
        setPasswordError("Please wait while we verify your current password");
        setIsLoading(false);
        return;
      }

        try {
          await axios.patch(
            `http://localhost:5000/users/update-password`,
            {
              currentPassword: passwordData.currentPassword.trim(),
              newPassword: passwordData.newPassword.trim()
            },
            { headers }
          );
      setPasswordSuccess("Password changed successfully");
        } catch (error) {
          console.error("Error updating password:", error);
          console.error("Full error response:", error.response);
          console.error("Error status:", error.response?.status);
          console.error("Error data:", error.response?.data);
          
          // Show more specific error messages
          if (error.response) {
            const { status, data } = error.response;
            
            if (status === 401) {
              if (data?.message === 'No token provided') {
                setPasswordError("No authentication token found. Please log in again.");
              } else if (data?.message === 'Invalid token') {
                setPasswordError("Authentication token is invalid or expired. Please log in again.");
              } else {
                setPasswordError("Current password is incorrect. Please check if you're using the right password (including @ symbol).");
              }
            } else if (status === 400) {
              setPasswordError(data.message || "Invalid password format. New password must be at least 8 characters.");
            } else if (status === 404) {
              setPasswordError("User not found. Please log in again.");
            } else {
              setPasswordError(data.message || "Failed to update password. Please try again.");
            }
          } else if (error.request) {
            setPasswordError("Network error. Please check your connection and try again.");
          } else {
            setPasswordError("Failed to update password. Please check your current password.");
          }
          
          setIsLoading(false);
          return;
        }
    }

    // Update profile
    setProfile(editedProfile);

      // Update localStorage with new email and role if changed
      if (editedProfile.email !== profile.email) {
        const updatedUser = { 
          ...user, 
          email: editedProfile.email
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

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
      setProfileError("");
      setProfileSuccess("");
        setIsLoading(false);
    }, 3000); // Increased delay to 3 seconds to give user time to read the message

    } catch (error) {
      console.error("Error updating profile:", error);
      setPasswordError("Failed to update profile. Please try again.");
      setIsLoading(false);
    }
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
                {profile.email.split('@')[0]}
              </h3>
              <p className="text-gray-500 capitalize">{profile.role.replace('_', ' ')}</p>
              <p className="text-sm text-blue-600 font-medium">
                {profile.email}
              </p>
              <p className="text-sm text-green-600 font-medium capitalize">
                Role: {profile.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Email Address
              </label>
              <p className="text-black font-medium">{profile.email}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <label className="block text-sm font-medium text-green-700 mb-1">
                User Role
              </label>
              <p className="text-black font-medium capitalize">{profile.role.replace('_', ' ')}</p>
            </div>
           
          </div>

          <div className="pt-4 flex space-x-4">
            <button
              onClick={() => {
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
            
            {/* Temporary Debug Button */}
            <button
              onClick={async () => {
                const token = localStorage.getItem('access_token');
                const tempPassword = prompt('Enter your temporary password (the one from email):');
                if (!tempPassword) return;
                
                try {
                  const response = await fetch('http://localhost:5000/users/debug-current-password', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      currentPassword: tempPassword
                    })
                  });
                  const result = await response.json();
                  console.log('Password debug result:', result);
                  alert(`Password debug result: ${JSON.stringify(result, null, 2)}`);
                } catch (error) {
                  console.error('Debug error:', error);
                  alert('Debug error: ' + error.message);
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Debug Password
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
                    setProfileError("");
                    setProfileSuccess("");
                    setCurrentPasswordError("");
                    setCurrentPasswordValid(false);
                    setIsCheckingPassword(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile update success/error messages */}
                {profileSuccess && (
                  <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                    {profileSuccess}
                  </div>
                )}

                {profileError && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                    {profileError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      disabled={true}
                      className="w-full px-3 py-2 border rounded-md text-black bg-gray-100 cursor-not-allowed"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed from this interface</p>
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
                      <div className="relative">
                      <input
                          type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                          className={`w-full px-3 py-2 pr-10 border rounded-md text-black bg-white/90 backdrop-blur-sm ${
                            currentPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
                            currentPasswordValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : 
                            'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {/* Password validation feedback */}
                      {isCheckingPassword && (
                        <div className="mt-2 flex items-center text-blue-600 text-sm">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying password...
                        </div>
                      )}
                      
                      {currentPasswordValid && !isCheckingPassword && (
                        <div className="mt-2 flex items-center text-green-600 text-sm">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Password is correct
                        </div>
                      )}
                      
                      {currentPasswordError && !isCheckingPassword && (
                        <div className="mt-2 flex items-center text-red-600 text-sm">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {currentPasswordError}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                      <input
                          type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                          className="w-full px-3 py-2 pr-10 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                        minLength={8}
                        placeholder="Minimum 8 characters"
                      />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                      <input
                          type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                          className="w-full px-3 py-2 pr-10 border rounded-md text-black bg-white/90 backdrop-blur-sm"
                        minLength={8}
                        placeholder="Confirm your new password"
                      />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
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
                      setProfileError("");
                      setProfileSuccess("");
                      setCurrentPasswordError("");
                      setCurrentPasswordValid(false);
                      setIsCheckingPassword(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
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
