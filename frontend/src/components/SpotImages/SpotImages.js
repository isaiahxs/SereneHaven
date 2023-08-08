import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageModal from './ImageModal';
import OpenModalButton from '../OpenModalButton';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SpotImages.css'

export default function SpotImages() {
    const detailState = useSelector(state => state.spot.spotDetails);
    const allImages = detailState?.spotImages

    // const prevImg = detailState?.spotImages?.find(img => img.preview);
    // const smallImages = detailState?.spotImages?.filter(img => !img.preview);

    const renderImage = (image) => (
        <OpenModalButton
            modalComponent={<ImageModal src={image.url} alt={detailState.name} />}
            buttonText={<img key={image.id} src={image.url} alt={detailState.name} className='small-images' />}
        />
    );

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        responsive: [
            {
                breakpoint: 670,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div className='images-container'>
            <div className='small-image-container'>
                <Slider {...settings}>
                    {allImages.map((image, i) => (
                        // <div key={i}>
                        //     <img src={image.url} alt={detailState.name} className='small-images' />
                        // </div>

                        <div key={i}>
                            <OpenModalButton
                                modalComponent={<ImageModal className='img-modal' src={image.url} alt={detailState.name} />}
                                buttonText={<img key={image.id} src={image.url} alt={detailState.name} className='small-images' />}
                                className='img-carousel'
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}