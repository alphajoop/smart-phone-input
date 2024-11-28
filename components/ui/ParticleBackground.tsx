'use client';
import React, { useState, useEffect } from 'react';

export default function ParticleBackground() {
  const [particles, setParticles] = useState<
    { size: string; left: string; top: string }[]
  >([]);

  useEffect(() => {
    const sizeClasses = ['w-1 h-1', 'w-2 h-2', 'w-3 h-3', 'w-4 h-4', 'w-5 h-5'];
    const leftClasses = [
      'left-[10%]',
      'left-[20%]',
      'left-[30%]',
      'left-[40%]',
      'left-[50%]',
      'left-[60%]',
      'left-[70%]',
      'left-[80%]',
      'left-[90%]',
    ];
    const topClasses = [
      'top-[10%]',
      'top-[20%]',
      'top-[30%]',
      'top-[40%]',
      'top-[50%]',
      'top-[60%]',
      'top-[70%]',
      'top-[80%]',
      'top-[90%]',
    ];

    const newParticles = Array.from({ length: 50 }, () => ({
      size: sizeClasses[Math.floor(Math.random() * sizeClasses.length)],
      left: leftClasses[Math.floor(Math.random() * leftClasses.length)],
      top: topClasses[Math.floor(Math.random() * topClasses.length)],
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
      {particles.map((particle, i) => (
        <div
          key={i}
          className={`absolute animate-pulse rounded-full bg-white/5 ${particle.size} ${particle.left} ${particle.top}`}
        />
      ))}
    </div>
  );
}
