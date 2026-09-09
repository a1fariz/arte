import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import Button from "./ui/Button";
import { useLanguage } from "../context/LanguageContext";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel }) => {
  const { t } = useLanguage();
  const titleId = useId();
  const cancelRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    cancelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-ivory border border-warm-gray p-8 max-w-md w-full shadow-medium rounded-3xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id={titleId} className="font-serif text-2xl text-ink font-bold italic">{title}</h3>
            <p className="text-sepia text-sm leading-relaxed font-light">{message}</p>
            <div className="flex justify-end gap-3 pt-4 border-t border-warm-gray">
              <Button
                ref={cancelRef}
                variant="secondary"
                size="sm"
                onClick={onCancel}
                className="rounded-full"
              >
                {t("confirmCancel")}
              </Button>
              <Button variant="danger" size="sm" onClick={onConfirm} className="rounded-full">
                {confirmLabel || t("confirmDelete")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
