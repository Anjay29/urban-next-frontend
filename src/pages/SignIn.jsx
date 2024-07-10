import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  signInFailure,
  signInStart,
  signInSuccess,
  refreshPage,
} from '../redux/user/userSlice';
import Oauth from '../components/Oauth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshPage());
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'identifier') {
      // Check if the input value is an email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(value)) {
        setFormData({
          ...formData,
          email: value,
        });
      } else {
        setFormData({
          ...formData,
          username: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true)
    dispatch(signInStart());
    try {
      const res = await axios.post(
        'https://urban-next-backend.vercel.app/api/v1/login',
        formData
      );
      // setError(res.data.message);
      dispatch(signInSuccess(res.data));
      // console.log(res.data);
      navigate('/');
    } catch (error) {
      if (error.response) {
        // setError(error.response.data.message || "An error occurred");
        dispatch(
          signInFailure(error.response.data.message) || 'An error occurred'
        );
        console.log(error.response.data);
      } else {
        // setError("Something went wrong, try later!");
        dispatch('Something went wrong, try later!');
        console.log('Error:', error.message);
      }
    }
    // finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-8 space-y-3">
      <h1 className="text-xl sm:text-2xl font-semibold">Sign In</h1>

      <div className="flex flex-col space-y-2 w-[14rem] sm:w-[20rem]">
        <input
          type="text"
          id="identifier"
          placeholder="Username/Email"
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
          onClick={handleSubmit}
        >
          {loading ? 'Loading...' : 'SIGN IN'}
        </button>
        <Oauth />
        <p className="text-[.7rem] pl-1">
          Dont have an account?{'  '}
          <span className="text-blue-700">
            <Link to={'/signup'}>click here</Link>
          </span>
        </p>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignIn;
