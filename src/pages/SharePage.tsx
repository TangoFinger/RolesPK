import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAppDataContext } from '../App'
import { getVotes, vote, hasVoted, initVotes } from '../utils/voteStorage'
import html2canvas from 'html2canvas'
import Footer from '../components/Footer'

export default function SharePage() {
  const { characters, universes, hotBattles } = useAppDataContext()
  const [searchParams] = useSearchParams()
  const cardRef = useRef<HTMLDivElement>(null)

  const charAId = searchParams.get('a')
  const charBId = searchParams.get('b')

  const charA = characters.find(c => c.id === charAId)
  const charB = characters.find(c => c.id === charBId)

  // 找到对应的 battle 记录
  const battle = hotBattles.find(b => 
    (b.charA === charAId && b.charB === charBId) || 
    (b.charA === charBId && b.charB === charAId)
  )

  // 初始化投票数据
  useEffect(() => {
    if (hotBattles.length > 0) {
      initVotes(hotBattles)
    }
  }, [hotBattles])

  const [votes, setVotes] = useState({ votesA: 0, votesB: 0 })
  const [voted, setVoted] = useState(false)
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (battle) {
      const currentVotes = getVotes(battle.id)
      setVotes(currentVotes)
      setVoted(hasVoted(battle.id))
      const choice = localStorage.getItem(`vote_choice_${battle.id}`)
      if (choice === 'A' || choice === 'B') {
        setUserChoice(choice)
      }
    }
  }, [battle])

  if (!charA || !charB) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-16 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-black text-white mb-2">未找到该对战</h2>
        <p className="text-gray-500 mb-6">请检查链接是否正确</p>
        <Link to="/" className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400">
          返回首页
        </Link>
      </div>
    )
  }

  const uA = universes.find(u => u.id === charA.universeId)
  const uB = universes.find(u => u.id === charB.universeId)

  const total = votes.votesA + votes.votesB
  const displayTotal = battle ? battle.votesA + battle.votesB : total
  const pctA = total > 0 ? Math.round((votes.votesA / total) * 100) : 50
  const pctB = 100 - pctA

  const handleVote = (choice: 'A' | 'B') => {
    if (voted || !battle) return

    const success = vote(battle.id, choice)
    if (success) {
      localStorage.setItem(`vote_choice_${battle.id}`, choice)
      const newVotes = getVotes(battle.id)
      setVotes(newVotes)
      setVoted(true)
      setUserChoice(choice)
    }
  }

  const shareUrl = window.location.href

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generatePoster = async () => {
    if (!cardRef.current) return
    setGenerating(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      })

      const link = document.createElement('a')
      link.download = `battle-${charA.name}-vs-${charB.name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('生成海报失败:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-16">
      <div className="max-w-lg mx-auto px-4">

        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-3 py-1.5 rounded-full mb-4 font-medium">
            <span>📣</span> 邀请好友一起投票
          </div>
          <h1 className="text-2xl font-black text-white">🔥 热议对战</h1>
        </div>

        {/* 对战卡片 - 用于海报生成 */}
        <div ref={cardRef} className="rounded-2xl bg-[#1a1a2e] border border-[#2d2d4e] p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-medium">
              🔥 热议对决
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* 角色A */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl font-bold border-2"
                style={{ background: `${charA.accentColor}22`, color: charA.accentColor, borderColor: charA.accentColor }}>
                {charA.name[0]}
              </div>
              <div className="font-bold text-lg text-white">{charA.name}</div>
              {uA && <div className="text-xs text-gray-500">{uA.name}</div>}
              <div className="text-2xl font-black mt-2" style={{ color: charA.accentColor }}>{pctA}%</div>
            </div>

            {/* VS */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-lg shrink-0">
              VS
            </div>

            {/* 角色B */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl font-bold border-2"
                style={{ background: `${charB.accentColor}22`, color: charB.accentColor, borderColor: charB.accentColor }}>
                {charB.name[0]}
              </div>
              <div className="font-bold text-lg text-white">{charB.name}</div>
              {uB && <div className="text-xs text-gray-500">{uB.name}</div>}
              <div className="text-2xl font-black mt-2" style={{ color: charB.accentColor }}>{pctB}%</div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-5 h-3 rounded-full overflow-hidden bg-[#2d2d4e] flex">
            <div className="h-full rounded-l-full transition-all duration-500" style={{ width: `${pctA}%`, background: charA.accentColor }} />
            <div className="h-full rounded-r-full transition-all duration-500" style={{ width: `${pctB}%`, background: charB.accentColor }} />
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{votes.votesA.toLocaleString()} 票</span>
            <span>{(displayTotal / 1000).toFixed(1)}k 参与</span>
            <span>{votes.votesB.toLocaleString()} 票</span>
          </div>

          {/* 海报底部水印 */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">Powered by PowerRank</p>
          </div>
        </div>

        {/* 投票区域 */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
          <h3 className="text-white font-bold text-center mb-4">🎯 为你支持的角色投票</h3>

          {voted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full mb-3">
                <span className="text-green-400 text-sm">✓ 你已投票</span>
              </div>
              <p className="text-gray-500 text-sm">感谢你的参与！</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleVote('A')}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: `${charA.accentColor}30`, color: charA.accentColor, border: `1px solid ${charA.accentColor}50` }}
              >
                投票给 {charA.name}
              </button>
              <button
                onClick={() => handleVote('B')}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: `${charB.accentColor}30`, color: charB.accentColor, border: `1px solid ${charB.accentColor}50` }}
              >
                投票给 {charB.name}
              </button>
            </div>
          )}
        </div>

        {/* 分享区域 */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
          <h3 className="text-white font-bold text-center mb-4">📤 分享给好友</h3>

          {/* 复制链接 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-sm text-gray-400 focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-400 transition-colors"
            >
              {copied ? '✓ 已复制' : '复制'}
            </button>
          </div>

          {/* 生成海报 */}
          <button
            onClick={generatePoster}
            disabled={generating}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all disabled:opacity-50"
          >
            {generating ? '生成中...' : '🖼️ 生成对战海报'}
          </button>
        </div>

        {/* 跳转对战 */}
        <div className="text-center">
          <Link
            to={`/battle?a=${charAId}&b=${charBId}`}
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium"
          >
            ⚔️ 进入对战模拟 →
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  )
}
