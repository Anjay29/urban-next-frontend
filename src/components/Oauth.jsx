import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const oauthHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      //   console.log(result.user);
      //   console.log(result);

      const data = {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      };

      const res = await axios.post(
        'https://urban-next-backend.vercel.app/api/v1/auth/google',
        data
      );
      //   console.log(res);
      dispatch(signInSuccess(res.data));
      navigate('/');
    } catch (error) {
      console.log('Something went wrong', error.message);
    }
  };

  return (
    <button
      onClick={oauthHandler}
      className="bg-red-600 rounded-md px-3 py-1.5 border-0 text-[.7rem] hover:bg-red-500 active:translate-y-px"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
};

export default Oauth;
