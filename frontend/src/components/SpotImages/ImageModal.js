import React from 'react';
import './ImageModal.css'

function ImageModal({ src, alt }) {
    return (
        <div className='image-modal'>
            <img src={src} alt={alt} className='img-in-modal' />
        </div>
    );
}

export default ImageModal;