import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import LibraryPage from './pages/LibraryPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/" element={<LibraryPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        {/* Chat route will go here next */}
      </Routes>
    </Router>
  );
}

export default App;
