import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Calender from './Pages/Calendar/Calendar';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route path='/calendar' element={<Calender />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
