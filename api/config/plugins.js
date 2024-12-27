const { register } = require("../src");

module.exports = {
  'users-permissions': {
    enabled: true,
    config: {
      register: {
        allowedFields: ['username', 'email', 'password', 'firstname', 'lastname', 'phone'], // Include the fields you want to allow
      },
      jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key',  // Optional, if you want to set a custom JWT secret
    }
  }
};
