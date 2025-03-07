const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// In-memory storage for users (this can be replaced with a JSON file for persistence)
let users = [];

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// User model
class User {
  constructor({ name, email, password, passwordConfirm, photo = 'default.jpg', role = 'user' }) {
    this.id = users.length + 1; // Simple ID generation for example
    this.name = name;
    this.email = email.toLowerCase();
    this.photo = photo;
    this.role = role;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
    this.passwordChangedAt = null;
    this.PasswordResetToken = null;
    this.PasswordResetExpires = null;
    this.active = true;

    this.validateEmail();
    this.hashPassword();
  }

  // Validate email using the validator library
  validateEmail() {
    if (!validator.isEmail(this.email)) {
      throw new Error('Please provide a valid email');
    }
  }

  // Hash password if the password is modified
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
      this.passwordConfirm = undefined;  // Remove passwordConfirm after hashing
    }
  }

  // Compare candidate password with the stored hashed password
  async correctPassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Method to change the password after a JWT is issued
  changedPasswordAfter(JWTtimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTtimestamp < changedTimestamp;
    }
    return false; // Password not changed
  }

  // Create password reset token
  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.PasswordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.PasswordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    return resetToken;
  }

  // Save user to in-memory storage (this is just an example, replace with file storage or DB if needed)
  save() {
    // Check if email already exists in users array
    const existingUser = findUserByEmail(this.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    users.push(this);
    return this;
  }

  // Static method to get user by email
  static findByEmail(email) {
    return findUserByEmail(email);
  }

  // Static method to get all active users
  static getAllActiveUsers() {
    return users.filter(user => user.active);
  }

  // Static method to deactivate user
  static deactivateUser(email) {
    const user = findUserByEmail(email);
    if (user) {
      user.active = false;
      return true;
    }
    return false;
  }
}

// Example usage:
// Creating a new user
try {
  const newUser = new User({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    passwordConfirm: 'password123'
  });

  newUser.save();
  console.log('User created successfully:', newUser);

  // Check if the user's password is correct
  const isPasswordCorrect = newUser.correctPassword('password123');
  console.log('Password match:', isPasswordCorrect);

  // Create password reset token
  const resetToken = newUser.createPasswordResetToken();
  console.log('Password reset token:', resetToken);

  // Deactivate user
  User.deactivateUser('john.doe@example.com');
  console.log('User deactivated:', User.findByEmail('john.doe@example.com'));

} catch (err) {
  console.log('Error:', err.message);
}

module.exports = User;
