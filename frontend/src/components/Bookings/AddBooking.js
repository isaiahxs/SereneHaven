import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import DatePicker from 'react-datepicker';
import { addBookingThunk } from '../../store/bookings'
// import 'react-datepicker/dist/react-datepicker.css';
import './AddBooking.css'

export default function AddBooking({ spotId }) {
    const [startDate, setStartDate] = useState(new Date());
    return (
        // <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <button className='reserve-button'>hi</button>
    );
}