import cron from 'node-cron';
import User from './models/User.js'; 

// Runs every hour
cron.schedule('0 * * * *', async () => {
  try {
    const result = await User.deleteMany({
      isVerified: false,
      otpExpiresAt: { $lt: new Date() },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} unverified users`);
    }
  } catch (err) {
    console.error('Cleanup failed:', err.message);
  }
});
