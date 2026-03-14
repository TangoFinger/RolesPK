import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CharactersPage from './pages/CharactersPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import RankingPage from './pages/RankingPage'
import BattlePage from './pages/BattlePage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:id" element={<CharacterDetailPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4">🌌</div>
            <p className="text-xl font-bold text-white mb-2">页面不存在</p>
            <a href="/" className="text-orange-400 hover:text-orange-300">返回首页</a>
          </div>
        } />
      </Routes>
    </div>
  )
}
