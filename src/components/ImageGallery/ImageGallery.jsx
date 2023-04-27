import { Component } from 'react';
import ImageGalleryItem from 'components/ImageGalleryItem';
import getImage from 'components/services/getImage';
import { Loader } from 'components/Loader/Loader.jsx';
import { Gallery, ImageSection } from './ImageGallery.styled.jsx';
import { toast } from 'react-hot-toast';
import { Button } from '../Button/Button';
import PropTypes from 'prop-types';

class ImageGallery extends Component {
  state = {
    images: [],
    status: 'idle',
    page: 1,
    totalHits: 0,
    loading: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    const { page } = this.state;
    try {
      if (prevProps.value !== value) {
        this.setState({ status: 'pending', page: 1 });
        const data = await getImage({
          value,
          page,
        });
        this.setState({
          images: data.hits,
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
      if (prevState.page !== page) {
        const newData = await getImage({
          value,
          page,
        });

        this.setState(prevState => ({
          images: [...prevState.images, ...newData.hits],
          status: 'resolved',
          loading: false,
        }));
      }
    } catch (error) {
      this.setState({ status: 'rejected' });
      toast.error('Failed to fetch images. Please try again later.');
    }
  }

  handleLoad = () => {
    this.setState(prevState => ({ loading: true, page: prevState.page + 1 }));
  };
  render() {
    const { images, status, totalHits, loading } = this.state;

    const { onModal } = this.props;

    return (
      <ImageSection>
        {status === 'pending' && <Loader></Loader>}

        {images !== null && images.length > 0 && status === 'resolved' && (
          <Gallery>
            {images.map((image, index) => (
              <ImageGalleryItem
                key={`${image.id}-${index}`}
                image={image.webformatURL}
                ModalImg={image.largeImageURL}
                onModal={onModal}
              />
            ))}
          </Gallery>
        )}
        {loading && <Loader></Loader>}
        {!loading && totalHits > images.length && status === 'resolved' && (
          <Button onClick={this.handleLoad}>Load more</Button>
        )}
      </ImageSection>
    );
  }
}

ImageGallery.propTypes = {
  value: PropTypes.string.isRequired,
  onModal: PropTypes.func.isRequired,
};

export default ImageGallery;
