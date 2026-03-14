import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppDataContext } from '../App'
import { simulateBattle } from '../engine/battleEngine'
import Footer from '../components/Footer'
import type { BattleResult, BattleEvent, Character, Skill } from '../types'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

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
    <div className="flex items-start gap-1.5 sm:gap-2 p-2 rounded-lg sm:p-2.5 bg-[#0f0f0f] border border-gray-800 hover:border-gray-600 transition-colors">
      <span className="text-[10px] sm:text-xs px-1 py-0.5 rounded font-bold flex-shrink-0 mt-0.5"
        style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
      <div className="min-w-0 flex-1">
        <p className="text-white text-xs font-bold truncate">{skill.name}</p>
        <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed truncate">{skill.description}</p>
        <div className="flex gap-1.5 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
          <span>伤×{skill.damageMult}</span>
          <span>·</span>
          <span>体-{skill.staminaCost}</span>
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
  universeFilter,
}: {
  label: string
  selected: Character | null
  onSelect: (c: Character) => void
  exclude?: string
  universeFilter: string
}) {
  const { characters, skillsMap } = useAppDataContext()
  const [open, setOpen] = useState(false)
  
  // 根据筛选过滤角色列表，按综合战力排序
  const list = characters
    .filter(c => c.id !== exclude)
    .filter(c => universeFilter === 'all' || c.universeId === universeFilter)
    .sort((a, b) => b.overallScore - a.overallScore)
  
  const skills = selected ? (skillsMap[selected.id] ?? []) : []

  return (
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 text-center font-medium">{label}</p>

      {/* 选择触发区 */}
      <div
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-700 hover:border-orange-500 transition-colors mb-2 sm:mb-3"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <div
            className="p-2 sm:p-4 rounded-xl text-center"
            style={{ background: `linear-gradient(135deg, ${selected.accentColor}22, #1a1a1a)` }}
          >
            <div
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center text-lg sm:text-2xl font-bold text-white shadow-lg"
              style={{ background: selected.accentColor, boxShadow: `0 0 20px ${selected.accentColor}50` }}
            >
              {selected.name[0]}
            </div>
            <p className="text-white font-bold text-sm sm:text-base">{selected.name}</p>
            <p className="text-[10px] sm:text-xs mt-0.5 font-mono" style={{ color: selected.accentColor }}>
              {selected.overallScore.toLocaleString()}
            </p>
            <div className="hidden sm:flex flex-wrap justify-center gap-1 mt-2">
              {selected.tags.slice(0, 2).map(t => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded-full border"
                  style={{ color: selected.accentColor, borderColor: selected.accentColor + '40', background: selected.accentColor + '15' }}>
                  {t}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-[10px] sm:text-xs mt-1 sm:mt-2">点击更换</p>
          </div>
        ) : (
          <div className="p-4 sm:p-8 text-center">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">⚔️</div>
            <p className="text-gray-500 text-xs sm:text-sm">点击选择</p>
          </div>
        )}

        {/* 下拉列表 */}
        {open && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-xl z-50 max-h-56 sm:max-h-64 overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {list.map(c => (
              <div
                key={c.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                onClick={() => { onSelect(c); setOpen(false) }}
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0"
                  style={{ background: c.accentColor }}
                >
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs truncate hidden sm:block">{c.description.slice(0, 28)}…</p>
                </div>
                <span className="text-[10px] sm:text-xs font-mono flex-shrink-0 whitespace-nowrap" style={{ color: c.accentColor }}>
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
  const { characters, universes, skillsMap } = useAppDataContext()
  const [searchParams] = useSearchParams()
  const [charA, setCharA] = useState<Character | null>(null)
  const [charB, setCharB] = useState<Character | null>(null)
  const autoStarted = useRef(false) // 防止重复自动开始
  const [result, setResult] = useState<BattleResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [displayedEvents, setDisplayedEvents] = useState<{ roundIdx: number; eventIdx: number }[]>([])
  const [hpA, setHpA] = useState(0)
  const [hpB, setHpB] = useState(0)
  const [maxHpA, setMaxHpA] = useState(0)
  const [maxHpB, setMaxHpB] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  
  // 分享相关状态
  const shareRef = useRef<HTMLDivElement>(null)
  const [qrcodeUrl, setQrcodeUrl] = useState('')
  const [generating, setGenerating] = useState(false)

  // 筛选状态
  const [universeFilter, setUniverseFilter] = useState('all')
  const [filterExpanded, setFilterExpanded] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [filterNeedsCollapse, setFilterNeedsCollapse] = useState(false)

  const checkCollapse = useCallback(() => {
    const el = filterRef.current
    if (!el) return
    const prev = el.style.maxHeight
    el.style.maxHeight = 'none'
    const full = el.scrollHeight
    el.style.maxHeight = prev
    setFilterNeedsCollapse(full > 32)
  }, [])

  useEffect(() => {
    const timer = setTimeout(checkCollapse, 100)
    const handleResize = () => checkCollapse()
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [universes, checkCollapse])

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

  // 生成分享图片
  async function generateShareImage(charA: Character, charB: Character, battleResult: BattleResult) {
    if (!shareRef.current) return
    setGenerating(true)

    try {
      // 生成二维码
      const battleUrl = `${window.location.origin}/battle?a=${charA.id}&b=${charB.id}`
      const qrcodeDataUrl = await QRCode.toDataURL(battleUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#ffffff',
          light: '#1a1a2e'
        }
      })
      setQrcodeUrl(qrcodeDataUrl)

      // 等待二维码渲染
      await new Promise(resolve => setTimeout(resolve, 100))

      // 生成长图
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
        useCORS: true,
        windowWidth: 420,
        logging: false,
      })

      // 下载图片
      const link = document.createElement('a')
      link.download = `battle-${charA.name}-vs-${charB.name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('生成分享图失败:', err)
    } finally {
      setGenerating(false)
    }
  }

  // 自动从URL参数加载角色并开始对战
  useEffect(() => {
    const charAId = searchParams.get('a')
    const charBId = searchParams.get('b')

    if (charAId && charBId && !autoStarted.current) {
      const foundA = characters.find(c => c.id === charAId)
      const foundB = characters.find(c => c.id === charBId)

      if (foundA && foundB) {
        setCharA(foundA)
        setCharB(foundB)
        // 延迟一下确保状态更新完成后再开始战斗
        autoStarted.current = true
        setTimeout(() => startBattle(), 500)
      }
    }
  }, [searchParams, characters])

  const winnerChar = result ? characters.find(c => c.id === result.winner) : null

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">

        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full mb-4 font-medium">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            回合制战斗引擎 · 技能冷却 · 暴击判定
          </div>
          <p className="text-gray-400 text-sm">选择两位角色，观看一场专属于他们的战斗叙事</p>
        </div>

        {/* 筛选面板 */}
        <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-3 sm:p-4 mb-4">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>🔍</span> 宇宙筛选
            {filterNeedsCollapse && (
              <button
                onClick={() => setFilterExpanded(v => !v)}
                className="ml-auto text-xs text-orange-400 hover:text-orange-300 transition-colors"
              >
                {filterExpanded ? '收起 ▲' : '展开 ▼'}
              </button>
            )}
          </div>
          <div
            ref={filterRef}
            className="flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300"
            style={{ maxHeight: filterExpanded ? '500px' : '32px' }}
          >
            {/* 宇宙筛选 */}
            {['all', ...universes.map(u => u.id)].map(uid => {
              const u = universes.find(x => x.id === uid)
              const active = universeFilter === uid
              return (
                <button
                  key={`uni-${uid}`}
                  onClick={() => setUniverseFilter(uid)}
                  className="text-xs px-2.5 py-1 rounded-full border font-medium transition-all shrink-0 whitespace-nowrap"
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
          </div>
        </div>

        {/* 角色选择 + 技能预览 */}
        <div className="bg-[#1a1a1a] rounded-2xl p-3 sm:p-6 mb-6 border border-gray-800">
          <div className="flex flex-row gap-2 sm:gap-6 items-start">
            <CharacterSelector label="⚡ 先手" selected={charA}
              onSelect={c => { setCharA(c); reset() }} exclude={charB?.id}
              universeFilter={universeFilter} />
            <div className="hidden sm:flex flex-col items-center justify-start pt-16 px-2 flex-shrink-0">
              <div className="text-4xl font-black text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">VS</div>
            </div>
            <div className="sm:hidden flex items-center justify-center flex-shrink-0 pt-8">
              <div className="text-xl font-black text-orange-400">VS</div>
            </div>
            <CharacterSelector label="🛡️ 后手" selected={charB}
              onSelect={c => { setCharB(c); reset() }} exclude={charA?.id}
              universeFilter={universeFilter} />
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
                <button onClick={() => generateShareImage(charA!, charB!, result)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105">
                  📤 生成分享图
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

      {/* 隐藏的分享内容区域 - 用于生成分享图 */}
      {result && charA && charB && (
        <div ref={shareRef} className="fixed left-[-9999px] top-0 w-[420px] p-0" style={{ fontFamily: 'system-ui, sans-serif', maxHeight: 'none', overflow: 'visible' }}>
          {/* 头部 - 渐变背景 */}
          <div className="p-6 pb-8 rounded-t-2xl relative overflow-hidden" style={{
            background: `linear-gradient(135deg, ${charA.accentColor}30 0%, #1a1a2e 50%, ${charB.accentColor}30 100%)`
          }}>
            {/* 装饰光晕 */}
            <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full blur-3xl" style={{ background: `${charA.accentColor}40` }} />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full blur-3xl" style={{ background: `${charB.accentColor}40` }} />

            {/* 对战双方 */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              {/* 角色A */}
              <div className="flex-1 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl font-black"
                  style={{ 
                    background: charA.accentColor, 
                    color: '#fff',
                    boxShadow: `0 0 20px ${charA.accentColor}60`
                  }}>
                  {charA.name[0]}
                </div>
                <div className="font-bold text-sm text-white">{charA.name}</div>
                <div className="text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5" style={{ background: `${charA.accentColor}20`, color: charA.accentColor }}>
                  {charA.overallScore.toLocaleString()}
                </div>
              </div>

              {/* VS */}
              <div className="font-black text-orange-400 text-2xl shrink-0">
                VS
              </div>

              {/* 角色B */}
              <div className="flex-1 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl font-black"
                  style={{ 
                    background: charB.accentColor, 
                    color: '#fff',
                    boxShadow: `0 0 20px ${charB.accentColor}60`
                  }}>
                  {charB.name[0]}
                </div>
                <div className="font-bold text-sm text-white">{charB.name}</div>
                <div className="text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5" style={{ background: `${charB.accentColor}20`, color: charB.accentColor }}>
                  {charB.overallScore.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 胜者公告 - 横向通栏 */}
            <div className="relative z-30 mt-4 text-center">
              <span className="text-xl mr-1">🏆</span>
              <span className="text-base font-black" style={{ color: winnerChar?.accentColor }}>
                {winnerChar?.name}
              </span>
              <span className="text-white text-sm font-medium ml-1">获胜</span>
            </div>
          </div>

          {/* 战斗过程 - 完整显示 */}
          <div className="mx-6 mb-4 p-4 bg-[#0f0f0f] rounded-xl" style={{ maxHeight: 'none', overflow: 'visible' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-400">📜</span>
              <span className="text-sm font-bold text-white">战斗过程</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1.5">
              {result.rounds.map((round, i) => (
                <div key={i}>
                  <div className="text-gray-600 text-[10px] mb-0.5">第 {i + 1} 回合</div>
                  {round.events.map((event, j) => (
                    <div key={j} className="leading-relaxed">
                      <span className={
                        event.type === 'critical' ? 'text-orange-400' :
                        event.type === 'ultimate' ? 'text-yellow-400' :
                        event.type === 'miss' ? 'text-gray-600' :
                        'text-gray-400'
                      }>
                        {event.type === 'attack' && '⚔️ '}
                        {event.type === 'critical' && '💥 '}
                        {event.type === 'ultimate' && '🌟 '}
                        {event.type === 'miss' && '💨 '}
                        {event.type === 'defense' && '🛡️ '}
                        {event.type === 'taunt' && '😤 '}
                        {event.narrative}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 二维码 */}
          <div className="mx-6 mb-4 p-5 bg-gradient-to-r from-[#1a1a2e] to-[#0f0f0f] rounded-xl border border-gray-800">
            <div className="flex items-center justify-center gap-5">
              {qrcodeUrl && (
                <div className="p-2 bg-white rounded-lg">
                  <img src={qrcodeUrl} alt="二维码" className="w-20 h-20" />
                </div>
              )}
              <div className="text-center">
                <div className="text-lg font-black text-white mb-1">扫码观战</div>
                <div className="text-xs text-gray-500 mb-2">选择角色进行对战</div>
                <div className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                  ⚔️ Battle Arena
                </div>
              </div>
            </div>
          </div>

          {/* 底部水印 */}
          <div className="pb-6 text-center">
            <p className="text-xs text-gray-600">Powered by PowerRank</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
