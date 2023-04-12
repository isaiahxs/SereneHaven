import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as spotActions from "../../store/spots";
import './EditSpot.css';

export default function EditSpot({initialSpot}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const { closeModal } = useModal();

    const sessionUser = useSelector(state => state.session.user);

    // Replace useState initial values with the fetched data
    const [name, setName] = useState(initialSpot.name);
    const [description, setDescription] = useState(initialSpot.description);
    const [price, setPrice] = useState(initialSpot.price);
    const [address, setAddress] = useState(initialSpot.address);
    const [city, setCity] = useState(initialSpot.city);
    const [state, setState] = useState(initialSpot.state);
    const [country, setCountry] = useState(initialSpot.country);
    const [lat, setLat] = useState(initialSpot.lat);
    const [lng, setLng] = useState(initialSpot.lng);
    const [errors, setErrors] = useState([]);
    const [imageURL, setImageURL] = useState(initialSpot.imageURL);
    const [image1, setImage1] = useState(initialSpot.image1);
    const [image2, setImage2] = useState(initialSpot.image2);
    const [image3, setImage3] = useState(initialSpot.image3);
    const [image4, setImage4] = useState(initialSpot.image4);

    if (!sessionUser) return <Redirect to={'/'}/>

    //update handleSubmit function to use updateSpotThunk instead of createSpotThunk
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
            spotActions.updateSpotThunk(
                spotId, //pass the spot Id to the updateSpotThunk function
                {
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

    return (
        <div className="host-container">
          <h1>Edit listing for this location?</h1>
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
              {errors.includes('Please enter a description with at least 30 characters.') && (
                <span className="error-message">Please enter a description with at least 30 characters.</span>
                )}
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
                {errors.includes('Please enter a valid name for your spot.') && (
                <span className="error-message">Please enter a valid name.</span>
                )}
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
                {errors.includes('Please enter a valid price for your spot.') && (
                <span className="error-message">Please enter a valid price.</span>
                )}
            </div>
            <hr />
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
            <hr />
            {/* <ul>
              {Array.isArray(errors) && errors.map((error, id) => (
                <li key={id}>{error}</li>
              ))}
            </ul> */}
            <button onClick={handleSubmit} type="submit">Create Spot</button>
          </form>
        </div>
      );
}
