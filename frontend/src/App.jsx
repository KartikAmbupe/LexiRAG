import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import LibraryPage from "./pages/LibraryPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
        <div className="flex-1 overflow-hidden">
          <SignedIn>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/chat/:id" element={<ChatPage />} />
            </Routes>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </div>
      </div>
    </Router>
  );
}

export default App;
