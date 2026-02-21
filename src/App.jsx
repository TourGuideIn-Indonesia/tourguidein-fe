import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Messages from './components/Messages'
import Bookings from './components/Booking'
import BookingDetail from './components/BookingDetail'
import Profile from './components/Profile'
import TravellerRegister from './components/TravellerRegister'
import TravellerLogin from './components/TravellerLogin'
import TourGuideList from './components/TourGuideList'
import TourGuideDetail from './components/TourGuideDetail'
import CheckAvailability from './components/CheckAvailability'
import Checkout from './components/Checkout'
import ChatPage from './components/ChatPage';
import ExtraOrderDetail  from './components/ExtraOrderDetail ';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
  }, []);
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<TravellerRegister />} />
          <Route path="/traveller/login" element={<TravellerLogin />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/bookings/extras/:id" element={<ExtraOrderDetail  />} />
          <Route path="/guides" element={<TourGuideList />} />
          <Route path="/guides/:id" element={<TourGuideDetail />} />
          <Route path="/guides/:id/availability" element={<CheckAvailability />} />
          <Route path="/guides/:id/checkout" element={<Checkout />} />
          <Route path="/chat/:orderId" element={<ChatPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App