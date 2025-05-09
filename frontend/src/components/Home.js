import React from 'react';

const Home = () => {
  return (
    <div>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Find Your Perfect Companion</h1>
            <p>Adopt a pet and give them a forever home</p>
            <div className="search-box">
              <input type="text" placeholder="Search for pets..." />
              <button><i className="fas fa-search"></i></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
