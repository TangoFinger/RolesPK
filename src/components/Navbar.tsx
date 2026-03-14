import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/characters', label: '角色库', icon: '⚔️' },
  { path: '/ranking', label: '战力榜', icon: '🏆' },
  { path: '/battle', label: '模拟对战', icon: '🔥' },
]

export default function Navbar() {
  const location = useLocation()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#2d2d4e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/30">战</div>
            <span className="font-black text-xl tracking-tight">
              <span className="text-gradient">战力</span><span className="text-white">图谱</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                  ${location.pathname === item.path
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">登录</button>
            <button className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/25">注册</button>
          </div>
        </div>
      </div>
      <div className="md:hidden flex border-t border-[#2d2d4e]">
        {navItems.map(item => (
          <Link key={item.path} to={item.path}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors
              ${location.pathname === item.path ? 'text-orange-400' : 'text-gray-500'}`}>
            <span className="text-lg">{item.icon}</span>{item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
