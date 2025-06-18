import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
    async (accessToken, refreshToken, profile, done) => {
      const { displayName, emails } = profile;
      const email = emails[0].value;

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: displayName,
          email,
          password: null,
          isVerified: true,
          googleId: profile.id
        });
      }

      const jwtToken = generateToken(user._id);
      done(null, { token: jwtToken, user });
    })
);
