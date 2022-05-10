import { Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}
