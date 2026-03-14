import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDataContext } from '../App'

type SortKey = 'overall' | 'attack' | 'defense' | 'speed' | 'intelligence' | 'stamina' | 'special'
const SORT_TABS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'overall', label: '综合战力', icon: '🏆' },
  { key: 'attack', label: '攻击力', icon: '⚔️' },
  { key: 'defense', label: '防御力', icon: '🛡️' },
  { key: 'speed', label: '速度', icon: '⚡' },
  { key: 'intelligence', label: '智力', icon: '🧠' },
  { key: 'stamina', label: '持久力', icon: '💪' },
  { key: 'special', label: '特殊能力', icon: '✨' },
]

export default function RankingPage() {
  const { characters, universes } = useAppDataContext()
  const [sortKey, setSortKey] = useState<SortKey>('overall')
  const [universeFilter, setUniverseFilter] = useState('all')

  const sorted = [...characters]
    .filter(c => universeFilter === 'all' || c.universeId === universeFilter)
    .sort((a, b) => sortKey === 'overall' ? b.overallScore - a.overallScore : b.stats[sortKey] - a.stats[sortKey])

  const top3 = sorted.slice(0, 3)

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">🏆 战力总榜</h1>
          <p className="text-gray-400">全宇宙角色战力排行，实时数据</p>
        </div>

        {/* Universe filter */}
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          {['all', ...universes.map(u => u.id)].map(uid => {
            const u = universes.find(x => x.id === uid)
            const active = universeFilter === uid
            return (
              <button key={uid} onClick={() => setUniverseFilter(uid)}
                className="text-sm px-4 py-1.5 rounded-full border font-medium transition-all"
                style={active && u ? { background: u.color + '20', borderColor: u.color + '50', color: u.color }
                  : active ? { background: 'rgba(249,115,22,0.2)', borderColor: 'rgba(249,115,22,0.4)', color: '#fb923c' }
                  : { borderColor: '#2d2d4e', color: '#6b7280' }}>
                {uid === 'all' ? '全宇宙' : u?.name}
              </button>
            )
          })}
        </div>

        {/* Sort tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-1 scrollbar-hide">
          {SORT_TABS.map(tab => (
            <button key={tab.key} onClick={() => setSortKey(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all shrink-0 ${
                sortKey === tab.key ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'border-[#2d2d4e] text-gray-500 hover:text-gray-300 bg-[#1a1a2e]'}`}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[top3[1], top3[0], top3[2]].map((char, podiumIdx) => {
              const realRank = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2
              const heights = ['h-28', 'h-36', 'h-24']
              const medals = ['🥈', '🥇', '🥉']
              const score = sortKey === 'overall' ? char.overallScore : char.stats[sortKey]
              return (
                <Link key={char.id} to={`/characters/${char.id}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 border-2"
                      style={{ background: char.accentColor + '22', color: char.accentColor, borderColor: char.accentColor + '60' }}>{char.name[0]}</div>
                    <div className="font-bold text-white text-sm text-center mb-1 truncate max-w-full px-1">{char.name}</div>
                    <div className="text-xs tabular-nums mb-2" style={{ color: char.accentColor }}>
                      {sortKey === 'overall' ? (score as number).toLocaleString() : score}
                    </div>
                    <div className={`w-full ${heights[podiumIdx]} rounded-t-xl flex flex-col items-center justify-center border border-[#2d2d4e]`}
                      style={{ background: char.accentColor + '15' }}>
                      <span className="text-2xl">{medals[podiumIdx]}</span>
                      <span className="text-xs text-gray-500 mt-1">#{realRank + 1}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* List */}
        <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-[#0f0f0f] border-b border-[#2d2d4e] text-xs text-gray-500 font-medium uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">角色</div>
            <div className="col-span-3">宇宙</div>
            <div className="col-span-3 text-right">{SORT_TABS.find(t => t.key === sortKey)?.icon} {SORT_TABS.find(t => t.key === sortKey)?.label}</div>
          </div>
          {sorted.map((char, idx) => {
            const universe = universes.find(u => u.id === char.universeId)
            const score = sortKey === 'overall' ? char.overallScore : char.stats[sortKey]
            const maxScore = sortKey === 'overall' ? 10000 : 100
            return (
              <Link key={char.id} to={`/characters/${char.id}`}>
                <div className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center border-b border-[#2d2d4e] last:border-b-0 hover:bg-[#2d2d4e]/30 transition-colors group"
                  style={idx < 3 ? { background: char.accentColor + '08' } : {}}>
                  <div className="col-span-1 text-center">
                    {idx < 3 ? <span className="text-lg">{['🥇', '🥈', '🥉'][idx]}</span> : <span className="text-gray-500 font-mono text-sm">{idx + 1}</span>}
                  </div>
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold shrink-0"
                      style={{ background: char.accentColor + '22', color: char.accentColor }}>{char.name[0]}</div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate group-hover:text-orange-300 transition-colors">{char.name}</div>
                      <div className="text-xs text-gray-500 truncate">{char.alias[0] || char.race}</div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    {universe && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-block"
                        style={{ color: universe.color, background: universe.color + '18', border: `1px solid ${universe.color}35` }}>
                        {universe.name}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="font-black text-lg tabular-nums" style={{ color: char.accentColor }}>
                      {sortKey === 'overall' ? (score as number).toLocaleString() : score}
                    </span>
                    <div className="h-1 bg-[#2d2d4e] rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${((score as number) / maxScore) * 100}%`, background: char.accentColor }} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400">该宇宙暂无角色数据</p>
          </div>
        )}
      </div>
    </div>
  )
}
