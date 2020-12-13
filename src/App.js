import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './components/Searchbar';
import ImagesInfo from './components/ImagesInfo';
import './app.css';

class App extends Component {
  state = {
    requestKey: '',
  }
  
  handleFormSubmit = requestKey => {
    this.setState({ requestKey });
  }

  render() {
    return (
      <>
        <Searchbar onSubmit={this.handleFormSubmit}></Searchbar>
        <ImagesInfo requestKey={this.state.requestKey} />
        <ToastContainer autoClose={3000} />
      </>  
    )
  }
}

export default App;
