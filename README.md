# <a href="https://serene-haven.onrender.com/" target="_blank">SereneHaven</a>

SereneHaven is a dynamic web application that empowers users to seamlessly manage rental listings, comments, bookings, and favorites. Offering a comprehensive range of functionalities - creation, viewing, updating, and deletion - SereneHaven was developed using React.js, Redux, JavaScript, HTML, and CSS for the frontend, and Express, Node.js, and PostgreSQL for the backend. This project aims to provide an intuitive and feature-rich platform for an enhanced location-rental experience.

The live site can be found [here](https://serene-haven.onrender.com/).

## Project Overview

Independently created a responsive web application that allows users to post, view, book, review, and rate locations, using JavaScript, Node.js, Express, React, Redux, and PostgreSQL.

- Engineered the backend with Node.js & Express, designing RESTful APIs for CRUD operations on 'Spots' (places available for booking) & user reviews, while managing data with PostgreSQL.
- Implemented user authentication & authorization checks using Express middleware to secure data access, & created form validations for error-free user input.
- Constructed the frontend using React & Redux, integrating responsive design practices for optimal user experience on desktop & mobile platforms.

## Technologies Used

- JavaScript
- Node.js
- Express
- React
- Redux
- PostgreSQL

## Features

- Create, read, update, and delete spots
- Post and manage user reviews
- Booking functionality for locations
- Favoriting and unfavorite locations

## Challenges and Solutions

During the development of SereneHaven, I encountered several challenges that led to valuable learning experiences:

### Handling Data Management

Creating a seamless data flow for spots, reviews, and bookings was crucial. I utilized Express to design API endpoints that allowed for easy CRUD operations, maintaining data integrity in PostgreSQL.

### User Authentication and Data Security

Ensuring user authentication and data security were paramount. I implemented user authentication and authorization checks using Express middleware, safeguarding sensitive data and enhancing user privacy.

### Responsive User Interface

To offer an optimal user experience across devices, I employed responsive design principles in React. The interface adapts to various screen sizes, providing a consistent and intuitive experience.

### Form Validations and User Input


### State Management and Redux

Managing the application's state efficiently was essential. I integrated Redux to manage state changes across components, enabling seamless data updates and interactions.

### Testing and Debugging

Thorough testing and debugging were crucial to identify and rectify issues. I employed tools like Redux DevTools and debugging tools in the browser to ensure a stable and reliable application.


## Code Snippets

### Breakdown of SpotId Component

#### State and Variables:
Declaring and initializing `currentSpotReviews` using the `useSelector` hook to fetch reviews related to the current spot.
Creating an empty array `currentSpotReviewsArray` to hold transformed review objects.

```
    const currentSpotReviews = useSelector(state => state.review.currSpotReviews);

    let currentSpotReviewsArray = [];
    if (currentSpotReviews) {
        currentSpotReviewsArray = Object.values(currentSpotReviews);
        const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
        const averageStars = currentSpotReviewsArray.length > 0 ? totalStars / currentSpotReviewsArray.length : 0;
    }
```

#### Data Transformation:
If `currentSpotReviews` has data, transform it into an array `currentSpotReviewsArray`.

Calculate the `totalStars` by adding up all the review stars.

Calculate the `averageStars` by dividing the total stars by the number of reviews.

```
    const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
    const averageStars = totalStars / currentSpotReviewsArray.length;
```

#### State and Dispatch:
Use the `useState` hook to manage the `showDeleteModal` state and `reviewToDelete`.

Create a `dispatch` variable using the `useDispatch` hook.

Get the `spotId` from the URL using the `useParams` hook.

```
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const dispatch = useDispatch();
    const { spotId } = useParams();
```

#### Fetching Data and Component Lifecycle:

Use the `useEffect` hook to fetch data based on user authentication.

Dispatch actions for fetching spot bookings, spot details, and reviews.

Clear spot details when the component unmounts.

```
    useEffect(() => {
        if (sessionUser) {
            let fetchData = async () => {
                // Wait for spotBookingsThunk to resolve before proceeding
                await dispatch(spotBookingsThunk(spotId));
                dispatch(spotDetails(spotId));
                dispatch(reviewThunk(spotId));
            };
            fetchData();
        } else {
            let fetchData = async () => {
                dispatch(spotDetails(spotId));
                dispatch(reviewThunk(spotId));
            };
            fetchData();
        }

        // Clear the spot details when the component unmounts
        return () => {
            dispatch(clearDetails());
        }
    }, [dispatch, sessionUser, spotId]);
```

#### Handling Review Deletion:

Use another `useEffect` to handle showing the delete modal when `reviewToDelete` changes

```
    useEffect(() => {
        if (reviewToDelete !== null) {
            setShowDeleteModal(true);
        }
    }, [reviewToDelete])
```

#### Conditional Rendering:

If `detailState` and `currentSpotReviews` are available, render the spot details

```
    if (detailState && currentSpotReviews) {
        return (
          ...
        )
    }
```

#### Spot Details Rendering:

Render spot details, such as name, city, state, and country.

If a user is authenticated and not the owner, show the "Favorites" component.

```
<h1 className='name'>{detailState.name}</h1>
  <div className='spot-detail-header'>
    <h2 className='heading'>
      <div>
        {detailState.city}, {detailState.state}, {detailState.country}
      </div>
    </h2>
  </div>

  {sessionUser && detailState.Owner.id !== sessionUser.id &&
    <Favorites spotId={spotId} />
  }
```

#### Spot Images + Owner Information:

Render spot images using the `SpotImages` component.

```
<SpotImagse />
```

Render owner information and description.

```
  <div className='owner-info'>
    {!sessionUser &&
      <h2 className='host-name'>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</h2>
    }

    {sessionUser && detailState.Owner.id !== sessionUser.id &&
      <h2 className='host-name'>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</h2>
    }

    {sessionUser && detailState.Owner.id === sessionUser.id &&
      <h2 className='host-name'>Hosted by you</h2>
    }
      <h3 className='detail-description'>{detailState.description}</h3>
  </div>
```