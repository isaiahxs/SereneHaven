import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { userSpotsThunk } from "../../store/spots";
import './Host.css';

export default function Host() {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [errors, setErrors] = useState([]);

    // tried commenting this out and passing in {user} as a prop from App.js but it didn't work right now
    // const user = useSelector(state => state.session.user);

    // useEffect(() => {
    //     dispatch(userSpotsThunk(user.id));
    // }, [dispatch, user.id]);
    useEffect(() => {
        dispatch(userSpotsThunk());
    }, [])

    const userSpotsState = useSelector(state => state?.spots?.userSpots);

    let userSpotsArr = [];
    if (userSpotsState) {
        userSpotsArr = Object.values(userSpotsState);
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
        name,
        description,
        location,
        price,
        image,
        userId: userSpotsState.id
        }
        const res = await fetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.errors) {
        setErrors(data.errors);
        }
    }

    //original
    // return (
    //     <div className="host-container">
    //     <h1>Host a Spot</h1>
    //     <form onSubmit={handleSubmit}>
    //         <div className="host-inputs">
    //         <div className="host-input">
    //             <label>Name</label>
    //             <input
    //             type="text"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             required
    //             />
    //         </div>
    //         <div className="host-input">
    //             <label>Description</label>
    //             <input
    //             type="text"
    //             value={description}
    //             onChange={(e) => setDescription(e.target.value)}
    //             required
    //             />
    //         </div>
    //         <div className="host-input">
    //             <label>Location</label>
    //             <input
    //             type="text"
    //             value={location}
    //             onChange={(e) => setLocation(e.target.value)}
    //             required
    //             />
    //         </div>
    //         <div className="host-input">
    //             <label>Price</label>
    //             <input
    //             type="number"
    //             value={price}
    //             onChange={(e) => setPrice(e.target.value)}
    //             required
    //             />
    //         </div>
    //         <div className="host-input">
    //             <label>Image</label>
    //             <input
    //             type="text"
    //             value={image}
    //             onChange={(e) => setImage(e.target.value)}
    //             required
    //             />
    //         </div>
    //         </div>
    //         <button type="submit">Submit</button>
    //     </form>
    //     </div>
    // );

    return (
        <div className="host-container">
          <h1>Create a new Spot</h1>
          <h2>Where's your place located?</h2>
          <h3>Guests will only get your exact address once they booked a reservation.</h3>
          <form onSubmit={handleSubmit}>
            <div className="host-inputs">
              <div className="host-input">
                <label>Country</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Country"
                />
              </div>
              <div className="host-input">
                <label>Street Address</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                    placeholder="Street Address"
                />
              </div>
              <div className="host-input">
                <label>City</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                    placeholder="City"
                />
                <label>State</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="STATE"
                />
              </div>
              <div className="host-input">
                <label>Latitude</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  placeholder="Latitude"
                />
                <label>Longitude</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                    placeholder="Longitude"
                />
              </div>
            </div>
            <hr />
            <h2>Describe your place to guests</h2>
            <h3>
              Mention the best features of your space, any special amenities like fast
              wifi or parking, and what you love about the neighborhood.
            </h3>
            <div className="host-input">
              <textarea
                rows="5"
                cols="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Please write at least 30 characters."
              ></textarea>
            </div>
            <hr />
            <h2>Create a title for your spot</h2>
            <h3>Catch guest's attention with a spot title that highlights what makes your place special.</h3>
            <div className="host-input">
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name of your spot"
                />
            </div>
            <hr />
            <h2>Set a base price for your spot</h2>
            <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
            <div className="host-input">
                <span>$</span>
                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="Price per night (USD)"
                />
            </div>
            <hr />
            <h2>Liven up your spot with photos</h2>
            <h3>Submit a link to at least one photo to publish your spot.</h3>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="host-input">
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    placeholder="Image URL"
                />
                </div>
            ))}
            <hr />
            <button type="submit">Create a Spot</button>
          </form>
        </div>
      );
}
