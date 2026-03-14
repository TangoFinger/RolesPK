import React from 'react'
import { Link } from 'react-router-dom'
import type { BattleRecord } from '../types'
import { useAppDataContext } from '../App'

export default function BattleCard({ battle }: { battle: BattleRecord }) {
  const { characters, universes } = useAppDataContext()
  const charA = characters.find(c => c.id === battle.charA)
  const charB = characters.find(c => c.id === battle.charB)
  if (!charA || !charB) return null
  const total = battle.votesA + battle.votesB
  const pctA = Math.round((battle.votesA / total) * 100)
  const pctB = 100 - pctA
  const uA = universes.find(u => u.id === charA.universeId)
  const uB = universes.find(u => u.id === charB.universeId)

  return (
    <Link to={`/battle`}>
      <div className="rounded-xl bg-[#1a1a2e] border border-[#2d2d4e] p-4 hover:border-orange-500/40 transition-all card-glow group cursor-pointer">
        {battle.hot && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">🔥 热议</span>
            <span className="text-xs text-gray-600">{(total / 1000).toFixed(1)}k 参与</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-2xl border border-[#2d2d4e] font-bold"
              style={{ background: `${charA.accentColor}22`, color: charA.accentColor }}>{charA.name[0]}</div>
            <div className="font-bold text-sm text-white">{charA.name}</div>
            {uA && <div className="text-xs text-gray-500">{uA.name}</div>}
            <div className="text-lg font-black mt-1" style={{ color: charA.accentColor }}>{pctA}%</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform shrink-0">VS</div>
          <div className="flex-1 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-2xl border border-[#2d2d4e] font-bold"
              style={{ background: `${charB.accentColor}22`, color: charB.accentColor }}>{charB.name[0]}</div>
            <div className="font-bold text-sm text-white">{charB.name}</div>
            {uB && <div className="text-xs text-gray-500">{uB.name}</div>}
            <div className="text-lg font-black mt-1" style={{ color: charB.accentColor }}>{pctB}%</div>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden bg-[#2d2d4e] flex">
          <div className="h-full rounded-l-full" style={{ width: `${pctA}%`, background: charA.accentColor }} />
          <div className="h-full rounded-r-full" style={{ width: `${pctB}%`, background: charB.accentColor }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">{battle.votesA.toLocaleString()} 票</span>
          <span className="text-xs text-gray-600">{battle.votesB.toLocaleString()} 票</span>
        </div>
      </div>
    </Link>
  )
}
