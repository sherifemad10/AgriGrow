import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Roadmap from "./pages/Roadmap";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

function MainContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedSpecialty, setSelectedSpecialty] = useState("الزراعة الرقمية");
  const [redirectNotice, setRedirectNotice] = useState("");

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith("#roadmap")) {
        setCurrentPage("roadmap");
        if (hash.includes("hydroponics") || hash.includes("مائية")) {
          setSelectedSpecialty("الزراعة المائية");
        } else if (hash.includes("soil") || hash.includes("أراضي") || hash.includes("مياه")) {
          setSelectedSpecialty("الأراضي والمياه");
        } else if (hash.includes("digital") || hash.includes("رقمية")) {
          setSelectedSpecialty("الزراعة الرقمية");
        }
      } else if (hash.startsWith("#login")) {
        setCurrentPage("login");
      } else if (hash.startsWith("#admin")) {
        setCurrentPage("admin");
      } else {
        setCurrentPage("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page, specialty, notice) => {
    setCurrentPage(page);
    if (specialty) {
      setSelectedSpecialty(specialty);
    }
    if (notice) {
      setRedirectNotice(notice);
    } else {
      setRedirectNotice("");
    }

    if (page === "home") {
      window.location.hash = "home";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === "roadmap") {
      window.location.hash = "roadmap";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === "login") {
      window.location.hash = "login";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === "admin") {
      window.location.hash = "admin";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f1] font-sans antialiased text-slate-800" dir="rtl">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
      />

      {currentPage === "home" && (
        <Home 
          onNavigate={handleNavigate} 
          onSelectSpecialty={(spec) => handleNavigate("roadmap", spec)} 
        />
      )}

      {currentPage === "roadmap" && (
        <Roadmap 
          specialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
          onBack={() => handleNavigate("home")}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "login" && (
        <Login onNavigate={handleNavigate} redirectNotice={redirectNotice} />
      )}

      {currentPage === "admin" && (
        <AdminDashboard onNavigate={handleNavigate} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
