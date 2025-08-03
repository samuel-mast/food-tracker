import {useState, useEffect} from 'react';
import MealModal from '../components/MealModal';

async function getMeals() {
  const tokenString = localStorage.getItem('token');
  const userId = JSON.parse(tokenString).userToken || null;

  console.log('Fetching meals for user:', userId);
  return fetch(`http://localhost:5000/meals?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

const MealTracker = () => {
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [defaultMealType, setDefaultMealType] = useState('breakfast');

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const mealsData = await getMeals();
        setMeals(mealsData);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  // Group meals by meal type
  const groupedMeals = meals.reduce((groups, meal) => {
    const type = meal.mealType;
    if (!groups[type]) groups[type] = [];
    groups[type].push(meal);
    return groups;
  }, {});

  // Define meal type order and emojis
  const mealTypeConfig = {
    breakfast: { label: 'Breakfast' },
    lunch: { label: 'Lunch' },
    dinner: { label: 'Dinner' },
    snack: { label: 'Snacks' }
  };

  // Calculate daily totals
  const dailyTotals = meals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fat: totals.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleDelete = async (mealId) => {
    try {
      await fetch(`http://localhost:5000/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
    const refreshedMeals = await getMeals();
    setMeals(refreshedMeals);
  };

  const addMeal = (mealType) => {
    setDefaultMealType(mealType);
    setEditingMeal(null); // Clear any editing meal
    setIsModalOpen(true);
  };

  const handleSaveMeal = async (mealData, mealId) => {
    setLoading(true);
    try {
      const tokenString = localStorage.getItem('token');
      const tokenObject = JSON.parse(tokenString);
      const userToken = tokenObject.userToken;
      mealData.userId = userToken;

      if (mealId) {
        // Update existing meal
        const response = await fetch(`http://localhost:5000/meals/${mealId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mealData),
        });

        if (!response.ok) throw new Error('Failed to update meal');
      } else {
        // Create new meal
        const response = await fetch('http://localhost:5000/meals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mealData),
        });

        if (!response.ok) throw new Error('Failed to create meal');
      }
      const refreshedMeals = await getMeals();
      setMeals(refreshedMeals);
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    loading ? (
      <div></div>
    ) : (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        {/* Daily Summary Header */}
        <div className="bg-gray-800 text-white rounded-xl p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Today's Nutrition</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">{dailyTotals.calories}</div>
            <div className="text-blue-100 text-sm">Calories</div>
          </div>
          <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">{dailyTotals.protein}g</div>
            <div className="text-blue-100 text-sm">Protein</div>
          </div>
          <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">{dailyTotals.carbs}g</div>
            <div className="text-blue-100 text-sm">Carbs</div>
          </div>
          <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">{dailyTotals.fat}g</div>
            <div className="text-blue-100 text-sm">Fat</div>
          </div>
        </div>
      </div>

      {/* Grouped Meals */}
      <div className="space-y-6">
        {Object.keys(mealTypeConfig).map(mealType => {
          const mealsOfType = groupedMeals[mealType] || [];
          const config = mealTypeConfig[mealType];

          // Calculate totals for this meal type
          const mealTypeTotals = mealsOfType.reduce((totals, meal) => ({
            calories: totals.calories + meal.calories,
            protein: totals.protein + meal.protein,
            carbs: totals.carbs + meal.carbs,
            fat: totals.fat + meal.fat
          }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

          return (
            <div key={mealType} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Meal Type Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">{config.label}</h2>
                    {mealsOfType.length > 0 && (
                      <span className="text-sm text-gray-500">({mealsOfType.length} items)</span>
                    )}
                  </div>
                  
                  {mealsOfType.length > 0 && (
                    <div className="text-sm text-gray-600 hidden md:block">
                      {mealTypeTotals.calories} cal • {mealTypeTotals.protein}p • {mealTypeTotals.carbs}c • {mealTypeTotals.fat}f
                    </div>
                  )}
                </div>
                
                {/* Mobile totals */}
                {mealsOfType.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2 md:hidden">
                    {mealTypeTotals.calories} cal • {mealTypeTotals.protein}p • {mealTypeTotals.carbs}c • {mealTypeTotals.fat}f
                  </div>
                )}
              </div>

              {/* Meals List */}
              <div className="p-4">
                {mealsOfType.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No meals added for {config.label.toLowerCase()} yet</p>
                    <button 
                      onClick={() => addMeal(mealType)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add {config.label} Meal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mealsOfType.map(meal => (
                      <div key={meal._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{meal.name}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span className="font-medium text-orange-600">{meal.calories} cal</span>
                              <span>{meal.protein}g protein</span>
                              <span>{meal.carbs}g carbs</span>
                              <span>{meal.fat}g fat</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button 
                              onClick={() => handleEdit(meal)}
                              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(meal._id)}
                              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add meal button for existing sections */}
                    <button 
                      onClick={() => addMeal(mealType)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      + Add another {config.label.toLowerCase()} meal
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <MealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeal}
        editMeal={editingMeal}
        defaultMealType={defaultMealType}
      />
    </div>
    )
  );
};

export default MealTracker;
