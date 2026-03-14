import React from 'react'
import { Link } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'
import BattleCard from '../components/BattleCard'
import Footer from '../components/Footer'
import { useAppDataContext } from '../App'

export default function HomePage() {
  const { characters, hotBattles, universes } = useAppDataContext()
  const topChars = [...characters].sort((a, b) => b.overallScore - a.overallScore).slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-32 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 sm:mb-10">
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-5 leading-tight">
              <span className="text-white text-base sm:text-xl font-bold">影视/动漫角色战斗力终极排行</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8">
              收录 {characters.length}+ 部影视/动漫作品的角色战力数据，六维评分体系，跨宇宙横向比较，找到你心目中最强的那个人。
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Link to="/ranking" className="px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl shadow-orange-500/30 hover:scale-105 text-sm sm:text-base whitespace-nowrap">
                战力总榜 🏆
              </Link>
              <Link to="/battle" className="px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-orange-500 transition-all shadow-xl shadow-red-500/30 hover:scale-105 text-sm sm:text-base whitespace-nowrap">
                模拟对战 🔥
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[{ label: '收录角色', value: `${characters.length}+` }, { label: '覆盖宇宙', value: `${universes.length}+` }, { label: 'VS 对战', value: '2.4万+' }].map(s => (
              <div key={s.label} className="text-center bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl p-4">
                <div className="text-2xl font-black text-gradient">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP 3 */}
      <section className="px-4 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">👑 全宇宙TOP3</h2>
            <Link to="/ranking" className="text-orange-400 text-sm hover:text-orange-300 font-medium">查看完整榜单 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topChars.slice(0, 3).map((char, i) => (
              <Link key={char.id} to={`/characters/${char.id}`}>
                <div className="relative rounded-2xl overflow-hidden border border-[#2d2d4e] hover:border-orange-500/40 transition-all duration-300 card-glow group"
                  style={{ background: `linear-gradient(135deg, ${char.accentColor}22 0%, #1a1a2e 60%)` }}>
                  <div className="p-5">
                    {/* 顶部：奖牌 + 头像 + 名字 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{['🥇', '🥈', '🥉'][i]}</span>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl border border-[#2d2d4e] flex-shrink-0"
                        style={{ background: char.accentColor + '22', color: char.accentColor }}>{char.name[0]}</div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-black text-white truncate">{char.name}</h3>
                        <span className="text-xs font-black tabular-nums" style={{ color: char.accentColor }}>{char.overallScore.toLocaleString()}</span>
                      </div>
                    </div>
                    {/* 描述 */}
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{char.description}</p>
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1.5">
                      {char.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full border font-medium"
                          style={{ color: char.accentColor, borderColor: char.accentColor + '40', background: char.accentColor + '15' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 text-[120px] font-black leading-none opacity-5 select-none" style={{ color: char.accentColor }}>{i + 1}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Character Grid */}
      <section className="px-4 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">⚔️ 热门角色</h2>
            <Link to="/characters" className="text-orange-400 text-sm hover:text-orange-300 font-medium">浏览全部 →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topChars.map(char => <CharacterCard key={char.id} character={char} showRank />)}
          </div>
        </div>
      </section>

      {/* Hot Battles */}
      <section className="px-4 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">🔥 热议对战</h2>
            <Link to="/battle" className="text-orange-400 text-sm hover:text-orange-300 font-medium">发起对战 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotBattles.map(battle => <BattleCard key={battle.id} battle={battle} allBattles={hotBattles} />)}
          </div>
        </div>
      </section>

      {/* Battle CTA Banner */}
      <section className="px-4 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-r from-[#1a0a00] via-[#1a1a1a] to-[#0a001a] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <h3 className="text-2xl font-black text-white">模拟对战 · 全新上线</h3>
              </div>
              <p className="text-gray-400 text-sm max-w-md">选择任意两位角色，系统根据真实战力与专属技能库，生成一场独一无二的文字战斗叙事——每场战斗都是全新体验。</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                <span>⚔️ 回合制战斗引擎</span>
                <span>🎯 技能冷却与暴击</span>
                <span>📜 专属叙事文本</span>
                <span>🏆 胜负动态判定</span>
              </div>
            </div>
            <Link to="/battle" className="relative z-10 flex-shrink-0 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-lg rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-2xl shadow-orange-500/30 hover:scale-105 whitespace-nowrap">
              立即开战 →
            </Link>
          </div>
        </div>
      </section>

      {/* Universe */}
      <section className="px-4 pb-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-6">🌌 宇宙等级</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {universes.map(u => {
              const count = characters.filter(c => c.universeId === u.id).length
              return (
                <Link key={u.id} to={`/characters?universe=${u.id}`}>
                  <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl p-4 hover:border-orange-500/30 transition-all group text-center">
                    <div className="text-xs font-black px-2 py-1 rounded-lg mb-2 inline-block" style={{ background: u.color + '25', color: u.color }}>{u.tier}级</div>
                    <div className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors">{u.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{count} 角色 · ×{u.tierCoeff}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
