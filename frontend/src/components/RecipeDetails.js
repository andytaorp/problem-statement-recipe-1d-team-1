import { useRecipesContext } from '../hooks/useRecipesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function ReceipeDetails({ recipe }) {
    const { dispatch } = useRecipesContext();
    const { user } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);
    const [updatedRecipe, setUpdatedRecipe] = useState({
        name: recipe.name,
        ingredients: recipe.ingredients,
        prepTime: recipe.prepTime,
        instructions: recipe.instructions,
        difficulty: recipe.difficulty
    });

    // Handle update form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedRecipe(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle update form submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRecipe)
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UPDATE_RECIPE', payload: json });
            setIsEditing(false); // Close the edit form after successful update
        }
    };

    const handleDelete = async () => {
        if (!user) {
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_RECIPE', payload: json })
        }
    }

    return (
        <div className="workout-details">
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="name"
                            value={updatedRecipe.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Ingredients:
                        <input
                            type="text"
                            name="ingredients"
                            value={updatedRecipe.ingredients}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Preperation Time:
                        <input
                            type="number"
                            name="prepTime"
                            value={updatedRecipe.prepTime}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Instructions:
                        <input
                            type="text"
                            name="instructions"
                            value={updatedRecipe.instructions}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Difficulty:
                        <select
                            name="difficulty"
                            value={updatedRecipe.difficulty}
                            onChange={handleChange}
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                    <button type="submit">Update Recipe</button>
                    <button type="button" class="edit-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    <h4>{recipe.name}</h4>
                    <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                    <p><strong>Preperation Time:</strong> {recipe.prepTime}</p>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                    <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                    <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>
                    <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </>
            )}
        </div>
    );
}

export default ReceipeDetails;
