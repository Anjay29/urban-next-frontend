import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';
import axios from 'axios';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  refreshPage,
} from '../redux/user/userSlice.js';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showListingsError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // console.log(formData);
  // console.log(userListings?.length);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    dispatch(refreshPage());
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await axios.post(
        `https://urban-next-backend.vercel.app/api/v1/update/${currentUser._id}`,
        formData
      );
      // console.log(res.data);
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess('User updated successfully!');
    } catch (error) {
      if (error.response) {
        dispatch(
          updateUserFailure(error.response.data.message || 'An error occurred')
        );
        // console.log(error.response.data);
      } else {
        dispatch(updateUserFailure('Something went wrong, try later!'));
        console.log('Error:', error.message);
      }
    }
  };

  const deleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      await axios.delete(
        `https://urban-next-backend.vercel.app/api/v1/delete/${currentUser._id}`
      );
      dispatch(deleteUserSuccess());
      navigate('/signin');
    } catch (error) {
      if (error.response) {
        dispatch(
          deleteUserFailure(error.response.data.message || 'An error occurred')
        );
        console.log(error.response.data);
      } else {
        dispatch(deleteUserFailure('Something went wrong, try later!'));
        console.log('Error:', error.message);
      }
    }
  };

  const handleSignout = async () => {
    dispatch(signOutUserStart());
    try {
      await axios.get('https://urban-next-backend.vercel.app/api/v1/signout');
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.log(error.message);
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await axios.get(
        `https://urban-next-backend.vercel.app/api/v1//listings/${currentUser._id}`
      );
      setUserListings(res.data);
      setShowListingError(false);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      await axios.delete(
        `https://urban-next-backend.vercel.app/api/v1/delete-listing/${listingId}`
      );
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-8 space-y-3 mb-5">
      <h1 className="text-xl sm:text-2xl font-semibold">Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2 w-[14rem] sm:w-[24rem]"
      >
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="Profile pic"
          onClick={() => fileRef.current.click()}
          className="h-[7rem] w-[7rem] rounded-full cursor-pointer self-center object-cover"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              Image successfully uploaded! Click Update
            </span>
          ) : (
            ''
          )}
        </p>

        <input
          type="text"
          id="name"
          defaultValue={currentUser.name}
          placeholder="Name"
          className="rounded-md px-2 py-1 border-0 text-[.8rem] focus:outline-none"
          onChange={handleChange}
        />

        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          placeholder="Username"
          className="rounded-md px-2 py-1 border-0 text-[.8rem] focus:outline-none"
          onChange={handleChange}
        />

        <input
          type="text"
          id="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="rounded-md px-2 py-1 border-0 text-[.8rem] focus:outline-none"
          onChange={handleChange}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="rounded-md px-2 py-1 border-0 text-[.8rem] focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-md px-3 py-1 border-0 text-[.8rem] hover:bg-slate-500 active:translate-y-px"
        >
          {loading ? 'Loading...' : 'UPDATE'}
        </button>

        <Link
          className="bg-green-800 text-white rounded-md justify-center text-center py-1 border-0 text-[.8rem] hover:bg-green-700 active:translate-y-px"
          to={'/create-listing'}
        >
          CREATE LISTING
        </Link>
      </form>

      <div className="flex justify-between w-[14rem] sm:w-[24rem] px-2">
        <span
          className="text-red-600 cursor-pointer text-[0.9rem]"
          onClick={deleteUser}
        >
          Delete account
        </span>
        <span
          className="text-red-600 cursor-pointer text-[0.9rem]"
          onClick={handleSignout}
        >
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {updateSuccess && <p className="text-green-500">{updateSuccess}</p>}

      <button onClick={handleShowListings} className="text-green-500 w-full">
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings?.length > 0 && (
        <div className="flex flex-col">
          <h1 className="text-center mt-4 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-2 flex justify-between items-center gap-4 w-[14rem] sm:w-[24rem]"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-20 w-20 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p className="overflow-hidden text-ellipsis">{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
