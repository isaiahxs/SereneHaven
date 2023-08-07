import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as spotActions from "../../store/spots";
import { spotDetails } from "../../store/spots";
import './EditSpot.css';

export default function EditSpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const sessionUser = useSelector(state => state.session.user);
  // console.log('SESSION USER FROM EDIT PAGE', sessionUser)

  const detailState = useSelector(state => state.spot.spotDetails);
  // console.log('DETAIL STATE IN EDIT PAGE', detailState);

  const { spotId } = useParams();
  console.log('SPOT ID FROM EDIT PAGE', spotId);

  const preview = detailState?.spotImages?.find(image => image.preview);
  const previewURL = preview?.url;
  // console.log('PREVIEW IMAGE URL', preview);

  const [name, setName] = useState(detailState?.name);
  const [description, setDescription] = useState(detailState?.description);
  const [price, setPrice] = useState(detailState?.price);
  const [address, setAddress] = useState(detailState?.address);
  const [city, setCity] = useState(detailState?.city);
  const [state, setState] = useState(detailState?.state);
  const [country, setCountry] = useState(detailState?.country);
  const [lat, setLat] = useState(detailState?.lat);
  const [lng, setLng] = useState(detailState?.lng);
  const [errors, setErrors] = useState([]);
  const [imageURL, setImageURL] = useState(previewURL);
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

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
        spotActions.updateSpotThunk({
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
          spotId,
          {
            url: imageURL,
            preview: true
          },
          images
        )
      ).then((spot) => {
        // console.log('SPOT after the .then', spot);
        closeModal();
        history.push(`/spots/${spot.id}`);
      })
        .catch(async (res) => {
          // console.log('RESSSSSS', res);
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    };
  };

  useEffect(() => {
    dispatch(spotDetails(spotId));
  }, [dispatch, spotId])

  if (!detailState) {
    // console.log("we're loading here :c")
    return (
      <div className="loading">Loading...</div>
    )
  };

  return (
    <div className="host-container">
      <div className="form-container">
        <form className="create-form" onSubmit={handleSubmit}>
          <h1 className="create-header">Update your Spot</h1>
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
                placeholder={detailState?.country}
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
                placeholder={detailState?.address}
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
                placeholder={detailState?.city}
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
                placeholder={detailState?.state}
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
                placeholder={detailState?.lat}
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
                placeholder={detailState?.lng}
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
              placeholder={detailState?.description}
            ></textarea>
            {errors.includes('Please enter a description with at least 30 characters.') && (
              <span className="error-message error-description">Please enter a description with at least 30 characters.</span>
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
              placeholder={detailState?.name}
            />
            {errors.includes('Please enter a valid name for your spot.') && (
              <span className="error-message">Please enter a valid name.</span>
            )}
          </div>
          {/* <hr /> */}
          <h2>Set a base price for your spot</h2>
          <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
          {/* <div className="host-input price-section">
            <span className="dollar-sign">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder={detailState?.price}
              className="price-input"
            />
            {errors.includes('Please enter a valid price for your spot.') && (
              <span className="error-message">Please enter a valid price.</span>
            )}
          </div> */}
          <div className="host-input price-section">
            <div className="dollar-price-input">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder={detailState?.price}
                className="price-input"
              />
            </div>
            <div className="price-error-msg">
              {errors.includes('Please enter a valid price for your spot.') && (
                <span className="error-message">Please enter a valid price.</span>
              )}
            </div>
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
              placeholder={detailState?.preview?.url || 'Preview URL'}
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
          <button onClick={handleSubmit} type="submit" className="add-spot-button">Update your Spot</button>
        </form>
      </div>
    </div>
  )
}
