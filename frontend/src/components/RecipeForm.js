import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

function RecipeForm() {
    const { dispatch } = useRecipesContext();
    const { user } = useAuthContext();

    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [instructions, setinstructions] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in!');
            return;
        }

        const recipe = { name, ingredients, prepTime, instructions, difficulty };

        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/recipes`,
            {
                method: "POST",
                body: JSON.stringify(recipe),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }

        if (response.ok) {
            setName('');
            setIngredients('');
            setPrepTime('');
            setDifficulty('');
            setinstructions('');
            setError(null);
            setEmptyFields([]);
            console.log('new recipe added', json);
            dispatch({ type: 'CREATE_RECIPES', payload: json })
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Recipe</h3>
            <label>Recipe Name:</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={Array.isArray(emptyFields) && emptyFields.includes('name') ? 'error' : ''}
            />
            <label>Ingredients:</label>
            <input
                type="text"
                onChange={(e) => setIngredients(e.target.value)}
                value={ingredients}
                className={Array.isArray(emptyFields) && emptyFields.includes('ingredients') ? 'error' : ''}

            />
            <label>Preperation Time:</label>
            <input
                type="number"
                onChange={(e) => setPrepTime(e.target.value)}
                value={prepTime}
                className={Array.isArray(emptyFields) && emptyFields.includes('prepTime') ? 'error' : ''}

            />
            <label>Instructions:</label>
            <input
                type="text"
                onChange={(e) => setinstructions(e.target.value)}
                value={instructions}
                className={emptyFields.includes('instructions') ? 'error' : ''}
            />
            <label>Difficulty:</label>
            <select
                onChange={(e) => setDifficulty(e.target.value)}
                value={difficulty}
                className={emptyFields.includes('difficulty') ? 'error' : ''}
            >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <button>Add Recipe</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default RecipeForm;