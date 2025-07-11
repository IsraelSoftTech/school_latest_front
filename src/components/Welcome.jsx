import React, { useEffect, useState } from 'react';
import './Welcome.css';

const LETTERS = [
  { char: 'W', className: 'welcome-letter from-left color-w' },
  { char: 'E', className: 'welcome-letter from-top color-e' },
  { char: 'L', className: 'welcome-letter from-right color-l' },
  { char: 'C', className: 'welcome-letter from-bottom color-c' },
  { char: 'O', className: 'welcome-letter from-left color-o' },
  { char: 'M', className: 'welcome-letter from-top color-m' },
  { char: 'E', className: 'welcome-letter from-right color-e2' },
];

function Welcome({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeouts = [];
    // Animate each letter in sequence over 5s (7 letters, so ~0.7s per letter)
    for (let i = 0; i < LETTERS.length; i++) {
      timeouts.push(setTimeout(() => setVisibleCount(i + 1), Math.round((i * 5000) / LETTERS.length)));
    }
    // Fade out after all letters are in
    timeouts.push(setTimeout(() => setDone(true), 5200));
    // Call onComplete after fade out
    timeouts.push(setTimeout(() => onComplete && onComplete(), 6200));
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`welcome-screen${done ? ' fade-out' : ''}`}>
      <h1 className="welcome-letters">
        {LETTERS.map((l, i) => (
          <span
            key={i}
            className={l.className + (i < visibleCount ? ' visible' : '')}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            {l.char}
          </span>
        ))}
      </h1>
    </div>
  );
}

export default Welcome; 