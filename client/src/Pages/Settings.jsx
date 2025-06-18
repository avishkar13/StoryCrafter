import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import authStore from '../store/authStore';

const Settings = () => {
  const { authUser, logout, updatePassword, deleteAccount, loading, error } = authStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  // Variants for modals
  const modalVariant = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } }
  };

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  // Variants for password field animation
  const passwordFieldVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      setValidationError('Please fill in both current and new password.');
      setSuccessMessage(''); // Clear success message on validation error
      return;
    }

    setValidationError('');
    setSuccessMessage(''); // Clear previous messages
    await updatePassword(currentPassword, newPassword);

    // Get the latest state after the async operation
    const currentError = authStore.getState().error;

    if (!currentError) {
      setSuccessMessage('✅ Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      // Optionally hide password fields after successful update,
      // but keep them visible if there was an error for user to retry.
      setTimeout(() => setShowPasswordField(false), 2000); // Hide after a delay
    } else {
        setSuccessMessage(''); // Ensure success message is cleared if there's an error
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    await deleteAccount();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-blue-700 mb-6"
      >
        ⚙️ Account Settings
      </motion.h2>

      <div className="space-y-8 bg-white p-6 rounded-xl shadow-md border">
        {/* Profile Info */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">👤 Profile</h3>
          <p className="text-gray-700 mb-2">Name: <span className="font-medium">{authUser?.name}</span></p>
          <p className="text-gray-700">Email: <span className="font-medium">{authUser?.email}</span></p>
        </section>

        {/* Update Password */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🔐 Security</h3>
          {!showPasswordField ? (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => {
                setShowPasswordField(true);
                setValidationError(''); // Clear validation error when showing fields
                setSuccessMessage(''); // Clear success message when showing fields
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Update Password
            </motion.button>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={passwordFieldVariants}
              className="space-y-4 overflow-hidden" // Added overflow-hidden to prevent layout shift during height animation
            >
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              {validationError && <p className="text-red-600 text-sm">{validationError}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordField(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setValidationError('');
                    setSuccessMessage(''); // Also clear success message when canceling
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Logout & Delete */}
        <section className="pt-4 border-t">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-blue-600 font-medium hover:underline mr-4"
          >
            Logout
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 font-medium hover:underline"
          >
            Delete My Account
          </button>
        </section>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowLogoutModal(false)} // Close when clicking outside
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h3 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h3>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowLogoutModal(false)} className="text-gray-600 hover:underline">
                  Cancel
                </button>
                <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowDeleteModal(false)} // Close when clicking outside
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h3 className="text-lg font-semibold mb-4 text-red-600">This action is irreversible.</h3>
              <p className="text-gray-700 mb-4">Do you really want to permanently delete your account?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-600 hover:underline">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;