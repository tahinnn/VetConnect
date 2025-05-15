import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard";
import "./PetList.css";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({
    gender: [],
    age: [],
    vaccinated: [],
    shelter: '',
    petType: '',
    location: ''
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/pets")
      .then((response) => setPets(response.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  const handleFilterChange = (category, value) => {
    if (['gender', 'age', 'vaccinated'].includes(category)) {
      setFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: value
      }));
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesGender = filters.gender.length === 0 || filters.gender.includes(pet.gender);
    const matchesAge = filters.age.length === 0 || filters.age.some(range => {
      const [min, max] = range.split('-').map(Number);
      return pet.age >= min && (!max || pet.age <= max);
    });
    const matchesVaccinated = filters.vaccinated.length === 0 || filters.vaccinated.includes(pet.vaccinated ? 'Yes' : 'No');
    const matchesShelter = !filters.shelter || pet.owner?.shelterName === filters.shelter;
    const matchesPetType = !filters.petType || pet.type === filters.petType;
    const matchesLocation = !filters.location || pet.location === filters.location;

    return matchesGender && matchesAge && matchesVaccinated && matchesShelter && matchesPetType && matchesLocation;
  });

  return (
    <div className="petlist-container">
      <div className="sidebar-filter">
        <h2 className="filter-title">Filters</h2>

        <div className="filter-section">
          <label className="filter-label">Gender</label>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.gender.includes('Male')} 
              onChange={() => handleFilterChange('gender', 'Male')}
            /> Male
          </div>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.gender.includes('Female')} 
              onChange={() => handleFilterChange('gender', 'Female')}
            /> Female
          </div>
        </div>
        <hr />

        <div className="filter-section">
          <label className="filter-label">Age</label>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.age.includes('0-1')} 
              onChange={() => handleFilterChange('age', '0-1')}
            /> Under 1 Year
          </div>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.age.includes('1-2')} 
              onChange={() => handleFilterChange('age', '1-2')}
            /> 1 - 2 Years
          </div>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.age.includes('2-7')} 
              onChange={() => handleFilterChange('age', '2-7')}
            /> 2 - 7 Years
          </div>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.age.includes('7-')} 
              onChange={() => handleFilterChange('age', '7-')}
            /> 7+ Years
          </div>
        </div>
        <hr />

        <div className="filter-section">
          <label className="filter-label">Vaccinated</label>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.vaccinated.includes('Yes')} 
              onChange={() => handleFilterChange('vaccinated', 'Yes')}
            /> Yes
          </div>
          <div className="checkbox-option">
            <input 
              type="checkbox" 
              checked={filters.vaccinated.includes('No')} 
              onChange={() => handleFilterChange('vaccinated', 'No')}
            /> No
          </div>
        </div>
        <hr />

        <div className="filter-section">
          <label className="filter-label">Shelters</label>
          <select 
            className="filter-select"
            value={filters.shelter}
            onChange={(e) => handleFilterChange('shelter', e.target.value)}
          >
            <option value="">Select from menu…</option>
            <option value="Dhanmondi">Dhanmondi</option>
            <option value="Gulshan">Gulshan</option>
            <option value="Banani">Banani</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        <div className="top-search-container">
          <div className="top-search-field">
            <label htmlFor="petType">Pet Type</label>
            <select 
              id="petType" 
              className="top-search-select"
              value={filters.petType}
              onChange={(e) => handleFilterChange('petType', e.target.value)}
            >
              <option value="">Any</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Fish">Fish</option>
            </select>
          </div>

          <div className="top-search-field">
            <label htmlFor="location">Location</label>
            <select 
              id="location" 
              className="top-search-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Dhanmondi">Dhanmondi</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Banani">Banani</option>
            </select>
          </div>
        </div>

        <div className="top-divider"></div>

        <div className="pet-cards">
          {filteredPets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetList;
