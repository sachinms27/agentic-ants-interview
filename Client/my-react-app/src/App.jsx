import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'
import NoteEdit from './pages/NoteEdit'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="notes" element={<Notes />} />
          <Route path="notes/:noteId" element={<NoteDetail />} />
          <Route path="notes/:noteId/edit" element={<NoteEdit />} />
          {/* <Route path="about" element={<About />} />
          <Route path="data" element={<Data />} /> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
