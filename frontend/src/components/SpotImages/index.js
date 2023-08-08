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
        // centerPadding: "150px",
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
            {/* <div className='large-image-container'> */}
            {/* <img className='preview-image' src={prevImg.url} alt={`${detailState.name}`} /> */}
            {/* </div> */}
            <div className='small-image-container'>
                <Slider {...settings}>
                    {allImages.map((image, i) => (
                        <div key={i}>
                            <img src={image.url} alt={detailState.name} className='small-images' />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}


{/* <div className='large-image-container'>
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
            </div> */}


{/* <div className='large-image-container'>
                <OpenModalButton
                    modalComponent={<ImageModal src={prevImg.url} alt={`${detailState.name}`} />}
                    buttonText={<img className='preview-image' src={prevImg.url} alt={`${detailState.name}`} />}
                />
            </div>
            <div className='small-image-container'>
                {smallImages.length === 1 &&
                    <>{smallImages.map(renderImage)}</>
                }
                {smallImages.length > 1 &&
                    <>{smallImages.map(renderImage)}</>
                }
            </div> */}