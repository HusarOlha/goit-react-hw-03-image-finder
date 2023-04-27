import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34437408-b4cd804ff7a5ddcb629cd2aab';

const getImage = async ({ value, page }) => {
  const response = await axios.get(
    `${BASE_URL}?q=${value}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  const data = response.data;

  return data;
};

export default getImage;
