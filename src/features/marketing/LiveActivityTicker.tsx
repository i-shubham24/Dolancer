import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const messages = [
  'Aarav from Pune just claimed a brief — ₹1,500',
  'Priya in Bangalore delivered a project — ₹4,200',
  'Rohan from Mumbai received payout — ₹3,800',
  'Sneha in Hyderabad claimed a copywriting brief — ₹2,100',
  'Vikram from Delhi completed brand identity — ₹6,500',
  'Ananya in Chennai started a new project — ₹2,800',
  'Karthik from Kolkata received ₹5,200 payout',
  'Divya in Jaipur claimed SEO audit brief — ₹1,800',
  'Arjun from Ahmedabad delivered presentation — ₹3,200',
  'Meera in Lucknow completed content writing — ₹2,400',
  'Rahul from Chandigarh just signed up',
  'Pooja in Indore claimed her first brief — ₹1,200',
  'Amit from Surat received ₹7,800 payout',
  'Neha in Bhopal delivered web design — ₹4,500',
  'Siddharth from Nagpur started React project — ₹5,000'
];

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function LiveActivityTicker() {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [shuffledMessages, setShuffledMessages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setShuffledMessages(shuffleArray(messages));
  }, []);

  useEffect(() => {
    if (shuffledMessages.length === 0) return;

    let timeoutId: number;

    const showNextMessage = () => {
      const msg = shuffledMessages[index % shuffledMessages.length];
      setCurrentMessage(msg);
      
      // Hide message after 4s
      setTimeout(() => {
        setCurrentMessage(null);
        setIndex((prev) => prev + 1);
        
        // Reshuffle after going through all
        if ((index + 1) % shuffledMessages.length === 0) {
          setShuffledMessages(shuffleArray(messages));
        }
      }, 4000);

      // Schedule next message 8-10s after THIS one started
      // So delay before next is 8000 + Math.random() * 2000
      const nextDelay = 8000 + Math.floor(Math.random() * 2000);
      timeoutId = window.setTimeout(showNextMessage, nextDelay);
    };

    // Initial delay before showing first message
    timeoutId = window.setTimeout(showNextMessage, 2000 + Math.floor(Math.random() * 2000));

    return () => clearTimeout(timeoutId);
  }, [shuffledMessages, index]);

  const variants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : 20 }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {currentMessage && (
          <motion.div
            key={currentMessage}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-sm border border-line-card rounded-2xl shadow-soft-md px-4 py-3 pointer-events-auto flex items-center gap-3"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-sm font-medium text-ink-2">{currentMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
