import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ReactGA from 'react-ga4'

// Initialize Google Analytics 4
ReactGA.initialize("G-8CM3LYRFN8");

createRoot(document.getElementById("root")!).render(<App />);
