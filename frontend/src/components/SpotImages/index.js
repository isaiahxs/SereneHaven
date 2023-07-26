import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SpotImages.css'

export default function SpotImages() {
    const detailState = useSelector(state => state.spot.spotDetails);

    const prevImg = detailState?.spotImages?.find(img => img.preview);
    const smallImages = detailState?.spotImages?.filter(img => !img.preview);
    return (
        <div className='images-container'>
            <div className='large-image-container'>
                <img className='preview-image' src={prevImg.url} alt={`${detailState.name}`} />
            </div>
            <div className='small-image-container'>
                {smallImages.length === 1 &&
                    <>
                        {smallImages.map((image, i) => (
                            <div className='single-small-image-container' key={i}>
                                <img src={image.url} alt={detailState.name} className='small-images single-small-image' />
                            </div>
                        ))}
                    </>
                }
                {smallImages.length > 1 &&
                    <>
                        {smallImages.map((image, i) => (
                            <img key={i} src={image.url} alt={detailState.name} className='small-images' />
                        ))}
                    </>
                }
            </div>
        </div>
    )
}