import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RadarChart from '../components/RadarChart'
import { characters, getCharacterById, getUniverseById } from '../data/mockData'
import type { Character } from '../types'

const STAT_LABELS = ['攻击力', '防御力', '速度', '智力', '持久力', '特殊能力']
const STAT_KEYS = ['attack', 'defense', 'speed', 'intelligence', 'stamina', 'special'] as const

function calcWinRate(a: Character, b: Character): [number, number] {
  const total = a.overallScore + b.overallScore
  const raw = (a.overallScore / total) * 100
  const winA = Math.min(95, Math.max(5, Math.round(raw)))
  return [winA, 100 - winA]
}

function CharSelector({ label, selected, onSelect }: { label: string; selected: Character | null; onSelect: (c: Character) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = characters.filter(c => c.name.includes(search) || c.alias.some(a => a.includes(search)))

  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">{label}</div>
      <button onClick={() => setOpen(!open)}
        className="w-full bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl p-4 text-left hover:border-orange-500/40 transition-all"
        style={selected ? { borderColor: selected.accentColor + '50' } : {}}>
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: selected.accentColor + '22', color: selected.accentColor }}>{selected.name[0]}</div>
            <div>
              <div className="font-bold text-white">{selected.name}</div>
              <div className="text-xs text-gray-500">{getUniverseById(selected.universeId)?.name}</div>
            </div>
            <div className="ml-auto text-xl font-black tabular-nums" style={{ color: selected.accentColor }}>{selected.overallScore.toLocaleString()}</div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-12 h-12 rounded-xl bg-[#2d2d4e] flex items-center justify-center text-2xl shrink-0">➕</div>
            <span>选择{label}</span>
          </div>
        )}
      </button>
      {open && (
        <div className="relative z-20 mt-2 bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-2 border-b border-[#2d2d4e]">
            <input autoFocus type="text" placeholder="搜索角色…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2d2d4e] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50" />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map(c => (
              <button key={c.id} onClick={() => { onSelect(c); setOpen(false); setSearch('') }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#2d2d4e]/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: c.accentColor + '22', color: c.accentColor }}>{c.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{c.name}</div>
                  <div className="text-xs text-gray-500">{getUniverseById(c.universeId)?.name}</div>
                </div>
                <div className="text-sm font-bold tabular-nums" style={{ color: c.accentColor }}>{c.overallScore.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function VSPage() {
  const [searchParams] = useSearchParams()
  const [charA, setCharA] = useState<Character | null>(searchParams.get('a') ? getCharacterById(searchParams.get('a')!) || null : null)
  const [charB, setCharB] = useState<Character | null>(searchParams.get('b') ? getCharacterById(searchParams.get('b')!) || null : null)
  const [winA, winB] = charA && charB ? calcWinRate(charA, charB) : [50, 50]
  const winner = charA && charB ? (winA > winB ? charA : charB) : null

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3 mb-2">⚡ VS 对战系统</h1>
          <p className="text-gray-400">选择两位角色，系统根据战力数据预测胜率</p>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <CharSelector label="角色A" selected={charA} onSelect={setCharA} />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/30 shrink-0">VS</div>
          <CharSelector label="角色B" selected={charB} onSelect={setCharB} />
        </div>

        {charA && charB ? (
          <div className="space-y-6">
            {/* Win rate */}
            <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
              <h2 className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">⚡ 胜率预测</h2>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="font-black text-white text-lg">{charA.name}</div>
                  <div className="text-4xl font-black tabular-nums" style={{ color: charA.accentColor }}>{winA}%</div>
                </div>
                <div className="text-gray-600 font-black text-xl">:</div>
                <div className="text-right">
                  <div className="font-black text-white text-lg">{charB.name}</div>
                  <div className="text-4xl font-black tabular-nums" style={{ color: charB.accentColor }}>{winB}%</div>
                </div>
              </div>
              <div className="h-4 rounded-full overflow-hidden flex">
                <div className="h-full rounded-l-full transition-all duration-700" style={{ width: `${winA}%`, background: charA.accentColor }} />
                <div className="h-full rounded-r-full transition-all duration-700" style={{ width: `${winB}%`, background: charB.accentColor }} />
              </div>
              {winner && (
                <div className="mt-4 text-center p-3 rounded-xl bg-[#0f0f0f] border border-[#2d2d4e]">
                  <span className="text-gray-400 text-sm">系统预测：</span>
                  <span className="font-black text-lg ml-2" style={{ color: winner.accentColor }}>{winner.name}</span>
                  <span className="text-gray-400 text-sm ml-2">胜率更高</span>
                  {Math.abs(winA - winB) < 10 && <div className="text-xs text-yellow-400 mt-1">⚠️ 双方差距极小，可能是历史级对决</div>}
                </div>
              )}
            </div>

            {/* Radar */}
            <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
              <h2 className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">📊 六维对比</h2>
              <div className="flex justify-center">
                <RadarChart stats={charA.stats} color={charA.accentColor} compareStats={charB.stats} compareColor={charB.accentColor} size={360} nameA={charA.name} nameB={charB.name} />
              </div>
            </div>

            {/* Stat table */}
            <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
              <h2 className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">📋 逐项对比</h2>
              <div className="space-y-3">
                {STAT_KEYS.map((key, i) => {
                  const vA = charA.stats[key], vB = charB.stats[key]
                  const aWins = vA > vB, tie = vA === vB
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1.5 text-sm">
                        <span className="font-bold tabular-nums" style={aWins ? { color: charA.accentColor } : { color: '#6b7280' }}>{vA}{aWins ? ' ▲' : ''}</span>
                        <span className="text-gray-400 text-xs">{STAT_LABELS[i]}</span>
                        <span className="font-bold tabular-nums" style={!aWins && !tie ? { color: charB.accentColor } : { color: '#6b7280' }}>{!aWins && !tie ? '▲ ' : ''}{vB}</span>
                      </div>
                      <div className="relative h-2 bg-[#2d2d4e] rounded-full overflow-hidden flex">
                        <div className="h-full rounded-l-full" style={{ width: `${(vA / (vA + vB)) * 100}%`, background: charA.accentColor }} />
                        <div className="h-full rounded-r-full" style={{ width: `${(vB / (vA + vB)) * 100}%`, background: charB.accentColor }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4">
              {[charA, charB].map(c => {
                const u = getUniverseById(c.universeId)
                return (
                  <div key={c.id} className="bg-[#1a1a2e] border rounded-2xl p-5 text-center"
                    style={{ borderColor: c.accentColor + '40' }}>
                    <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl"
                      style={{ background: c.accentColor + '22', color: c.accentColor }}>{c.name[0]}</div>
                    <div className="font-black text-white text-lg">{c.name}</div>
                    {u && <div className="text-xs text-gray-500 mt-1">{u.name} · {u.tier}级</div>}
                    <div className="text-3xl font-black mt-3 tabular-nums" style={{ color: c.accentColor }}>{c.overallScore.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mt-1">综合战力值</div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            <div className="text-6xl mb-4">⚡</div>
            <p className="text-lg font-medium text-gray-400">{!charA && !charB ? '请选择两位角色开始对战' : !charA ? '请选择角色A' : '请选择角色B'}</p>
            <p className="text-sm mt-1">从上方选择角色，系统将自动分析战力对比</p>
          </div>
        )}
      </div>
    </div>
  )
}
