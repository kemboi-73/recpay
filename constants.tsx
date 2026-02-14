
import { Service } from './types';

export const PAYHERO_CONFIG = {
  CHANNEL_ID: "5512",
  // Using the exact token provided in the prompt to ensure correct authorization.
  // Original Credentials: 4pVLl9MpYs3bjtfIHUJC : HzWUDUjBpkQWVyBhQLRlcLLyibGF3nOiNBFF5f0d
  AUTH_TOKEN: "Basic NHBWTGw5TXBZczNianRmSUhVSkM6SHpXVURVakJwa1FXVnlCaFFMUmxjTEx5aWJHRjNuT2lOQkZGNWYwZA==",
  BASE_URL: "https://backend.payhero.co.ke/api/v2",
  PROVIDER: "m-pesa",
  CALLBACK_URL: "https://famricco-2.onrender.com/callback/"
};

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'NBA Standard Basketball Court',
    category: 'Sports',
    price: 1500,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1544910368-5154817cce58?auto=format&fit=crop&q=80&w=800',
    description: 'Professional grade hardwood floor for high-performance games.',
    available: true
  },
  {
    id: '2',
    name: 'Olympic Swimming Lane',
    category: 'Wellness',
    price: 800,
    duration: '45 Mins',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800',
    description: 'Temperature controlled 50m pool lane for intensive training.',
    available: true
  },
  {
    id: '3',
    name: 'Premium Yoga Mat & Studio',
    category: 'Fitness',
    price: 1200,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1518611012118-29615539f4a2?auto=format&fit=crop&q=80&w=800',
    description: 'Quiet atmosphere, high-grip mats, and panoramic views.',
    available: true
  },
  {
    id: '4',
    name: 'Squash Court',
    category: 'Sports',
    price: 1000,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
    description: 'Indoor air-conditioned squash courts with racket rentals.',
    available: true
  },
  {
    id: '5',
    name: 'High-Tech Gym Pass',
    category: 'Fitness',
    price: 500,
    duration: 'Day Pass',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    description: 'All-day access to weight rooms and cardio zones.',
    available: true
  },
  {
    id: '6',
    name: 'Private Sauna Session',
    category: 'Wellness',
    price: 2000,
    duration: '30 Mins',
    image: 'https://images.unsplash.com/photo-1554341144-884813032599?auto=format&fit=crop&q=80&w=800',
    description: 'Infrared detox sauna for ultimate post-workout recovery.',
    available: true
  }
];
