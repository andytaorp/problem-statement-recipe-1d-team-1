import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

function Home() {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/workouts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  // Sorting Workouts
  const sortedRecipe = recipes
    ? [...recipes].sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "hardest") return b.difficulty - a.difficulty;
        if (sortBy === "easiest") return a.difficulty - b.difficulty;
        if (sortBy === "longest") return b.prepTime - a.reps;
        if (sortBy === "shortest") return a.reps - b.reps;
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
          {sortedWorkouts &&
            sortedWorkouts.map((workout) => (
              <WorkoutDetails key={workout._id} workout={workout} />
            ))}
        </div>
      </div>

      {/* Right Column: Workout Form */}
      <div className="right-column">
        <WorkoutForm />
      </div>
    </div>
  );
}

export default Home;
