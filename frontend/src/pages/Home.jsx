import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container bd-image">
      <div className="overlay">
        { <h1>Welcome to Quick Hammer</h1> }
        <p>
          Where magic meets words, and stories take flight. Browse through enchanting collections across genres, hand-picked to stir your soul.
        </p>
      </div>
    </div>
  );
};

export default Home;
