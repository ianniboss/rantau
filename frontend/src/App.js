import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import EventNew from '@/pages/EventNew';
import Resources from '@/pages/Resources';
import ResourceNew from '@/pages/ResourceNew';
import Community from '@/pages/Community';
import PostDetail from '@/pages/PostDetail';
import PostNew from '@/pages/PostNew';
import Cities from '@/pages/Cities';
import CityHub from '@/pages/CityHub';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/new" element={guard(<EventNew />)} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/new" element={guard(<ResourceNew />)} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/new" element={guard(<PostNew />)} />
              <Route path="/community/:postId" element={<PostDetail />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/cities/:cityId" element={<CityHub />} />
              <Route path="/profile" element={guard(<Profile />)} />
              <Route path="/profile/:uid" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
