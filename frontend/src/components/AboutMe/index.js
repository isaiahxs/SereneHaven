import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import pfp from '../../assets/images/profile-picture.jpg';
import linkedin from '../../assets/linkedin-logo.svg';
import github from '../../assets/github-logo.svg';
import epiceshop from '../../assets/images/Epic-Home.png';
import welldone from '../../assets/images/WD-Home-1.png';
import './AboutMe.css'

export default function AboutMe() {
    return (
        <div className='about-me-container'>
            <div className='about-me-image-container'>
                <img className='about-me-image' src={pfp} alt="Profile Picture of Isaiah Sinnathamby" />
            </div>

            <div className='about-me-details'>
                <h1>Isaiah Sinnathamby</h1>
                <div>Full-stack developer with a passion for building dynamic web applications.</div>
                <a href='https://www.isaiahxs.com/'>Portfolio Website</a>
            </div>

            <div className='about-me-body-container'>
                <div className='about-me-body'>

                    <h2 className='body-headers'>Check out my socials!</h2>
                    <div className='socials'>
                        <div className='linked-in'>
                            <div className='about-img-container'>
                                <a href='https://www.linkedin.com/in/isaiahxs/' target='_blank' rel='noopener noreferrer'>
                                    <img className='social-logo linked-in-logo' src={linkedin} alt='LinkedIn Logo' />
                                </a>
                            </div>
                            <div className='social-links'>
                                <a href='https://www.linkedin.com/in/isaiahxs/' target='_blank' rel='noopener noreferrer'>LinkedIn</a>
                            </div>
                        </div>
                        <div className='github'>
                            <div className='about-img-container'>
                                <a href='https://github.com/isaiahxs' target='_blank' rel='noopener noreferrer'>
                                    <img className='social-logo github-logo' src={github} alt='GitHub Logo' />
                                </a>
                            </div>
                            <div className='social-links'>
                                <a href='https://github.com/isaiahxs' target='_blank' rel='noopener noreferrer'>GitHub</a>
                            </div>
                        </div>
                    </div>

                    <div className='other-projects'>
                        <div className='epic-e-shop'>
                            <a className='project-name' href='https://epic-e-shop.onrender.com/' target='_blank' rel='noopener noreferrer'>Epic-E-Shop</a>
                            <div className='about-img-container'>
                                <a href='https://epic-e-shop.onrender.com/' target='_blank' rel='noopener noreferrer'>
                                    <img className='project-image' src={epiceshop} alt='epic-e-shop project' />
                                </a>
                            </div>
                            <div className='project-links'>
                                <a href='https://epic-e-shop.onrender.com/' target='_blank' rel='noopener noreferrer'>Live Site</a>
                                <div className='separator'>|</div>
                                <a href='https://github.com/isaiahxs/Epic-E-Shop' target='_blank' rel='noopener noreferrer'>GitHub Repo</a>
                            </div>
                        </div>

                        <div className='well-done'>
                            <a className='project-name' href='https://well-done.onrender.com/' target='_blank' rel='noopener noreferrer'>Well-Done</a>
                            <div className='about-img-container'>
                                <a href='https://well-done.onrender.com/' target='_blank' rel='noopener noreferrer'>
                                    <img className='project-image' src={welldone} alt='well-done project' />
                                </a>
                            </div>
                            <div className='project-links'>
                                <a href='https://well-done.onrender.com/' target='_blank' rel='noopener noreferrer'>Live Site</a>
                                <div className='separator'>|</div>
                                <a href='https://github.com/isaiahxs/well-done-group-project' target='_blank' rel='noopener noreferrer'>GitHub Repo</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}