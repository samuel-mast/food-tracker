import { useState, useEffect } from 'react';

const MealModal = ({ isOpen, onClose, onSave, editMeal = null, defaultMealType = 'breakfast' }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: defaultMealType,
    date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editMeal) {
      setFormData({
        name: editMeal.name,
        calories: editMeal.calories.toString(),
        protein: editMeal.protein.toString(),
        carbs: editMeal.carbs.toString(),
        fat: editMeal.fat.toString(),
        mealType: editMeal.mealType,
        date: new Date(editMeal.date).toISOString().split('T')[0]
      });
    } else {
      // Reset form for new meal
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: defaultMealType,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [editMeal, defaultMealType, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Meal name is required';
    }
    
    if (!formData.calories || formData.calories < 0) {
      newErrors.calories = 'Calories must be 0 or greater';
    }
    
    if (!formData.protein || formData.protein < 0) {
      newErrors.protein = 'Protein must be 0 or greater';
    }
    
    if (!formData.carbs || formData.carbs < 0) {
      newErrors.carbs = 'Carbs must be 0 or greater';
    }
    
    if (!formData.fat || formData.fat < 0) {
      newErrors.fat = 'Fat must be 0 or greater';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const mealData = {
        name: formData.name.trim(),
        calories: parseInt(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
        mealType: formData.mealType,
        date: new Date(formData.date).toISOString()
      };
      
      await onSave(mealData, editMeal?._id);
      onClose();
    } catch (error) {
      console.error('Error saving meal:', error);
      setErrors({ submit: 'Failed to save meal. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMeal ? 'Edit Meal' : 'Add New Meal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Meal Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Meal Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Macros Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Calories */}
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-2">
                Calories *
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.calories ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
              />
              {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories}</p>}
            </div>

            {/* Protein */}
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-2">
                Protein (g) *
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.protein ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.1"
              />
              {errors.protein && <p className="text-red-500 text-sm mt-1">{errors.protein}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Carbs */}
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-2">
                Carbs (g) *
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.carbs ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.1"
              />
              {errors.carbs && <p className="text-red-500 text-sm mt-1">{errors.carbs}</p>}
            </div>

            {/* Fat */}
            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-2">
                Fat (g) *
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={formData.fat}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fat ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.1"
              />
              {errors.fat && <p className="text-red-500 text-sm mt-1">{errors.fat}</p>}
            </div>
          </div>

          {/* Meal Type */}
          <div className="mb-4">
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type *
            </label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Date */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editMeal ? 'Update Meal' : 'Add Meal')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealModal;