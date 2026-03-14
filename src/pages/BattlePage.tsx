import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDataContext } from '../App'
import { simulateBattle } from '../engine/battleEngine'
import type { BattleResult, BattleEvent, Character, Skill } from '../types'

// 技能类型配色
const SKILL_TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  physical: { label: '物理', color: '#f97316', bg: '#f9731620' },
  energy:   { label: '能量', color: '#3b82f6', bg: '#3b82f620' },
  special:  { label: '特技', color: '#a855f7', bg: '#a855f720' },
  defense:  { label: '防御', color: '#10b981', bg: '#10b98120' },
  ultimate: { label: '必杀', color: '#fbbf24', bg: '#fbbf2420' },
}

// ============ 技能徽章 ============
function SkillBadge({ skill }: { skill: Skill }) {
  const meta = SKILL_TYPE_META[skill.type] ?? { label: skill.type, color: '#9ca3af', bg: '#9ca3af20' }
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#0f0f0f] border border-gray-800 hover:border-gray-600 transition-colors">
      <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0 mt-0.5"
        style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
      <div className="min-w-0">
        <p className="text-white text-xs font-bold truncate">{skill.name}</p>
        <p className="text-gray-500 text-xs leading-relaxed truncate">{skill.description}</p>
        <div className="flex gap-2 mt-1 text-xs text-gray-600">
          <span>伤害×{skill.damageMult}</span>
          <span>·</span>
          <span>体力 -{skill.staminaCost}</span>
          {skill.cooldown > 0 && <><span>·</span><span>CD {skill.cooldown}回合</span></>}
        </div>
      </div>
    </div>
  )
}

// ============ 角色选择卡片 ============
function CharacterSelector({
  label,
  selected,
  onSelect,
  exclude,
}: {
  label: string
  selected: Character | null
  onSelect: (c: Character) => void
  exclude?: string
}) {
  const { characters, skillsMap } = useAppDataContext()
  const [open, setOpen] = useState(false)
  const list = characters.filter(c => c.id !== exclude)
  const skills = selected ? (skillsMap[selected.id] ?? []) : []

  return (
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-sm mb-2 text-center font-medium">{label}</p>

      {/* 选择触发区 */}
      <div
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-700 hover:border-orange-500 transition-colors mb-3"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: `linear-gradient(135deg, ${selected.accentColor}22, #1a1a1a)` }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{ background: selected.accentColor, boxShadow: `0 0 20px ${selected.accentColor}50` }}
            >
              {selected.name[0]}
            </div>
            <p className="text-white font-bold text-lg">{selected.name}</p>
            <p className="text-xs mt-1 font-mono" style={{ color: selected.accentColor }}>
              战力 {selected.overallScore.toLocaleString()}
            </p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {selected.tags.slice(0, 2).map(t => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded-full border"
                  style={{ color: selected.accentColor, borderColor: selected.accentColor + '40', background: selected.accentColor + '15' }}>
                  {t}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-2">点击更换角色</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">⚔️</div>
            <p className="text-gray-500 text-sm">点击选择角色</p>
          </div>
        )}

        {/* 下拉列表 */}
        {open && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-xl z-50 max-h-64 overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {list.map(c => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                onClick={() => { onSelect(c); setOpen(false) }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: c.accentColor }}
                >
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{c.name}</p>
                  <p className="text-gray-500 text-xs truncate">{c.description.slice(0, 28)}…</p>
                </div>
                <span className="text-xs font-mono flex-shrink-0" style={{ color: c.accentColor }}>
                  {c.overallScore.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 技能预览 */}
      {selected && skills.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
            <span>🎯</span> 技能库（{skills.length}个）
          </p>
          <div className="space-y-1.5">
            {skills.map(skill => <SkillBadge key={skill.id} skill={skill} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 事件类型配置 ============
function getEventStyle(type: BattleEvent['type']) {
  const map: Record<string, { label: string; color: string; icon: string; highlight?: string }> = {
    round_start: { label: '回合', color: 'text-gray-500', icon: '—', highlight: '' },
    attack:      { label: '攻击', color: 'text-blue-400', icon: '⚔️', highlight: '' },
    critical:    { label: '暴击', color: 'text-orange-400', icon: '💥', highlight: 'border-l-2 border-orange-500 pl-3 bg-orange-500/5' },
    ultimate:    { label: '必杀', color: 'text-yellow-300', icon: '🌟', highlight: 'border-l-2 border-yellow-400 pl-3 bg-yellow-400/5' },
    miss:        { label: '闪避', color: 'text-gray-500', icon: '💨', highlight: '' },
    defense:     { label: '防御', color: 'text-green-400', icon: '🛡️', highlight: '' },
    special:     { label: '特技', color: 'text-purple-400', icon: '✨', highlight: '' },
    battle_end:  { label: '终结', color: 'text-yellow-300', icon: '🏆', highlight: 'border border-yellow-500/30 rounded-xl p-4 bg-yellow-500/5 mt-4' },
    taunt:       { label: '嘲讽', color: 'text-pink-400', icon: '😤', highlight: '' },
  }
  return map[type] ?? { label: type, color: 'text-gray-400', icon: '•', highlight: '' }
}

// ============ HP条 ============
function HpBar({
  hp, maxHp, color, name, align = 'left',
}: {
  hp: number; maxHp: number; color: string; name: string; align?: 'left' | 'right'
}) {
  const pct = Math.max(0, (hp / maxHp) * 100)
  const barColor = pct > 60 ? color : pct > 30 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex-1">
      <div className={`flex justify-between mb-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className="text-white text-sm font-bold truncate">{name}</span>
        <span className="text-gray-400 text-xs font-mono">{Math.max(0, hp).toLocaleString()}</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: pct > 0 ? `0 0 8px ${barColor}80` : 'none',
            ...(align === 'right' ? { float: 'right' } : {})
          }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-0.5 font-mono">{Math.round(pct)}%</p>
    </div>
  )
}

// ============ 单条事件渲染（带逐字打印效果）============
function BattleEventLine({ event, isLatest }: { event: BattleEvent; isLatest: boolean }) {
  const style = getEventStyle(event.type)
  const isRoundStart = event.type === 'round_start'
  const isEnd = event.type === 'battle_end'

  if (isRoundStart) {
    return (
      <div className="text-center py-3">
        <span className="text-gray-600 text-sm">{event.narrative}</span>
      </div>
    )
  }

  return (
    <div className={`${style.highlight} rounded-lg py-1`}>
      <span className={`text-xs font-bold mr-2 ${style.color}`}>
        {style.icon} {style.label}
      </span>
      <span className={`text-sm leading-relaxed ${isEnd ? 'text-yellow-100 font-medium' : 'text-gray-300'}`}>
        {event.narrative.split('\n').map((line, j) => (
          <span key={j}>
            {line}
            {j < event.narrative.split('\n').length - 1 && <br />}
          </span>
        ))}
      </span>
    </div>
  )
}

// ============ 对战历史记录 ============
interface HistoryEntry {
  charAName: string
  charBName: string
  winnerName: string
  rounds: number
  time: string
}

// ============ 主页面 ============
export default function BattlePage() {
  const { characters, skillsMap } = useAppDataContext()
  const [charA, setCharA] = useState<Character | null>(null)
  const [charB, setCharB] = useState<Character | null>(null)
  const [result, setResult] = useState<BattleResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [displayedEvents, setDisplayedEvents] = useState<{ roundIdx: number; eventIdx: number }[]>([])
  const [hpA, setHpA] = useState(0)
  const [hpB, setHpB] = useState(0)
  const [maxHpA, setMaxHpA] = useState(0)
  const [maxHpB, setMaxHpB] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  useEffect(() => {
    if (displayedEvents.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayedEvents])

  function startBattle() {
    if (!charA || !charB) return
    setIsSimulating(true)
    setDisplayedEvents([])
    setResult(null)

    const battleResult = simulateBattle(charA, charB, skillsMap)
    setResult(battleResult)

    const maxA = charA.overallScore * 2
    const maxB = charB.overallScore * 2
    setMaxHpA(maxA); setMaxHpB(maxB)
    setHpA(maxA);    setHpB(maxB)

    // 展开所有事件列表
    const allEvents: { roundIdx: number; eventIdx: number; hpA: number; hpB: number }[] = []
    for (let ri = 0; ri < battleResult.rounds.length; ri++) {
      for (let ei = 0; ei < battleResult.rounds[ri].events.length; ei++) {
        allEvents.push({
          roundIdx: ri, eventIdx: ei,
          hpA: battleResult.rounds[ri].hpA,
          hpB: battleResult.rounds[ri].hpB,
        })
      }
    }

    let idx = 0
    function showNext() {
      if (idx >= allEvents.length) {
        setIsSimulating(false)
        // 记录历史
        const winner = characters.find(c => c.id === battleResult.winner)
        setHistory(prev => [{
          charAName: charA!.name,
          charBName: charB!.name,
          winnerName: winner?.name ?? '未知',
          rounds: battleResult.totalRounds,
          time: new Date().toLocaleTimeString(),
        }, ...prev].slice(0, 10))
        return
      }
      const ev = allEvents[idx]
      setDisplayedEvents(prev => [...prev, { roundIdx: ev.roundIdx, eventIdx: ev.eventIdx }])
      setHpA(ev.hpA)
      setHpB(ev.hpB)
      idx++
      const event = battleResult.rounds[ev.roundIdx].events[ev.eventIdx]
      const delay = event.type === 'round_start' ? 700
        : event.type === 'battle_end' ? 1000
        : event.type === 'ultimate' ? 900
        : event.type === 'critical' ? 700
        : 500
      timerRef.current = setTimeout(showNext, delay)
    }
    showNext()
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setResult(null)
    setDisplayedEvents([])
    setIsSimulating(false)
  }

  const winnerChar = result ? characters.find(c => c.id === result.winner) : null

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">

        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full mb-4 font-medium">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            回合制战斗引擎 · 技能冷却 · 暴击判定
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            🔥 <span className="text-gradient">模拟对战</span>
          </h1>
          <p className="text-gray-400 text-sm">选择两位角色，观看一场专属于他们的战斗叙事</p>
        </div>

        {/* 角色选择 + 技能预览 */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex gap-6 items-start">
            <CharacterSelector label="⚡ 先手方" selected={charA}
              onSelect={c => { setCharA(c); reset() }} exclude={charB?.id} />
            <div className="flex flex-col items-center justify-start pt-16 px-2 flex-shrink-0">
              <div className="text-4xl font-black text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">VS</div>
            </div>
            <CharacterSelector label="🛡️ 后手方" selected={charB}
              onSelect={c => { setCharB(c); reset() }} exclude={charA?.id} />
          </div>

          {/* 战力对比条 */}
          {charA && charB && !isSimulating && !result && (
            <div className="mt-6 p-4 bg-[#0f0f0f] rounded-xl border border-gray-800">
              <p className="text-gray-500 text-xs mb-3 text-center">战力对比预览</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold flex-shrink-0" style={{ color: charA.accentColor }}>{charA.overallScore.toLocaleString()}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${(charA.overallScore / (charA.overallScore + charB.overallScore)) * 100}%`,
                    background: `linear-gradient(90deg, ${charA.accentColor}, ${charB.accentColor})`
                  }} />
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: charB.accentColor }}>{charB.overallScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-600">{charA.name}</span>
                <span className="text-xs text-gray-600">{charB.name}</span>
              </div>
            </div>
          )}

          {/* 开战按钮 */}
          <div className="mt-6 text-center">
            {!isSimulating && !result && (
              <button onClick={startBattle} disabled={!charA || !charB}
                className="px-12 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white font-black text-lg rounded-xl transition-all shadow-xl shadow-orange-500/20 hover:scale-105 disabled:hover:scale-100">
                {charA && charB ? '⚡ 开始模拟对战' : '请先选择两位角色'}
              </button>
            )}
            {isSimulating && (
              <div className="flex items-center justify-center gap-3 text-orange-400">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="font-bold text-lg">战斗进行中……</span>
              </div>
            )}
            {result && !isSimulating && (
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={startBattle}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105">
                  🔄 再战一局
                </button>
                <button onClick={reset}
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors">
                  🔀 重新选择
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 实时血条 */}
        {(isSimulating || result) && charA && charB && displayedEvents.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-6 border border-gray-800">
            <p className="text-gray-500 text-xs mb-4 text-center font-medium tracking-wider uppercase">实时战况</p>
            <div className="flex gap-4 items-start">
              <HpBar hp={hpA} maxHp={maxHpA} color={charA.accentColor} name={charA.name} align="left" />
              <div className="text-orange-400 font-black text-xl flex-shrink-0 pt-3">⚔️</div>
              <HpBar hp={hpB} maxHp={maxHpB} color={charB.accentColor} name={charB.name} align="right" />
            </div>
          </div>
        )}

        {/* 胜者公告 */}
        {result && !isSimulating && winnerChar && (
          <div className="rounded-2xl p-6 mb-6 text-center border"
            style={{ background: `linear-gradient(135deg, ${winnerChar.accentColor}25, #1a1a1a)`, borderColor: winnerChar.accentColor + '50' }}>
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-3xl font-black text-white mb-2">
              <span style={{ color: winnerChar.accentColor, textShadow: `0 0 20px ${winnerChar.accentColor}80` }}>
                {winnerChar.name}
              </span>
              <span className="text-white"> 获胜！</span>
            </h2>
            <p className="text-gray-400 text-sm mb-4">{result.summary}</p>
            <Link to={`/battle?a=${charA?.id}&b=${charB?.id}`}
              onClick={e => e.preventDefault()}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
              共战斗 {result.totalRounds} 回合
            </Link>
          </div>
        )}

        {/* 战斗叙事区 */}
        {displayedEvents.length > 0 && result && (
          <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">📜</span>
                <span className="text-white font-bold">战斗实况</span>
              </div>
              {isSimulating && (
                <span className="text-xs text-orange-400 animate-pulse">● 直播中</span>
              )}
              {!isSimulating && result && (
                <span className="text-xs text-gray-500">共 {result.totalRounds} 回合</span>
              )}
            </div>
            <div className="p-6 space-y-3 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700">
              {displayedEvents.map(({ roundIdx, eventIdx }, i) => {
                const event = result.rounds[roundIdx].events[eventIdx]
                return (
                  <BattleEventLine
                    key={i}
                    event={event}
                    isLatest={i === displayedEvents.length - 1}
                  />
                )
              })}
              {isSimulating && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce inline-block"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* 对战历史 */}
        {history.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <span className="text-white font-bold">🕘 本次会话对战记录</span>
            </div>
            <div className="divide-y divide-gray-800">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs w-5">{i + 1}</span>
                    <span className="text-gray-300 text-sm">{h.charAName} <span className="text-gray-600">vs</span> {h.charBName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-400 text-sm font-bold">{h.winnerName} 胜</span>
                    <span className="text-gray-600 text-xs">{h.rounds}回合</span>
                    <span className="text-gray-700 text-xs">{h.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
