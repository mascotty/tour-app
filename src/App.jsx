import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import Favorites from './pages/Favorites';
import Register from './pages/Register';
import Login from './pages/Login';


import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px - 60px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="*" element={<NotFound />} /> {/* 新增 */}
          <Route path="/favorite" element={<Favorites />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}


export default App;
