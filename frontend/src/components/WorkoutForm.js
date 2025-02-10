import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

function RecipeForm() {
    const {dispatch} = useRecipesContext();
    const {user} =useAuthContext();

    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in!');
            return ;
        }

        const recipe = {name, ingredients, prepTime, difficulty};

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
            setError(null);
            setEmptyFields([]);
            console.log('new recipe added', json);
            dispatch({type: 'CREATE_RECIPES', payload: json})
        }
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Recipe</h3>
            <label>Recipe Name:</label> 
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
            />
            <label>Ingredients:</label> 
            <input
                type="text"
                onChange={(e) => setLoad(e.target.value)}
                value={ingredients}
                className={emptyFields.includes('ingredients') ? 'error' : ''}
            />
            <label>Preperation Time:</label> 
            <input
                type="number"
                onChange={(e) => setReps(e.target.value)}
                value={prepTime}
                className={emptyFields.includes('prepTime') ? 'error' : ''}
            />
            <label>Difficulty:</label> 
            <input
                type="text"
                onChange={(e) => setReps(e.target.value)}
                value={difficulty}
                className={emptyFields.includes('difficulty') ? 'error' : ''}
            />
            <button>Add Recipe</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default RecipeForm;