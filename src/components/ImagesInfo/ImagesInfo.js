import { Component } from 'react';
import PropTypes from 'prop-types';
import pixabayApi from '../pixabay-api';
import ImagesErrorView from '../ImagesErrorView';
import ImagePendingView from '../ImagePendingView';
import ImageGallery from '../ImageGallery';
import Button from '../Button';

class ImagesInfo extends Component {
  state = {
    images: [],
    error: null,
    status: 'idle',
    page: 1,
  };

  static propTypes = {
    requestKey: PropTypes.string.isRequired,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.requestKey;
    const nextName = this.props.requestKey;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevName !== nextName) {
      this.setState({ images: [], error: null});
      this.renderNewRequestKey(nextName, nextPage);
    }
 
    if (prevPage !== nextPage && prevPage < nextPage) {
      this.renderMorePages(nextName, nextPage)
    }
  };

  renderNewRequestKey = (nextName)=> {
    this.setState({ status: 'pending' });
    let nextPage = 1;
    
    pixabayApi
      .fetchImages(nextName, nextPage)
      .then(response => this.setState({images: response.hits}))
      .catch(error => this.setState({ error, status: 'rejected' }))
      .finally(() => this.setState({ status: 'resolved' }));    
  };


  renderMorePages = (nextName, nextPage) => {
    this.setState({ status: 'pending' });

    pixabayApi
      .fetchImages(nextName, nextPage)
      .then(response =>
        this.setState((prevState) => ({
          images: [...prevState.images, ...response.hits],
        })))
      .catch(error => this.setState({ error, status: 'rejected' }))
      .finally(() => this.setState({ status: 'resolved' }));    
  };

  onClickLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { status, error } = this.state; 

    if (status === 'idle') {
      return <p>Please enter your search term</p>;
    }
    
    if (status === 'pending') {
      return <ImagePendingView />;
    }

    if (status === 'rejected') {
      return <ImagesErrorView message={error.message} />;
    }
 
    if (status === 'resolved') {
      return (
        <>
          <ImageGallery images={this.state.images} />
          <Button onClick={this.onClickLoadMore} page={this.state.page} />
        </>
      );
    }
  }
}

export default ImagesInfo;