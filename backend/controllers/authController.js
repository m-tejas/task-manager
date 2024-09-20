require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user
    await user.save();

    // Generate JWT token
    const token = generateToken(user.id);

    // Respond with token and user data
    res.json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Respond with token and user data
    res.json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Google OAuth strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        // If user does not exist, create a new one
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
          await user.save();
        }

        // Generate JWT token for the user (existing or new)
        const token = generateToken(user._id);
        return done(null, { token, user });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Google authentication route handler
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google authentication callback handler
const googleAuthCallback = (req, res) => {
  // Passport sets the user in req.user after authentication
  const { token } = req.user;

  // Redirect user to dashboard with the token
  res.redirect(`/dashboard?token=${token}`);
};

module.exports = { googleAuth, googleAuthCallback };
