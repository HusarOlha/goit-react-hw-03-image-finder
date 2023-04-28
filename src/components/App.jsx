import { Component } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery';
import Modal from './Modal';
import { Toaster } from 'react-hot-toast';
import getImage from './services/getImage';
import { toast } from 'react-hot-toast';

export class App extends Component {
  state = {
    data: [],
    value: '',
    imgUrl: '',
    showModal: false,
    page: 1,
    status: 'idle',
  };
  async componentDidUpdate(prevProps, prevState) {
    const { value, page } = this.state;

    try {
      if (prevState.value !== value) {
        this.setState({ status: 'pending', page: 1 });
        const data = await getImage({
          value,
          page,
        });

        this.setState({
          data: data.images,
          status: 'resolved',
          totalHits: data.totalHits,
          loading: false,
        });
        if (data.totalHits >= 1) {
          toast.success(`Found ${data.totalHits} images`);
        } else {
          toast.error('Sorry, we can not find any pictures');
        }
      }
    } catch (error) {
      this.setState({ status: 'rejected' });
      toast.error('Failed to fetch images. Please try again later.');
    }
  }

  handleLoad = async () => {
    const { value, page } = this.state;
    try {
      this.setState({ loading: true });
      const newData = await getImage({ value, page: page + 1 });
      this.setState(prevState => ({
        data: [...prevState.data, ...newData.images],
        status: 'resolved',
        loading: false,
        page: prevState.page + 1,
      }));
    } catch (error) {
      this.setState({ status: 'rejected' });
      toast.error('Failed to fetch images. Please try again later.');
    }
  };

  toggleModal = imgUrl => {
    this.setState(({ showModal }) => ({ showModal: !showModal, imgUrl }));
  };

  handleSubmit = value => {
    this.setState({ value, page: 1 });
  };
  render() {
    const { showModal, imgUrl, data, status, loading, totalHits } = this.state;
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
          onModal={this.toggleModal}
          data={data}
          status={status}
          loading={loading}
          totalHits={totalHits}
          onLoad={this.handleLoad}
        ></ImageGallery>

        {showModal && <Modal onClose={this.toggleModal} img={imgUrl}></Modal>}
      </>
    );
  }
}
