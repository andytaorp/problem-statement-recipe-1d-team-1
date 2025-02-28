import { useState, useEffect } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";

function Home() {
  const { recipes, dispatch } = useRecipesContext();
  const { user } = useAuthContext();
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_RECIPES", payload: json });
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]);

  // Sorting Workouts
  const difficultyLevels = { easy: 1, medium: 2, hard: 3 };

  const sortedRecipes = Array.isArray(recipes)
    ? [...recipes].sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "hardest") 
          return (difficultyLevels[b.difficulty?.toLowerCase()] ?? 0) - 
                 (difficultyLevels[a.difficulty?.toLowerCase()] ?? 0);
        if (sortBy === "easiest") 
          return (difficultyLevels[a.difficulty?.toLowerCase()] ?? 0) - 
                 (difficultyLevels[b.difficulty?.toLowerCase()] ?? 0);
        if (sortBy === "longest") return (Number(b.prepTime) || 0) - (Number(a.prepTime) || 0);
        if (sortBy === "shortest") return (Number(a.prepTime) || 0) - (Number(b.prepTime) || 0);
        return 0;
      })
    : [];

  return (
    <div className="home">
      {/* Left Column: Workouts List and Dropdown */}
      <div className="left-column">
        <div className="sort-options">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="hardest">Hardest difficulty</option>
            <option value="easiest">Easiest difficulty</option>
            <option value="longest">Longest preptime</option>
            <option value="shortest">Shortest preptime</option>
          </select>
        </div>

        <div className="workouts">
          {sortedRecipes &&
            sortedRecipes.map((recipe) => (
              <RecipeDetails key={recipe._id} recipe={recipe} />
            ))}
        </div>
      </div>

      {/* Right Column: Workout Form */}
      <div className="right-column">
        <RecipeForm />
      </div>
    </div>
  );
}

export default Home;
