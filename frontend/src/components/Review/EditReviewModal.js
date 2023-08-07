import React, { useState, useEffect } from 'react';
import { reviewThunk, addReviewThunk } from '../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';

import './EditReviewModal.css';

function EditReviewModal({ spotId }) {
    return (
        <div>review modal</div>
    )
}
