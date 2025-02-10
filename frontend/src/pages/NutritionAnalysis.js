import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file drop and upload
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file)); // Preview image
    uploadImage(file); // Send the image to LogMeal API
  };

  const uploadImage = (file) => {
    setLoading(true);                                                                                                                                
    const formData = new FormData();
    formData.append('image', file);

    // LogMeal API endpoint (use your API key)
    const url = 'https://api.logmeal.com/food/recognize';
    const config = {
      headers: {
        'Authorization': `Bearer YOUR_API_KEY`,
        'Content-Type': 'multipart/form-data',
      },
    };

    axios.post(url, formData, config)
      .then(response => {
        setNutritionData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching nutrition data:", error);
        setLoading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
  });

  return (
    <div className="App">
      <h1>Food Nutrition Finder</h1>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {image ? (
          <img src={image} alt="Uploaded Food" width="300" />
        ) : (
          <p>Drag and drop an image here, or click to select a file</p>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {nutritionData && !loading && (
        <div className="nutrition-info">
          <h2>Nutritional Information</h2>
          <p><strong>Calories:</strong> {nutritionData.calories} kcal</p>
          <p><strong>Serving Size:</strong> {nutritionData.serving_size} g</p>
          <h3>Nutrient Breakdown:</h3>
          <ul>
            {nutritionData.nutrients.map((nutrient, index) => (
              <li key={index}>
                {nutrient.name}: {nutrient.value} {nutrient.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
