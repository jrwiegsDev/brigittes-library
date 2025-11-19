import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Library from './pages/Library';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Books from './pages/admin/Books';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute superAdminOnly>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/books"
                  element={
                    <ProtectedRoute>
                      <Books />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
