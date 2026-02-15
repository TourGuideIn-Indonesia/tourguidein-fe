import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TravellerRegister from './components/TravellerRegister'
import TourGuideList from './components/TourGuideList'
import TourGuideDetail from './components/TourGuideDetail'
import CheckAvailability from './components/CheckAvailability'
import Checkout from './components/Checkout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TravellerRegister />} />
        <Route path="/guides" element={<TourGuideList />} />
        <Route path="/guides/:id" element={<TourGuideDetail />} />
        <Route path="/guides/:id/availability" element={<CheckAvailability />} />
        <Route path="/guides/:id/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App