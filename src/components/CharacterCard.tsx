import React from 'react'
import { Link } from 'react-router-dom'
import type { Character } from '../types'
import { useAppDataContext } from '../App'

interface Props { character: Character; showRank?: boolean }

export default function CharacterCard({ character, showRank }: Props) {
  const { universes } = useAppDataContext()
  const universe = universes.find(u => u.id === character.universeId)
  const scoreColor = character.overallScore >= 8000 ? 'text-orange-400' : character.overallScore >= 5000 ? 'text-yellow-400' : character.overallScore >= 3000 ? 'text-green-400' : 'text-gray-400'

  return (
    <Link to={`/characters/${character.id}`}>
      <div className="relative rounded-xl bg-[#1a1a2e] border border-[#2d2d4e] p-2 sm:p-4 cursor-pointer transition-all duration-300 card-glow hover:scale-[1.02] hover:border-orange-500/40 group overflow-hidden h-full">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at 50% 0%, ${character.accentColor}15 0%, transparent 70%)` }} />
        {showRank && character.rank && (
          <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
            ${character.rank <= 3 ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/40' : 'bg-[#2d2d4e] text-gray-400'}`}>
            #{character.rank}
          </div>
        )}
        {/* 头部：头像 + 名字 + 战力 */}
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl border border-[#2d2d4e] flex-shrink-0"
            style={{ background: `${character.accentColor}22`, color: character.accentColor }}>
            {character.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate group-hover:text-orange-300 transition-colors">{character.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">战力</span>
              <span className={`font-black text-sm sm:text-lg ${scoreColor} tabular-nums`}>{character.overallScore.toLocaleString()}</span>
            </div>
          </div>
        </div>
        {/* 宇宙标签 */}
        {universe && (
          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium border"
            style={{ color: character.accentColor, borderColor: character.accentColor + '40', background: character.accentColor + '18' }}>
            {universe.name}
          </span>
        )}
        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {character.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-[#2d2d4e] text-gray-400 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>
        {/* 属性条 */}
        <div className="mt-2 space-y-0.5 sm:space-y-1">
          {(['attack', 'speed', 'special'] as const).map(k => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs text-gray-600 w-3">{k === 'attack' ? '攻' : k === 'speed' ? '速' : '特'}</span>
              <div className="flex-1 h-1 bg-[#2d2d4e] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${character.stats[k]}%`, background: character.accentColor }} />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-600 w-4 sm:w-5 text-right tabular-nums">{character.stats[k]}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
