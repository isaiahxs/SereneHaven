import React from 'react';

function ImageModal({ src, alt }) {
    return (
        <div className='image-modal'>
            <img src={src} alt={alt} />
        </div>
    );
}

export default ImageModal;