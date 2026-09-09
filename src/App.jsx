import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GalleryProvider } from "./context/GalleryContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import GalleryPage from "./pages/GalleryPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import ArtworkForm from "./pages/ArtworkForm";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <LanguageProvider>
      <GalleryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="gallery/add" element={<ArtworkForm />} />
              <Route path="gallery/:id" element={<ArtworkDetail />} />
              <Route path="gallery/:id/edit" element={<ArtworkForm />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GalleryProvider>
    </LanguageProvider>
  );
}

export default App;