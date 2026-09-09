import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { isId } = useLanguage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="text-[140px] sm:text-[180px] font-serif font-bold text-brass/20 leading-none mb-4">
          404
        </div>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-brass" />
          <span className="text-[10px] text-brass tracking-[0.3em] uppercase font-sans font-bold">
            {isId ? "Hilang Dalam Sejarah" : "Lost in History"}
          </span>
          <div className="h-[1px] w-12 bg-brass" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 italic">
          {isId ? "Halaman Tidak Ditemukan" : "Page Not Found"}
        </h1>
        <p className="text-sepia mb-10 max-w-md mx-auto text-base sm:text-lg font-light">
          {isId 
            ? "Tampaknya halaman arsip yang Anda cari tidak tercatat dalam buku sejarah kami."
            : "It seems the page you are looking for has been lost to the annals of history."}
        </p>
        <Link to="/">
          <Button variant="primary" className="rounded-full">
            {isId ? "Kembali ke Beranda" : "Return to Home"}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
