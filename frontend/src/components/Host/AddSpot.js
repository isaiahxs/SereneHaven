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
    // console.log('sessionUser', sessionUser)

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [errors, setErrors] = useState([]);
    const [imageURL, setImageURL] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');

    if (!sessionUser) return <Redirect to={'/'} />;

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
    //ORIGINAL THAT WORKS
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     return dispatch (
    //       spotActions.createSpotThunk({
    //           name,
    //           description,
    //           price,
    //           // imageURL,
    //           address,
    //           city,
    //           state,
    //           country,
    //           lat,
    //           lng,
    //           // image: {url: imageURL}
    //         },
    //         {
    //           url: imageURL,
    //           preview: true
    //         }
    //       )
    //     ).then((spot) => {
    //       closeModal();
    //       history.push(`/spots/${spot.id}`);
    //     })
    //     .catch(async (res) => {
    //       const data = await res.json();
    //       //original
    //       if (data && data.errors) setErrors(data.errors);

    //       //my second attempt
    //       //trying to solve the problem for when i receive "errors.map" is not a function
    //       //i believe the problem might be that sometimes, data.errors is not an array
    //       // if (data && data.errors) {
    //       //   setErrors(Array.isArray(data.errors) ? data.errors : [data.errors]);
    //       // }
    //     });
    // };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     let errorsArr = [];

  //     // Add some checks to ensure that the user has entered valid data for the inputs
  //     if (!country) {
  //       errorsArr.push('Please enter a valid country.');
  //     }
  //     if (!address || address.length < 3) {
  //       errorsArr.push('Please enter a valid address.');
  //     }
  //     if (!city) {
  //       errorsArr.push('Please enter a valid city.');
  //     }
  //     if (!state) {
  //       errorsArr.push('Please enter a valid state.');
  //     }
  //     if (!lat || lat < -90 || lat > 90) {
  //       errorsArr.push('Please enter a valid latitude.');
  //     }
  //     if (!lng || lng < -180 || lng > 180) {
  //       errorsArr.push('Please enter a valid longitude.');
  //     }
  //     if (!name || name.length < 3 || name.length > 50) {
  //       errorsArr.push('Please enter a valid name for your spot.');
  //     }
  //     if (!description || description.length < 30) {
  //       errorsArr.push('Please enter a description with at least 30 characters.');
  //     }
  //     if (!price || price < 0) {
  //       errorsArr.push('Please enter a valid price for your spot.');
  //     }
  //     if (!imageURL.endsWith('.jpg') && !imageURL.endsWith('.png') && !imageURL.endsWith('.jpeg')) {
  //       errorsArr.push('Please enter a valid image URL.');
  //     }
  //     if (image1 && !image1.endsWith('.jpg') && !image1.endsWith('.png') && !image1.endsWith('.jpeg')) {
  //       errorsArr.push('Invalid image1 url.');
  //     }
  //     if (image2 && !image2.endsWith('.jpg') && !image2.endsWith('.png') && !image2.endsWith('.jpeg')) {
  //       errorsArr.push('Invalid image2 url.');
  //     }
  //     if (image3 && !image3.endsWith('.jpg') && !image3.endsWith('.png') && !image3.endsWith('.jpeg')) {
  //       errorsArr.push('Invalid image3 url.');
  //     }
  //     if (image4 && !image4.endsWith('.jpg') && !image4.endsWith('.png') && !image4.endsWith('.jpeg')) {
  //       errorsArr.push('Invalid image4 url.');
  //     }


  //     //display validation errors to the user
  //     setErrors(errorsArr);

  //     if (errorsArr.length === 0) {
  //       dispatch(
  //         spotActions.createSpotThunk({
  //           name,
  //           description,
  //           price,
  //           address,
  //           city,
  //           state,
  //           country,
  //           lat,
  //           lng,
  //         },
  //         {
  //           url: imageURL,
  //           preview: true
  //         }
  //       )
  //       ).then((spot) => {
  //         closeModal();
  //         history.push(`/spots/${spot.id}`);
  //       })
  //       .catch(async (res) => {
  //         const data = await res.json();
  //         if (data && data.errors) setErrors(data.errors);
  //     });
  //     };
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorsArr = [];
    const images = [image1, image2, image3, image4].filter(Boolean).map((url) => ({
      url,
      preview: false,
  }));

    // Add some checks to ensure that the user has entered valid data for the inputs
    if (!country) {
      errorsArr.push('Please enter a valid country.');
    }
    if (!address || address.length < 3) {
      errorsArr.push('Please enter a valid address.');
    }
    if (!city) {
      errorsArr.push('Please enter a valid city.');
    }
    if (!state) {
      errorsArr.push('Please enter a valid state.');
    }
    if (!lat || lat < -90 || lat > 90) {
      errorsArr.push('Please enter a valid latitude.');
    }
    if (!lng || lng < -180 || lng > 180) {
      errorsArr.push('Please enter a valid longitude.');
    }
    if (!name || name.length < 3 || name.length > 50) {
      errorsArr.push('Please enter a valid name for your spot.');
    }
    if (!description || description.length < 30) {
      errorsArr.push('Please enter a description with at least 30 characters.');
    }
    if (!price || price < 0) {
      errorsArr.push('Please enter a valid price for your spot.');
    }
    if (!imageURL.endsWith('.jpg') && !imageURL.endsWith('.png') && !imageURL.endsWith('.jpeg')) {
      errorsArr.push('Please enter a valid image URL.');
    }
    if (image1 && !image1.endsWith('.jpg') && !image1.endsWith('.png') && !image1.endsWith('.jpeg')) {
      errorsArr.push('Invalid image1 url.');
    }
    if (image2 && !image2.endsWith('.jpg') && !image2.endsWith('.png') && !image2.endsWith('.jpeg')) {
      errorsArr.push('Invalid image2 url.');
    }
    if (image3 && !image3.endsWith('.jpg') && !image3.endsWith('.png') && !image3.endsWith('.jpeg')) {
      errorsArr.push('Invalid image3 url.');
    }
    if (image4 && !image4.endsWith('.jpg') && !image4.endsWith('.png') && !image4.endsWith('.jpeg')) {
      errorsArr.push('Invalid image4 url.');
    }


    //display validation errors to the user
    setErrors(errorsArr);

    if (errorsArr.length === 0) {
      dispatch(
        spotActions.createSpotThunk({
          name,
          description,
          price,
          address,
          city,
          state,
          country,
          lat,
          lng,
        },
        {
          url: imageURL,
          preview: true
        },
        images
      )
      ).then((spot) => {
        closeModal();
        history.push(`/spots/${spot.id}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
    });
    };
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
          <div className="form-container">
          <form className="create-form" onSubmit={handleSubmit}>
          <h1 className="create-header">Create a new Spot</h1>
          <h2>Where's your place located?</h2>
          <h3>Guests will only get your exact address once they booked a reservation.</h3>
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
                {errors.includes('Please enter a valid country.') && (
                <span className="error-message">Please enter a valid country.</span>
                )}
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
                {errors.includes('Please enter a valid address.') && (
                <span className="error-message">Please enter a valid address.</span>
                )}
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
                {errors.includes('Please enter a valid city.') && (
                <span className="error-message">Please enter a valid city.</span>
                )}
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  placeholder="STATE"
                />
                {errors.includes('Please enter a valid state.') && (
                <span className="error-message">Please enter a valid state.</span>
                )}
              </div>
              <div className="host-input">
                <label>Latitude</label>
                <input
                  type="number"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                  placeholder="Latitude"
                />
                {errors.includes('Please enter a valid latitude.') && (
                <span className="error-message">Please enter a valid latitude.</span>
                )}
                <label>Longitude</label>
                <input
                  type="number"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                    placeholder="Longitude"
                />
                {errors.includes('Please enter a valid longitude.') && (
                <span className="error-message">Please enter a valid longitude.</span>
                )}
              </div>
            </div>
            {/* <hr /> */}
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
              {errors.includes('Please enter a description with at least 30 characters.') && (
                <span className="error-description">Please enter a description with at least 30 characters.</span>
                )}
            </div>
            {/* <hr /> */}
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
                {errors.includes('Please enter a valid name for your spot.') && (
                <span className="error-message">Please enter a valid name.</span>
                )}
            </div>
            {/* <hr /> */}
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
                {errors.includes('Please enter a valid price for your spot.') && (
                <span className="error-message">Please enter a valid price.</span>
                )}
            </div>
            {/* <hr /> */}
            <h2>Liven up your spot with photos</h2>
            <h3>Submit a link to at least one photo to publish your spot.</h3>
            {/* need to add the other image url inputs */}
            <div className="host-input">
                <input
                type='url'
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                required
                placeholder="Preview Image URL"
                />
                {errors.includes('Please enter a valid image URL.') && (
                <span className="error-message">Please enter a url that ends with .jpg, .jpeg, or .png.</span>
                )}
            </div>
            <div>
            <input
                type='url'
                value={image1}
                onChange={(e) => setImage1(e.target.value)}
                placeholder="Image URL"
                />
                {errors.includes('Invalid image1 url.') && (
                <span className="error-message">Please enter a url that ends with .jpg, .jpeg, or .png.</span>
                )}
            </div>
            <div>
            <input
                type='url'
                value={image2}
                onChange={(e) => setImage2(e.target.value)}
                placeholder="Image URL"
                />
                {errors.includes('Invalid image2 url.') && (
                <span className="error-message">Please enter a url that ends with .jpg, .jpeg, or .png.</span>
                )}
            </div>
            <div>
            <input
                type='url'
                value={image3}
                onChange={(e) => setImage3(e.target.value)}
                placeholder="Image URL"
                />
                {errors.includes('Invalid image3 url.') && (
                <span className="error-message">Please enter a url that ends with .jpg, .jpeg, or .png.</span>
                )}
            </div>
            <div>
            <input
                type='url'
                value={image4}
                onChange={(e) => setImage4(e.target.value)}
                placeholder="Image URL"
                />
                {errors.includes('Invalid image4 url.') && (
                <span className="error-message">Please enter a url that ends with .jpg, .jpeg, or .png.</span>
                )}
            </div>
            {/* <hr /> */}
            {/* <ul>
              {Array.isArray(errors) && errors.map((error, id) => (
                <li key={id}>{error}</li>
              ))}
            </ul> */}
            <button onClick={handleSubmit} type="submit" className="add-spot-button">Create Spot</button>
          </form>
          </div>
        </div>
      );
}
