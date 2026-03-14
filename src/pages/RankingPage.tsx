import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppDataContext } from '../App'

type SortKey = 'overall' | 'attack' | 'defense' | 'speed' | 'intelligence' | 'stamina' | 'special'
const SORT_TABS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'overall',      label: '综合战力', icon: '🏆' },
  { key: 'attack',       label: '攻击',     icon: '⚔️' },
  { key: 'defense',      label: '防御',     icon: '🛡️' },
  { key: 'speed',        label: '速度',     icon: '⚡' },
  { key: 'intelligence', label: '智力',     icon: '🧠' },
  { key: 'stamina',      label: '持久',     icon: '💪' },
  { key: 'special',      label: '特殊',     icon: '✨' },
]

const MEDAL_COLORS = ['#c0a060', '#a0a0b0', '#cd7f32']
const MEDAL_LABELS = ['冠军', '亚军', '季军']
const MEDALS = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const { characters, universes } = useAppDataContext()
  const [sortKey, setSortKey] = useState<SortKey>('overall')
  const [universeFilter, setUniverseFilter] = useState('all')
  const [uniExpanded, setUniExpanded] = useState(false)
  const [sortExpanded, setSortExpanded] = useState(false)
  const uniRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const [uniNeedsCollapse, setUniNeedsCollapse] = useState(false)
  const [sortNeedsCollapse, setSortNeedsCollapse] = useState(false)

  const checkCollapse = useCallback(() => {
    for (const [ref, setter] of [
      [uniRef, setUniNeedsCollapse],
      [sortRef, setSortNeedsCollapse],
    ] as const) {
      const el = ref.current
      if (!el) continue
      const prev = el.style.maxHeight
      el.style.maxHeight = 'none'
      const full = el.scrollHeight
      el.style.maxHeight = prev
      setter(full > 44)
    }
  }, [])

  useEffect(() => { checkCollapse() }, [universes, checkCollapse])

  const sorted = [...characters]
    .filter(c => universeFilter === 'all' || c.universeId === universeFilter)
    .sort((a, b) =>
      sortKey === 'overall'
        ? b.overallScore - a.overallScore
        : b.stats[sortKey] - a.stats[sortKey]
    )

  const top3 = sorted.slice(0, 3)
  const currentSortTab = SORT_TABS.find(t => t.key === sortKey)!

  return (
    <div className="min-h-screen pt-20 pb-16 px-3">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            🏆 <span className="text-gradient">战力总榜</span>
          </h1>
          <p className="text-gray-500 text-sm">
            共收录 <span className="text-orange-400 font-semibold">{characters.length}</span> 名角色，
            当前显示 <span className="text-white font-semibold">{sorted.length}</span> 名
          </p>
        </div>

        {/* ── Filter Panel ── */}
        <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 mb-6 space-y-4">

          {/* Universe filter */}
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🌐</span> 宇宙筛选
            </div>
            <div
              ref={uniRef}
              className="flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300"
              style={{ maxHeight: uniExpanded ? '500px' : '36px' }}
            >
              {['all', ...universes.map(u => u.id)].map(uid => {
                const u = universes.find(x => x.id === uid)
                const active = universeFilter === uid
                return (
                  <button
                    key={uid}
                    onClick={() => setUniverseFilter(uid)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all shrink-0"
                    style={
                      active && u
                        ? { background: u.color + '25', borderColor: u.color + '60', color: u.color }
                        : active
                        ? { background: 'rgba(249,115,22,0.2)', borderColor: 'rgba(249,115,22,0.4)', color: '#fb923c' }
                        : { borderColor: '#2d2d4e', color: '#6b7280' }
                    }
                  >
                    {uid === 'all' ? '全宇宙' : u?.name}
                  </button>
                )
              })}
              {uniNeedsCollapse && (
                <button
                  onClick={() => setUniExpanded(v => !v)}
                  className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all shrink-0"
                  style={{ borderColor: '#2d2d4e', color: '#fb923c' }}
                >
                  {uniExpanded ? '收起 ▲' : '展开 ▼'}
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#2d2d4e]" />

          {/* Sort tabs */}
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📊</span> 排序维度
            </div>
            <div
              ref={sortRef}
              className="flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300"
              style={{ maxHeight: sortExpanded ? '500px' : '36px' }}
            >
              {SORT_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSortKey(tab.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all shrink-0 ${
                    sortKey === tab.key
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                      : 'border-[#2d2d4e] text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>{tab.label}
                </button>
              ))}
              {sortNeedsCollapse && (
                <button
                  onClick={() => setSortExpanded(v => !v)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all shrink-0 border-[#2d2d4e]"
                  style={{ color: '#fb923c' }}
                >
                  {sortExpanded ? '收起 ▲' : '展开 ▼'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Podium ── */}
        {top3.length >= 3 && (
          <div className="mb-6">
            {/* Podium order: 2nd | 1st | 3rd */}
            <div className="grid grid-cols-3 gap-3 items-end">
              {([1, 0, 2] as const).map((rankIdx, col) => {
                const char = top3[rankIdx]
                const score = sortKey === 'overall' ? char.overallScore : char.stats[sortKey]
                const podiumH = ['h-20', 'h-28', 'h-16'][col]
                const avatarSize = col === 1 ? 'w-20 h-20 text-4xl' : 'w-14 h-14 text-2xl'
                const nameSize = col === 1 ? 'text-base' : 'text-sm'
                const scoreSize = col === 1 ? 'text-xl' : 'text-base'
                return (
                  <Link key={char.id} to={`/characters/${char.id}`} className="flex flex-col items-center group">
                    {/* Medal badge */}
                    <div
                      className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 border"
                      style={{
                        color: MEDAL_COLORS[rankIdx],
                        borderColor: MEDAL_COLORS[rankIdx] + '60',
                        background: MEDAL_COLORS[rankIdx] + '15',
                      }}
                    >
                      {MEDAL_LABELS[rankIdx]}
                    </div>
                    {/* Avatar */}
                    <div
                      className={`${avatarSize} rounded-2xl flex items-center justify-center font-black mb-2 border-2 transition-transform group-hover:scale-105`}
                      style={{
                        background: char.accentColor + '20',
                        color: char.accentColor,
                        borderColor: char.accentColor + '70',
                        boxShadow: col === 1 ? `0 0 24px ${char.accentColor}40` : undefined,
                      }}
                    >
                      {char.name[0]}
                    </div>
                    {/* Name */}
                    <div className={`font-bold text-white ${nameSize} text-center truncate max-w-full px-1 mb-0.5`}>
                      {char.name}
                    </div>
                    {/* Score */}
                    <div
                      className={`font-black tabular-nums ${scoreSize} mb-3`}
                      style={{ color: char.accentColor }}
                    >
                      {sortKey === 'overall' ? (score as number).toLocaleString() : score}
                    </div>
                    {/* Podium base */}
                    <div
                      className={`w-full ${podiumH} rounded-t-xl flex flex-col items-center justify-center border border-b-0`}
                      style={{ background: char.accentColor + '12', borderColor: char.accentColor + '30' }}
                    >
                      <span className="text-2xl">{MEDALS[rankIdx]}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Ranking List ── */}
        {sorted.length > 0 ? (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="flex items-center px-3 py-2.5 bg-[#0f0f1a] border-b border-[#2d2d4e] text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <div className="w-7 text-center shrink-0">#</div>
              <div className="flex-1 min-w-0 pl-2">角色</div>
              <div className="w-24 shrink-0 hidden sm:block">宇宙</div>
              <div className="w-24 sm:w-28 text-right shrink-0">
                {currentSortTab.icon} {currentSortTab.label}
              </div>
            </div>

            {/* Rows */}
            {sorted.map((char, idx) => {
              const universe = universes.find(u => u.id === char.universeId)
              const score = sortKey === 'overall' ? char.overallScore : char.stats[sortKey]
              const maxScore = sortKey === 'overall' ? 10000 : 100
              const pct = Math.min(100, ((score as number) / maxScore) * 100)
              const isTop3 = idx < 3

              return (
                <Link key={char.id} to={`/characters/${char.id}`}>
                  <div
                    className="flex items-center px-4 py-3 border-b border-[#2d2d4e] last:border-b-0 hover:bg-white/[0.03] transition-colors group"
                    style={isTop3 ? { background: char.accentColor + '08' } : {}}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center shrink-0">
                      {isTop3
                        ? <span className="text-xl leading-none">{MEDALS[idx]}</span>
                        : <span className="text-gray-500 font-mono text-xs">{idx + 1}</span>
                      }
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex-1 min-w-0 flex items-center gap-2 pl-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                        style={{ background: char.accentColor + '20', color: char.accentColor }}
                      >
                        {char.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate group-hover:text-orange-300 transition-colors leading-tight">
                          {char.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate leading-tight mt-0.5">
                          {char.alias?.[0] || char.race || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Universe tag */}
                    <div className="w-24 shrink-0 hidden sm:flex items-center">
                      {universe && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium truncate max-w-full"
                          style={{
                            color: universe.color,
                            background: universe.color + '15',
                            border: `1px solid ${universe.color}30`,
                          }}
                        >
                          {universe.name}
                        </span>
                      )}
                    </div>

                    {/* Score + bar */}
                    <div className="w-24 sm:w-28 text-right shrink-0">
                      <span
                        className="font-black text-lg tabular-nums leading-none"
                        style={{ color: char.accentColor }}
                      >
                        {sortKey === 'overall' ? (score as number).toLocaleString() : score}
                      </span>
                      <div className="h-1 bg-[#2d2d4e] rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: char.accentColor }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 font-medium">该宇宙暂无角色数据</p>
            <button
              onClick={() => setUniverseFilter('all')}
              className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              查看全宇宙 →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
