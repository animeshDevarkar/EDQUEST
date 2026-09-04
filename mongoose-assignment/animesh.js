/**
 * Mongoose ODM Demonstration Script
 * Author: Animesh N Devarkar
 * File: animesh.js
 * 
 * Demonstrates:
 * 1. Schema Definition with rich Data Types
 * 2. Built-in and Custom Validations
 * 3. Pre-save Middleware (Hooks)
 * 4. Schema Virtuals & Methods
 * 5. Document Validation without requiring live DB connection
 */

const mongoose = require('mongoose');

// 1. User Schema Definition by Animesh N Devarkar
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  role: {
    type: String,
    enum: ['Student', 'Developer', 'Instructor', 'Admin'],
    default: 'Student'
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18 years old'],
    max: [100, 'Age cannot exceed 100']
  },
  skills: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 2. Pre-validate Middleware Example: Format full name before saving
userSchema.pre('validate', function(next) {
  if (this.fullName) {
    this.fullName = this.fullName.replace(/\s+/g, ' ');
  }
  if (typeof next === 'function') next();
});

// 3. Virtual Property Example
userSchema.virtual('profileSummary').get(function() {
  return `${this.fullName} (${this.role}) - Skills: ${this.skills.join(', ') || 'None'}`;
});

// Create Mongoose Model
const User = mongoose.model('User', userSchema);

// Demonstration function
async function runValidationDemo() {
  console.log('=== Mongoose ODM Demonstration by Animesh N Devarkar ===\n');

  // Test 1: Valid User Object Creation
  const validUser = new User({
    fullName: 'Animesh N Devarkar',
    email: 'animesh@example.com',
    role: 'Developer',
    age: 24,
    skills: ['MongoDB', 'Mongoose', 'Node.js', 'Express']
  });

  try {
    await validUser.validate();
    console.log('✔ Test 1 Passed: Valid User instance successfully validated!');
    console.log('  Profile Summary Virtual:', validUser.profileSummary);
    console.log('  Normalized Email:', validUser.email);
    console.log('  Transformed Object:', JSON.stringify(validUser.toJSON(), null, 2));
  } catch (validErr) {
    console.error('❌ Test 1 Failed:', validErr.message);
  }

  console.log('\n--------------------------------------------------\n');

  // Test 2: Invalid User Object (Trigger Built-in Validations)
  const invalidUser = new User({
    fullName: 'An',
    email: 'invalid-email-format',
    role: 'SuperUser', // Not in enum
    age: 15 // Below min 18
  });

  try {
    await invalidUser.validate();
    console.error('❌ Test 2 Failed: Invalid user unexpectedly passed validation!');
  } catch (invalidErr) {
    console.log('✔ Test 2 Passed: Mongoose Built-in Validation correctly caught errors:');
    Object.keys(invalidErr.errors).forEach((key) => {
      console.log(`  - Field "${key}": ${invalidErr.errors[key].message}`);
    });
  }
}

runValidationDemo();
