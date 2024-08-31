import React, { useState } from 'react';
import VideoFeed from './VideoFeed';
import ItemList from './ItemList';
import GenerateMeals from './generate';

function App() {
    const [isFeedActive, setIsFeedActive] = useState(true);
    const [items, setItems] = useState([]);

    const handleStart = () => {
        setIsFeedActive(true);
    };

    const handleMealsGenerated = (generatedMeals) => {
      console.log("Generated meals:", generatedMeals);
  };

    return (
        <div className="App">
            <VideoFeed onStart={handleStart} />
            <ItemList isFeedActive={isFeedActive} items={items} setItems={setItems} />
            <GenerateMeals items={items} onMealsGenerated={handleMealsGenerated} />
        </div>
    );
}

export default App;