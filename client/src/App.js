import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import DeleteAccount from './pages/DeleteAccount';
import VerifyEmail from './pages/VerifyEmail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/accounts/login' element={<Login />} />
          <Route path='/accounts/register' element={<Register />} />
          <Route path='/accounts/change-password' element={<ChangePassword />} />
          <Route path='/accounts/profile' element={<Profile />} />
          <Route path='/accounts/delete-account' element={<DeleteAccount />} />
          <Route path='/accounts/verify/:uid/:rtoken/:atoken' element={<VerifyEmail />} />
          <Route path='*' element={<p>404 Page Not Found</p>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
