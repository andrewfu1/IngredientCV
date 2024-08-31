import React, { useState } from 'react';

const GenerateMeals = ({ items }) => {
    const [loading, setLoading] = useState(false);
    const [mealOptions, setMealOptions] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [recipe, setRecipe] = useState('');
    const [loadingRecipe, setLoadingRecipe] = useState(false); // State to track recipe loading

    const handleGenerateMeals = () => {
        setLoading(true);
        fetch('http://localhost:5001/generate_meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items }),
        })
        .then(response => response.json())
        .then(data => {
            setMealOptions(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error generating meals:", error);
            setLoading(false);
        });
    };

    const handleSelectMeal = (meal) => {
        setSelectedMeal(meal);
        setLoadingRecipe(true); // Set loading to true when recipe generation starts

        fetch('http://localhost:5001/generate_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meal_name: meal }),
        })
        .then(response => response.json())
        .then(data => {
            setRecipe(data.recipe);
            setLoadingRecipe(false); // Set loading to false when recipe is loaded
        })
        .catch((error) => {
            console.error("Error generating recipe:", error);
            setLoadingRecipe(false); // Ensure loading is false in case of error
        });
    };

    return (
        <div style={styles.container}>
            <button onClick={handleGenerateMeals} style={styles.button} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Meal Ideas'}
            </button>
            <div style={styles.mealButtonsContainer}>
                {mealOptions.map((meal, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectMeal(meal)}
                        style={{
                            ...styles.mealButton,
                            backgroundColor: selectedMeal === meal ? '#006400' : '#28a745', // Dark green if selected
                        }}
                    >
                        {meal}
                    </button>
                ))}
            </div>
            <div style={styles.recipeContainer}>
                {loadingRecipe ? (
                    <p>Loading recipe...</p>
                ) : (
                    recipe.split('#').map((step, index) => (
                        <p key={index} style={{ marginBottom: '10px' }}>{step.trim()}</p>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'absolute',
        top: '40px',
        right: '125px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid black',
        borderRadius: '5px',
        padding: '10px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '200px',
    },
    mealButtonsContainer: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '550px',
    },
    mealButton: {
        margin: '0 10px',
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '200px',
    },
    recipeContainer: {
        position: 'absolute',
        top: '0',
        marginTop: '150px',
        padding: '10px',
        border: '1px solid black',
        borderRadius: '5px',
        width: '550px',
        textAlign: 'left',
        maxHeight: '650px',
        overflowY: 'auto',
    },
};

export default GenerateMeals;