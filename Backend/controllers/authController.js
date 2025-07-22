import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse, createdResponse } from '../utils/response.js';
import { sanitizeUser } from '../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return createdResponse(res, {
      user: sanitizeUser(user),
      token
    }, 'User registered successfully');

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated. Please contact support.', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return successResponse(res, {
      user: sanitizeUser(user),
      token
    }, 'Login successful');

  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, sanitizeUser(user), 'Profile retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        return errorResponse(res, 'Email is already taken', 400);
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, sanitizeUser(user), 'Profile updated successfully');

  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user with password
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return successResponse(res, null, 'Password changed successfully');

  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Soft delete - deactivate account
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, null, 'Account deactivated successfully');

  } catch (error) {
    next(error);
  }
};
