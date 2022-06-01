import { Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { EditResume } from './pages/EditResume';
import { ViewResume } from './pages/ViewResume';

import { AuthContextProvider } from './contexts/AuthContext';
import { PrivateRoute, PublicRoute } from './routes';

export function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<PublicRoute redirectTo="/edit-resume" />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute redirectTo="/login" />}>
          <Route path="/edit-resume" element={<EditResume />} />
        </Route>
        <Route path="/:username" element={<ViewResume />} />
      </Routes>
    </AuthContextProvider>
  );
}
