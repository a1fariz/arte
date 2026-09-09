import { useRef, useState } from "react";
import { motion } from "framer-motion";

// =========================================================================
// Magnetic Button Component
// Creates a tactile interactive effect where the button is physically "pulled"
// towards the mouse cursor when hovered, using spring physics.
// =========================================================================
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate distance between mouse cursor and the center of the button
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    
    // Distance from center: (cursor position - center position)
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    
    // Multiply by 0.3 to create subtle, controlled magnetic resistance
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  // Reset back to center when cursor exits
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ x: 0, y: 0 }}
      animate={{ x: position.x, y: position.y }}
      // Spring physics configuration: creates realistic elastic recoil
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default MagneticButton;
