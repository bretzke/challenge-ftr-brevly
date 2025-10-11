import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import IndexPage from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="*" element={<p>404 - Página não encontrada</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
