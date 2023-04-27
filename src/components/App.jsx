import { Component } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery';
import Modal from './Modal';
import { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    value: '',
    imgUrl: '',
    showModal: false,
  };

  toggleModal = imgUrl => {
    this.setState(({ showModal }) => ({ showModal: !showModal, imgUrl }));
  };

  handleSubmit = value => {
    this.setState({ value });
  };
  render() {
    const { showModal, imgUrl } = this.state;
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            duration: 5000,
            style: {
              background: 'white',
              color: 'black',
            },

            success: {
              duration: 500,
            },
          }}
        ></Toaster>
        <SearchBar onSearch={this.handleSubmit}></SearchBar>
        <ImageGallery
          value={this.state.value}
          onModal={this.toggleModal}
        ></ImageGallery>

        {showModal && <Modal onClose={this.toggleModal} img={imgUrl}></Modal>}
      </>
    );
  }
}
