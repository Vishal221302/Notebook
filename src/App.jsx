import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import TopicDetail from './pages/TopicDetail';
import AddEditTopic from './pages/AddEditTopic';
import AdminLanguages from './pages/AdminLanguages';
import LanguageTopics from './pages/LanguageTopics';
import Login from './pages/Login';
import * as api from './utils/api';

function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const topicsRes = await api.getTopics();
      const langsRes = await api.getLanguages();
      setTopics(topicsRes.data);
      setLanguages(langsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const addTopic = async (newTopic) => {
    try {
      await api.addTopic(newTopic);
      fetchData();
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  const updateTopic = async (id, updatedTopic) => {
    try {
      await api.updateTopic(id, updatedTopic);
      fetchData();
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  const deleteTopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await api.deleteTopic(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting topic:", error);
      }
    }
  };

  const handleReorderTopics = async (newTopics) => {
    setTopics(newTopics);
    try {
      await api.reorderTopics(newTopics.map(t => t.id));
    } catch (error) {
      console.error("Error reordering topics:", error);
      fetchData(); // Rollback
    }
  };

  return (
    <Layout 
      topics={topics} 
      languages={languages} 
      isAdmin={isAdminPath && !!user} 
      user={user} 
      onLogout={handleLogout}
      onReorderTopics={handleReorderTopics}
    >
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<LanguageTopics languages={languages} user={user} />} />
        <Route path="/language/:id" element={<LanguageTopics languages={languages} user={user} />} />
        <Route path="/view-topic/:id" element={<TopicDetail readOnly={true} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
        <Route path="/add-topic" element={<AddEditTopic onSave={(data) => { addTopic(data); }} languages={languages} />} />


        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={
          <ProtectedRoute user={user}>
            <Home topics={topics} onDelete={deleteTopic} />
          </ProtectedRoute>
        } />
        <Route path="/admin/topic/:id" element={
          <ProtectedRoute user={user}>
            <TopicDetail topics={topics} onDelete={deleteTopic} />
          </ProtectedRoute>
        } />
        <Route path="/admin/add" element={
          <ProtectedRoute user={user}>
            <AddEditTopic onSave={addTopic} languages={languages} />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <ProtectedRoute user={user}>
            <AddEditTopic topics={topics} onSave={updateTopic} languages={languages} />
          </ProtectedRoute>
        } />
        <Route path="/admin/languages" element={
          <ProtectedRoute user={user}>
            <AdminLanguages languages={languages} onUpdate={fetchData} />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
