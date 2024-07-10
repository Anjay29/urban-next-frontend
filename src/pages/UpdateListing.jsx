import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { app } from '../firebase.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    useRef: currentUser._id,
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // console.log(files);
  // console.log(typeof files);
  // console.log(formData);
  // console.log(files.length + formData.imageUrls.length);
  // console.log(id);

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await axios.get(
          `https://urban-next-backend.vercel.app/api/v1/listing/get/${id}`
        );
        // console.log(res.data);
        setFormData(res.data);
      } catch (error) {
        console.log('Problem in getting listing');
      }
    };

    fetching();
  }, []);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const uploadImagePromises = [];
      for (let i = 0; i < files.length; i++) {
        uploadImagePromises.push(storeImage(files[i]));
      }

      setUploading(true);
      try {
        // Await all promises to complete
        const downloadURLs = await Promise.all(uploadImagePromises);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(downloadURLs),
        });
        setUploading(false);
        setImageUploadError('All images uploaded successfully:');
      } catch (error) {
        console.log('Something went wrong during uploading the images', error);
        setImageUploadError('Image must be less than 2MB');
        setUploading(false);
      }
    } else if (files.length == 0) {
      console.log('Please select atleast 1 image.');
      setImageUploadError('Please select atleast 1 image.');
      setUploading(false);
    } else {
      console.log('Please upload between 1 to 6 images.');
      setImageUploadError('Maximum 6 image can be uploaded');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTaskSnapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      return downloadURL;
    } catch (error) {
      console.log('Error during uploading firebase', error);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError('Must upload atleast 1 image');
      }

      if (+formData.discountPrice > +formData.regularPrice) {
        return setError(
          'Regular Price must have more value than Distcount Price'
        );
      }

      setLoading(true);
      const res = await axios.post(
        `https://urban-next-backend.vercel.app/api/v1/update-listing/${id}`,
        formData
      );
      // console.log(res.data.message);
      setError(res.data.message);
      setLoading(false);
      navigate(`/listing/${id}`);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="2"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 active:translate-y-px"
            >
              {uploading ? 'uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-600 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-2 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-22 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 active:translate-y-px"
          >
            {loading ? 'Updating...' : 'Update listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
