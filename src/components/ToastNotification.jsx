import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import './ToastNotification.css';

const ToastNotification = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="toast-item"
            onClick={() => removeToast(toast.id)}
          >
            <Trophy size={28} color="#fcd34d" />
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#fcd34d' }}>¡Logro Desbloqueado!</strong>
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold' }}>{toast.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
