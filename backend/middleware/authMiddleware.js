const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Decode the token to extract the user ID
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    // Retrieve the user from the database using the ID from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }

    // Verify the token using the user's secret
    jwt.verify(token, user.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }

      // Attach the user info to the request object
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
