import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import Favorites from './pages/Favorites';
import Register from './pages/Register';
import Login from './pages/Login';
import AddTourForm from './pages/AddTourForm';
import MyTours from './pages/MyTours';
import EditTour from './pages/EditTour';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import { Layout } from 'antd';

function App() {
  return (
    <Layout>
      <Header />
      {/* <Layout style={{ padding: 24, marginLeft: 200 }}> */}
      <Layout style={{ padding: 12, marginLeft: 200, background: '#fff' }}>

        <div style={{ minHeight: 'calc(100vh - 64px - 60px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="*" element={<NotFound />} /> {/* 新增 */}
            <Route path="/favorite" element={<Favorites />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-tour" element={<AddTourForm />} />
            <Route path="/my-tours" element={<MyTours />} />
            <Route path="/edit-tour/:id" element={<EditTour />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </div>
      </Layout>
      {/* <Footer /> */}
    </Layout>
  );
}


export default App;
