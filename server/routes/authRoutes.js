import express from 'express';
import passport from 'passport';
import { completeSignup, loginUser,logout,updatePassword, deleteAccount, checkAuth, sendOtp,verifyOtp } from '../controllers/authController.js';
import protect  from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/complete-signup', completeSignup);
router.post('/login', loginUser);
router.post('/logout', logout);
router.put('/updatePassword', protect, updatePassword);
router.delete('/delete', protect, deleteAccount);
router.get('/check', protect, checkAuth);

//otp route
router.post('/send-otp', sendOtp );
router.post('/verify-otp', verifyOtp);


// Google OAuth login
 
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = req.user.token;
    const user = JSON.stringify(req.user.user);

    // Correct dynamic redirect using environment variable
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/google-auth?token=${token}&user=${encodeURIComponent(user)}`;

    res.redirect(redirectUrl);
  }
);





export default router;


