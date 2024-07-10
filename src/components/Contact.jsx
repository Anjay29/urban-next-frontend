import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  // console.log(listing);
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await axios.get(
          `https://urban-next-backend.vercel.app/api/v1/user/${listing.useRef}`
        );
        setLandlord(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchLandlord();
  }, []);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{' '}
            for <span className="font-semibold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 active:translate-y-px"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
