import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Debug logs (VERY IMPORTANT for troubleshooting)
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists with Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 2. Get email from Google profile
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : null;

        // 3. Check if user exists with same email (account linking)
        if (email) {
          const normalizedEmail = email.toLowerCase().trim();

          user = await User.findOne({ email: normalizedEmail });

          if (user) {
            user.googleId = profile.id;

            if (!user.profilePicture && profile.photos && profile.photos[0]) {
              user.profilePicture = profile.photos[0].value;
            }

            await user.save();
            return done(null, user);
          }
        }

        // 4. Create new user if not found
        const profilePicture =
          profile.photos && profile.photos[0]
            ? profile.photos[0].value
            : '';

        user = await User.create({
          name: profile.displayName || 'Google User',
          email: email ? email.toLowerCase() : `${profile.id}@google.local`,
          googleId: profile.id,
          profilePicture,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;