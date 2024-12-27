'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, firstname, lastname, phone } = ctx.request.body;

    // Log the incoming registration data
    strapi.log.debug('Registration request received', { username, email, firstname, lastname, phone });

    // Validate required fields
    if (!username || !email || !password || !firstname || !lastname || !phone) {
      strapi.log.error('Validation failed: Missing required fields', { requestBody: ctx.request.body });
      return ctx.badRequest('All fields are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      strapi.log.error('Validation failed: Invalid email format', { email });
      return ctx.badRequest('Invalid email format');
    }

    // Check if email already exists
    try {
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email },
      });

      if (existingUser) {
        strapi.log.warn('Email already exists', { email });
        return ctx.badRequest('Email is already taken');
      }

      // Create new user
      const user = await strapi.plugins['users-permissions'].services.user.add({
        username,
        email,
        password,
        firstname,
        lastname,
        phone,
      });

      // Log the successful user creation
      strapi.log.info('User created successfully', { user: { id: user.id, email: user.email } });

      return ctx.send({ user });
    } catch (error) {
      // Log any unexpected errors
      strapi.log.error('Error occurred during registration', { error: error.message, stack: error.stack });
      return ctx.internalServerError('Something went wrong, please try again later');
    }
  },

  async local(ctx) {
    const { identifier, password } = ctx.request.body;

    // Log the incoming login request
    strapi.log.debug('Login request received', { identifier });

    if (!identifier || !password) {
      strapi.log.error('Login failed: Missing credentials');
      return ctx.badRequest('Identifier (email/username) and password are required');
    }

    try {
      const user = await strapi.plugins['users-permissions'].services.user.fetch({
        where: { email: identifier },
      });

      if (!user) {
        strapi.log.warn('Login failed: User not found', { identifier });
        return ctx.badRequest('Invalid credentials');
      }

      const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
        password,
        user.password
      );

      if (!validPassword) {
        strapi.log.warn('Login failed: Incorrect password', { identifier });
        return ctx.badRequest('Invalid credentials');
      }

      // Log successful login
      strapi.log.info('User logged in successfully', { user: { id: user.id, email: user.email } });

      // Issue JWT token
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      return ctx.send({ jwt });
    } catch (error) {
      // Log any unexpected errors
      strapi.log.error('Error occurred during login', { error: error.message, stack: error.stack });
      return ctx.internalServerError('Something went wrong, please try again later');
    }
  },
};
