import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";
import Listing from "./pages/Listing.jsx";
import Search from "./pages/Search.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* yha pe listing ki id hogi not user ki id */}
        <Route path="/listing/:id" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
