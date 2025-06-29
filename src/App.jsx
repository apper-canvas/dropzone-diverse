import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import HomePage from '@/components/pages/HomePage'
import NotFound from './pages/NotFound'

function App() {
  return (
<BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="backdrop-blur-md bg-surface/90 border border-gray-700"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App