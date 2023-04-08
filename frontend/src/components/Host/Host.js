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
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(userSpotsThunk(user.id));
    }, [dispatch, user.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
        name,
        description,
        location,
        price,
        image,
        userId: user.id
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

    return (
        <div className="host-container">
        <h1>Host a Spot</h1>
        <form onSubmit={handleSubmit}>
            <div className="host-inputs">
            <div className="host-input">
                <label>Name</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>
            <div className="host-input">
                <label>Description</label>
                <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            </div>
            <div className="host-input">
                <label>Location</label>
                <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                />
            </div>
            <div className="host-input">
                <label>Price</label>
                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                />
            </div>
            <div className="host-input">
                <label>Image</label>
                <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                />
            </div>
            </div>
            <button type="submit">Submit</button>
        </form>
        </div>
    );
}
