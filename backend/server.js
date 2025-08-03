const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Models
const User = require('./models/User');
const Meal = require('./models/Meal');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("MongoDB connected successfully"))
.catch(err => console.error(err));

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/meals', async (req, res) => {
  const { name, calories, protein, carbs, fat, userId, date, mealType } = req.body;
  try {
    const newMeal = new Meal({ name, calories, protein, carbs, fat, userId, date, mealType });
    await newMeal.save();
    res.status(201).json({ message: 'Meal added successfully', mealId: newMeal._id, meal: newMeal });
  } catch (error) {
    res.status(500).json({ error: 'Error adding meal' });
  }
});

app.get('/meals', async (req, res) => {
  const { userId } = req.query;
  try {
    const meals = await Meal.find({ userId }).sort({ date: -1 });
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meals' });
  }
});

app.put('/meals/:id', async (req, res) => {
  const { id } = req.params;
  const { name, calories, protein, carbs, fat, date, mealType } = req.body;
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(id, { name, calories, protein, carbs, fat, date, mealType }, { new: true });
    if (!updatedMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.status(200).json({ message: 'Meal updated successfully', meal: updatedMeal });
  } catch (error) {
    res.status(500).json({ error: 'Error updating meal' });
  }
});

app.delete('/meals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMeal = await Meal.findByIdAndDelete(id);
    if (!deletedMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting meal' });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});