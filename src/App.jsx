import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Messages from './components/Messages'
import Bookings from './components/Bookings'
import Profile from './components/Profile'
import TravellerRegister from './components/TravellerRegister'
import TourGuideList from './components/TourGuideList'
import TourGuideDetail from './components/TourGuideDetail'
import CheckAvailability from './components/CheckAvailability'
import Checkout from './components/Checkout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<TravellerRegister />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/guides" element={<TourGuideList />} />
          <Route path="/guides/:id" element={<TourGuideDetail />} />
          <Route path="/guides/:id/availability" element={<CheckAvailability />} />
          <Route path="/guides/:id/checkout" element={<Checkout />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App