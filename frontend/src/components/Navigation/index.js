import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import logo from '../../assets/home-icon.jpg';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(state => state.spot.allSpots);
  // const spots = spotsData.Spots || [];
  console.log(spots);
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    const filteredSpots = Object.values(spots).filter((spot) =>
      spot.city.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredSpots);
  }

  const handleSuggestionClick = (id) => {
    // setSearchQuery(name);
    history.push(`/spots/${id}`);
    setSearchResults([]);
  };

  const searchSectionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchSectionRef.current && !searchSectionRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    //listen for route changes and reset the search bar value
    return history.listen(() => {
      setSearchQuery('');
    });
  }, [history]);

  return (
    <div id='nav-container' className='nav-container'>
      <div className='logo-div'>
        <NavLink exact to='/'>
          <img src={logo} className='logo' alt='brand-logo' />
        </NavLink>
      </div>

      <div className='search-section' ref={searchSectionRef}>
        <input
          className='search-bar'
          type="text"
          placeholder="Search by city..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* <div className="search-suggestions"> */}
        <div className={`search-suggestions ${searchResults.length > 0 ? 'has-results' : ''}`}>
          {searchResults.map((spot) => (
            <div
              key={spot.id}
              className="search-suggestion"
              onClick={() => handleSuggestionClick(spot.id)}
            >
              {spot.city}, {spot.state}
            </div>
          ))}
        </div>
      </div>

      <div className='menu-section'>
        {isLoaded && (
          <div className='menu'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
