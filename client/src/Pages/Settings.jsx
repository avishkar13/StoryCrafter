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

  const passwordFieldVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      setValidationError('Please fill in both current and new password.');
      setSuccessMessage('');
      return;
    }

    setValidationError('');
    setSuccessMessage('');
    await updatePassword(currentPassword, newPassword);

    const currentError = authStore.getState().error;

    if (!currentError) {
      setSuccessMessage('✅ Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setShowPasswordField(false), 2000);
    } else {
      setSuccessMessage('');
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
    <div className="py-6 px-0 md:p-6 max-w-3xl mx-auto text-white">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-indigo-400 mb-6"
      >
        ⚙️ Settings
      </motion.h2>

      <div className="space-y-8 bg-gradient-to-tr from-[#1a1a40] to-[#0c0c2f] p-6 rounded-xl shadow-md border border-indigo-800">
        {/* Profile Info */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">👤 Profile</h3>
          <p className="mb-2 text-indigo-100">Name: <span className="font-medium text-white">{authUser?.name}</span></p>
          <p className="text-indigo-100">Email: <span className="font-medium text-white">{authUser?.email}</span></p>
        </section>

        {/* Update Password */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">🔐 Security</h3>
          {!showPasswordField ? (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setShowPasswordField(true);
                setValidationError('');
                setSuccessMessage('');
              }}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Update Password
            </motion.button>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={passwordFieldVariants}
              className="space-y-4 overflow-hidden"
            >
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 bg-[#0f0f0f] border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-[#0f0f0f] border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              />

              {validationError && <p className="text-red-400 text-sm">{validationError}</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordField(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setValidationError('');
                    setSuccessMessage('');
                  }}
                  className="text-indigo-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Logout & Delete */}
        <section className="pt-4 border-t border-indigo-700">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-blue-400 font-medium hover:underline mr-4"
          >
            Logout
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 font-medium hover:underline"
          >
            Delete My Account
          </button>
        </section>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              className="bg-[#0f0f0f] p-6 rounded-lg border border-indigo-700 shadow-md w-[80vw] max-w-md text-white"
              variants={modalVariant}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Are you sure you want to logout?</h3>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowLogoutModal(false)} className="text-indigo-400 hover:underline">Cancel</button>
                <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-[#0f0f0f] p-6 rounded-lg border border-red-700 shadow-md w-[80vw] max-w-md text-white"
              variants={modalVariant}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-red-500">This action is irreversible.</h3>
              <p className="text-sm text-gray-300 mb-4">Do you really want to permanently delete your account?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="text-indigo-400 hover:underline">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
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
