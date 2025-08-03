const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  }
});

mealSchema.index({ userId: 1, date: 1 });
mealSchema.index({ userId: 1, mealType: 1 });

mealSchema.methods.getMacros = function() {
  return {
    calories: this.calories,
    protein: this.protein,
    carbs: this.carbs,
    fat: this.fat
  };
};

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
