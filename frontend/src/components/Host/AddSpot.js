//this will be the create component for the Host

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { userSpotsThunk } from "../../store/spots";
import { Redirect, useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as spotActions from "../../store/spots";
import './AddSpot.css';
import { Route } from "react-router-dom";

export default function AddSpot() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {closeModal} = useModal();

    const sessionUser = useSelector(state => state.session.user);
    console.log('sessionUser', sessionUser)



    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [errors, setErrors] = useState([]);

    if (!sessionUser) return <Redirect to={'/'} />;
    // if (sessionUser === null) { return <Redirect to={'/'} />; }

    // tried commenting this out and passing in {user} as a prop from App.js but it didn't work right now
    // const user = useSelector(state => state.session.user);

    //if user is not logged in, redirect to home page
{/* <Route path="/host" render={() => sessionUser ? <Host /> : <Redirect to="/" />} /> */}

    // useEffect(() => {
    //     dispatch(userSpotsThunk(user.id));
    // }, [dispatch, user.id]);
    // useEffect(() => {
    //     dispatch(userSpotsThunk());
    // }, [])

    //i can see host page for a brief second before it redirects to home page
    // useEffect(() => {
    //     if (!sessionUser) {
    //         history.push('/');
    //     }
    // }, []);

    // const userSpotsState = useSelector(state => state?.spots?.userSpots);

    // let userSpotsArr = [];
    // if (userSpotsState) {
    //     userSpotsArr = Object.values(userSpotsState);
    // }



    //first attempt
    const handleSubmit = async (e) => {
        e.preventDefault();

        return dispatch (
          spotActions.createSpotThunk({
              name,
              description,
              price,
              // imageURL,
              address,
              city,
              state,
              country,
              lat,
              lng,
              // image: {url: imageURL}
            },
            {
              url: imageURL,
              preview: true
            }
          )
        ).then((spot) => {
          closeModal();
          history.push(`/spots/${spot.id}`);
        })
        .catch(async (res) => {
          const data = await res.json();
          //original
          if (data && data.errors) setErrors(data.errors);

          //my second attempt
          //trying to solve the problem for when i receive "errors.map" is not a function
          //i believe the problem might be that sometimes, data.errors is not an array
          // if (data && data.errors) {
          //   setErrors(Array.isArray(data.errors) ? data.errors : [data.errors]);
          // }
        });
    };


        //second iteration
        // const payload = {
        // name,
        // description,
        // location,
        // price,
        // image,
        // userId: userSpotsState.id
        // }
        // const res = await fetch('/api/spots', {
        // method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        // body: JSON.stringify(payload)
        // });
        // const data = await res.json();
        // if (data.errors) {
        // setErrors(data.errors);
        // }

        //third iteration
        // const handleSubmit = async (e) => {
        //   e.preventDefault();
        //   let errorsArr = [];
        //   setErrors([]);

        //   if (!imageURL.endsWith('.jpg') && !imageURL.endsWith('.jpeg') && !imageURL.endsWith('.png')) {
        //       errorsArr.push('Image URL must end in .png, .jpg, or .jpeg');
        //   }

        //   if (!address.includes(' ') || address.length < 3) {
        //       errorsArr.push('Address must include a street name and number');
        //   }

        //   if (description.length < 30) {
        //       errorsArr.push('Description needs a minimum of 30 characters');
        //   }

        //   if (price < 0) {
        //       errorsArr.push('Price cannot be negative');
        //   }

        //   if (errorsArr.length > 0) {
        //       setErrors(errorsArr);
        //       return;
        //   } else if (errorsArr.length === 0) {
        //     dispatch(spotActions.createSpotThunk({name, country, city, state, address, description, price, lat, lng}))
        //     //i don't think i need imageURL above because it is not a column in the database
        //     //lat & lng might cause a problem
        //       //need to dispatch a thunk that will add an image to the spot
        //   }
        //  };


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
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  placeholder="Country"
                />
              </div>
              <div className="host-input">
                <label>Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                    placeholder="Street Address"
                />
              </div>
              <div className="host-input">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                    placeholder="City"
                />
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  placeholder="STATE"
                />
              </div>
              {/* ALSO WOULD NEED TO EDIT THESE LATER SO IT'S NOT SETIMAGE */}
              <div className="host-input">
                <label>Latitude</label>
                <input
                  type="number"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                  placeholder="Latitude"
                />
                <label>Longitude</label>
                <input
                  type="number"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
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
            {/* {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="host-input">
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    placeholder="Image URL"
                />
                </div>
            ))} */}
            {/* need to add the other image url inputs */}
            <div className="host-input">
                <input
                type='url'
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                required
                placeholder="Preview Image URL"
                />
                <ul>
                  {errors.map((error, id) => (
                    <li key={id}>{error}</li>
                  ))}
                </ul>
                {/* my second attempt */}
                {/* <ul>
                  {Object.entries(spotDetails).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul> */}
            </div>
            <hr />
            <button onClick={handleSubmit} type="submit">Create a Spot</button>
          </form>
        </div>
      );
}
