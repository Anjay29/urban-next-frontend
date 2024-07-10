import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Oauth from '../components/Oauth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'https://urban-next-backend.vercel.app/api/v1/signup',
        formData
      );
      setError(res.data.message);
      navigate('/signin');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'An error occurred');
        console.log(error.response.data);
      } else {
        setError('Something went wrong, try later!');
        console.log('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-8 space-y-3">
      <h1 className="text-xl sm:text-2xl font-semibold">Sign Up</h1>

      <div className="flex flex-col space-y-2 w-[14rem] sm:w-[20rem]">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="rounded-md px-2 py-1 border-0 text-[.8rem] focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="E-mail"
          id="email"
          className="rounded-md px-2 py-1 border-0 text-[.8rem] focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Name"
          id="name"
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
          {loading ? 'Loading...' : 'SIGN UP'}
        </button>
        <Oauth />

        <p className="text-[.7rem] pl-1">
          Have an account?{'  '}
          <span className="text-blue-700">
            <Link to={'/signin'}>click here</Link>
          </span>
        </p>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignUp;
