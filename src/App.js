import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import './app.css';

import pixabayApi from './components/pixabay-api';
import ImagesErrorView from './components/ImagesErrorView';
import ImagePendingView from './components/ImagePendingView';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Searchbar from './components/Searchbar';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class App extends Component {
  state = {
    error: null,
    status: 'idle',
    requestKey: '',
    page: 1,
    images: [],
  };

  static propTypes = {
    requestKey: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
  };

  handleFormSubmit = newRequestKey => {
    this.setState({ requestKey: newRequestKey, page: 1, images: [] });
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevState.requestKey;
    const nextName = this.state.requestKey;

    if (prevName !== nextName) {
      this.renderImages();
    }
  }

  renderImages = () => {
    const { requestKey, page } = this.state;

    pixabayApi
      .fetchImages(requestKey, page)
      .then(response =>
        this.setState(prevState => ({
          images: [...prevState.images, ...response.hits],
          page: prevState.page + 1,
        })),
      )
      .catch(error => this.setState({ error, status: Status.REJECTED }))
      .finally(() => this.setState({ status: Status.RESOLVED }));
  };

  render() {
    const { status, error } = this.state;

    return (
      <>
        <Searchbar onSubmit={this.handleFormSubmit}></Searchbar>
        <ToastContainer autoClose={3000} />

        {status === Status.IDLE && (
          <p className="welcomeText">Please enter your search term</p>
        )}

        {status === Status.PENDING && <ImagePendingView />}

        {status === Status.REJECTED && (
          <ImagesErrorView message={error.message} />
        )}

        {status === Status.RESOLVED && (
          <>
            <ImageGallery images={this.state.images} />
            <Button onClick={this.renderImages} />
          </>
        )}
      </>
    );
  }
}

export default App;
