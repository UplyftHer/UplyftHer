// AosInit.js
"use client";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AosInit() {
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    setTimeout(() => {
      AOS.refresh();
    }, 100); // Adjust the delay as needed
  }, []);

  return null; // No visual output needed, just initialization
}
