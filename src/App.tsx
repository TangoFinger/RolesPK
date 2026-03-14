import React, { createContext, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CharactersPage from './pages/CharactersPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import RankingPage from './pages/RankingPage'
import BattlePage from './pages/BattlePage'
import SharePage from './pages/SharePage'
import { useAppData, AppData } from './data/useData'

// ---- 全局数据 Context ----
export const AppDataContext = createContext<AppData | null>(null)
export function useAppDataContext(): AppData {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppDataContext must be used inside AppDataProvider')
  return ctx
}

// ---- 加载/错误占位 ----
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 text-gray-500">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">正在加载战力数据…</p>
    </div>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-3 text-gray-500">
      <div className="text-4xl">⚠️</div>
      <p className="text-white font-bold">数据加载失败</p>
      <p className="text-sm text-gray-600 max-w-sm text-center">{message}</p>
      <button onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-400 transition-colors">
        重新加载
      </button>
    </div>
  )
}

export default function App() {
  const { data, loading, error } = useAppData()

  if (loading) return <LoadingScreen />
  if (error || !data) return <ErrorScreen message={error ?? '未知错误'} />

  return (
    <AppDataContext.Provider value={data}>
      <div className="min-h-screen bg-[#0f0f0f]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
              <div className="text-6xl mb-4">🌌</div>
              <p className="text-xl font-bold text-white mb-2">页面不存在</p>
              <a href="/" className="text-orange-400 hover:text-orange-300">返回首页</a>
            </div>
          } />
        </Routes>
      </div>
    </AppDataContext.Provider>
  )
}
