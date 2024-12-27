'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, firstname, lastname, phone } = ctx.request.body;

    // Log the incoming request data
    strapi.log.info('Registration request received', { username, email, firstname, lastname, phone });

    // Validate required fields
    if (!username || !email || !password || !firstname || !lastname || !phone) {
      strapi.log.error('Validation failed: Missing required fields');
      return ctx.badRequest('All fields are required');
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
      strapi.log.error('Error occurred during registration', { error });
      return ctx.internalServerError('Something went wrong, please try again later');
    }
  },
};
