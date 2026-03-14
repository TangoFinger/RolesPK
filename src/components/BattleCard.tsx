import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { BattleRecord } from '../types'
import { useAppDataContext } from '../App'
import { getVotes, vote, hasVoted, initVotes, getAllVotes } from '../utils/voteStorage'

export default function BattleCard({ battle, allBattles }: { battle: BattleRecord; allBattles: BattleRecord[] }) {
  const { characters, universes } = useAppDataContext()
  const charA = characters.find(c => c.id === battle.charA)
  const charB = characters.find(c => c.id === battle.charB)

  // 初始化投票数据
  useEffect(() => {
    initVotes(allBattles)
  }, [allBattles])

  // 获取实时投票数据
  const [votes, setVotes] = useState({ votesA: battle.votesA, votesB: battle.votesB })
  const [voted, setVoted] = useState(false)
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null)

  useEffect(() => {
    const currentVotes = getVotes(battle.id)
    setVotes(currentVotes)
    setVoted(hasVoted(battle.id))
    // 获取用户之前的选择
    const choice = localStorage.getItem(`vote_choice_${battle.id}`)
    if (choice === 'A' || choice === 'B') {
      setUserChoice(choice)
    }
  }, [battle.id])

  if (!charA || !charB) return null

  const total = votes.votesA + votes.votesB
  const pctA = total > 0 ? Math.round((votes.votesA / total) * 100) : 50
  const pctB = 100 - pctA
  const uA = universes.find(u => u.id === charA.universeId)
  const uB = universes.find(u => u.id === charB.universeId)

  const handleVote = (e: React.MouseEvent, choice: 'A' | 'B') => {
    e.preventDefault()
    e.stopPropagation()

    if (voted) return

    const success = vote(battle.id, choice)
    if (success) {
      localStorage.setItem(`vote_choice_${battle.id}`, choice)
      // 更新显示
      const newVotes = getVotes(battle.id)
      setVotes(newVotes)
      setVoted(true)
      setUserChoice(choice)
    }
  }

  return (
    <Link to={`/battle?a=${battle.charA}&b=${battle.charB}`}>
      <div className="rounded-xl bg-[#1a1a2e] border border-[#2d2d4e] p-4 hover:border-orange-500/40 transition-all card-glow group cursor-pointer">
        {battle.hot && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">🔥 热议</span>
            <span className="text-xs text-gray-600">{(total / 1000).toFixed(1)}k 参与</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-2xl border border-[#2d2d4e] font-bold relative"
              style={{ background: `${charA.accentColor}22`, color: charA.accentColor }}>
              {charA.name[0]}
              {userChoice === 'A' && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
            </div>
            <div className="font-bold text-sm text-white">{charA.name}</div>
            {uA && <div className="text-xs text-gray-500">{uA.name}</div>}
            <div className="text-lg font-black mt-1" style={{ color: charA.accentColor }}>{pctA}%</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform shrink-0">VS</div>
          <div className="flex-1 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-2xl border border-[#2d2d4e] font-bold relative"
              style={{ background: `${charB.accentColor}22`, color: charB.accentColor }}>
              {charB.name[0]}
              {userChoice === 'B' && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
            </div>
            <div className="font-bold text-sm text-white">{charB.name}</div>
            {uB && <div className="text-xs text-gray-500">{uB.name}</div>}
            <div className="text-lg font-black mt-1" style={{ color: charB.accentColor }}>{pctB}%</div>
          </div>
        </div>

        {/* 投票进度条 */}
        <div className="mt-3 h-2 rounded-full overflow-hidden bg-[#2d2d4e] flex">
          <div className="h-full rounded-l-full transition-all duration-500" style={{ width: `${pctA}%`, background: charA.accentColor }} />
          <div className="h-full rounded-r-full transition-all duration-500" style={{ width: `${pctB}%`, background: charB.accentColor }} />
        </div>

        {/* 投票按钮或已投票状态 */}
        <div className="mt-3">
          {voted ? (
            <div className="flex items-center justify-center gap-2 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-green-400 text-xs">✓ 你已投票</span>
              <span className="text-gray-500 text-xs">|</span>
              <span className="text-gray-500 text-xs">{votes.votesA.toLocaleString()} vs {votes.votesB.toLocaleString()}</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={(e) => handleVote(e, 'A')}
                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                style={{ background: `${charA.accentColor}30`, color: charA.accentColor, border: `1px solid ${charA.accentColor}50` }}
              >
                投票给 {charA.name}
              </button>
              <button
                onClick={(e) => handleVote(e, 'B')}
                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                style={{ background: `${charB.accentColor}30`, color: charB.accentColor, border: `1px solid ${charB.accentColor}50` }}
              >
                投票给 {charB.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
