import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import RadarChart from '../components/RadarChart'
import Footer from '../components/Footer'
import { useAppDataContext } from '../App'
import type { Skill } from '../types'

const STAT_LABELS: Record<string, string> = { attack: '攻击力', defense: '防御力', speed: '速度', intelligence: '智力', stamina: '持久力', special: '特殊能力' }
const STAT_ICONS: Record<string, string> = { attack: '⚔️', defense: '🛡️', speed: '⚡', intelligence: '🧠', stamina: '💪', special: '✨' }
const STAT_KEYS = ['attack', 'defense', 'speed', 'intelligence', 'stamina', 'special'] as const

const SKILL_TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  physical: { label: '物理', color: '#f97316', bg: '#f9731620' },
  energy:   { label: '能量', color: '#3b82f6', bg: '#3b82f620' },
  special:  { label: '特技', color: '#a855f7', bg: '#a855f720' },
  defense:  { label: '防御', color: '#10b981', bg: '#10b98120' },
  ultimate: { label: '必杀', color: '#fbbf24', bg: '#fbbf2420' },
}

function SkillCard({ skill, accentColor }: { skill: Skill; accentColor: string }) {
  const meta = SKILL_TYPE_META[skill.type] ?? { label: skill.type, color: '#9ca3af', bg: '#9ca3af20' }
  return (
    <div className="bg-[#0f0f0f] border border-[#2d2d4e] rounded-xl p-3 sm:p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded font-bold flex-shrink-0"
            style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
          <h4 className="text-white font-bold text-xs sm:text-sm truncate">{skill.name}</h4>
          {skill.type === 'ultimate' && <span className="text-yellow-400 text-[10px] sm:text-xs flex-shrink-0">★</span>}
        </div>
      </div>
      <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 truncate">{skill.description}</p>
      <p className="text-gray-500 text-[10px] sm:text-xs italic mb-2 sm:mb-3 truncate">"{skill.effectDesc}"</p>
      <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">伤害</span>
          <span className="font-bold" style={{ color: accentColor }}>×{skill.damageMult}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">体力</span>
          <span className="font-bold text-blue-400">-{skill.staminaCost}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">命中</span>
          <span className="font-bold text-green-400">{Math.round(skill.hitRate * 100)}%</span>
        </div>
        {skill.cooldown > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-gray-600">CD</span>
            <span className="font-bold text-orange-400">{skill.cooldown}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { characters, universes, works, skillsMap } = useAppDataContext()

  const char = characters.find(c => c.id === (id || ''))
  const [activeForm, setActiveForm] = useState(char?.forms.length ? char.forms.length - 1 : 0)

  if (!char) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-gray-500">
      <div className="text-6xl mb-4">❓</div>
      <p className="text-xl font-bold text-white mb-2">角色不存在</p>
      <Link to="/characters" className="text-orange-400 hover:text-orange-300">返回角色库</Link>
    </div>
  )

  const universe = universes.find(u => u.id === char.universeId)
  const work = works.find(w => w.id === char.workId)
  const currentForm = char.forms[activeForm]
  const displayStats = currentForm ? currentForm.stats : char.stats
  const displayScore = currentForm ? currentForm.overallScore : char.overallScore
  const related = characters.filter(c => c.universeId === char.universeId && c.id !== char.id).slice(0, 4)
  const skills = skillsMap[char.id] ?? []

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16">
      {/* Hero - 重新设计，移动端更紧凑 */}
      <div className="relative overflow-hidden px-3 py-5 sm:py-8"
        style={{ background: `linear-gradient(180deg, ${char.accentColor}15 0%, #0f0f0f 100%)` }}>
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-[140px] sm:text-[180px] font-black opacity-5 select-none pointer-events-none"
          style={{ color: char.accentColor }}>{char.name[0]}</div>
        <div className="max-w-7xl mx-auto">
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gray-300">首页</Link><span>/</span>
            <Link to="/characters" className="hover:text-gray-300">角色库</Link><span>/</span>
            <span style={{ color: char.accentColor }}>{char.name}</span>
          </nav>
<br/>
          {/* 主要内容区 - 移动端纵向，桌面端横向 */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center">
            {/* 头像 - 移动端在最上 */}
            <div className="order-1">
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl sm:rounded-3xl flex items-center justify-center text-5xl sm:text-6xl lg:text-7xl border-2"
                style={{ background: char.accentColor + '22', color: char.accentColor, borderColor: char.accentColor + '50', boxShadow: `0 0 30px ${char.accentColor}25` }}>{char.name[0]}</div>
            </div>

            {/* 中间：名字和信息 */}
            <div className="flex-1 min-w-0 text-center sm:text-left order-2 w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">{char.name}</h1>
              <p className="text-gray-400 text-sm mb-3">{char.alias.join(' · ')}</p>

              {/* 标签行 */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 justify-center sm:justify-start">
                {universe && <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full border font-semibold"
                  style={{ color: char.accentColor, borderColor: char.accentColor + '50', background: char.accentColor + '18' }}>{universe.name}</span>}
                {universe && <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-[#2d2d4e] text-gray-300 font-mono">{universe.tier}级</span>}
                <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-[#2d2d4e] text-gray-300">{char.race}</span>
                <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full font-semibold ${char.faction === '反派' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{char.faction}</span>
              </div>

              {/* 战力值 */}
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-500">{currentForm ? currentForm.name : '综合战力'}</div>
                  <div className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color: char.accentColor }}>{displayScore.toLocaleString()}</div>
                </div>
                {char.rank && <div className="text-xs text-gray-500 px-2 py-1 bg-[#1a1a2e] rounded-lg">全宇宙 #{char.rank}</div>}
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                {char.tags.map(tag => <span key={tag} className="text-[10px] bg-[#1a1a2e] border border-[#2d2d4e] text-gray-400 px-1.5 py-0.5 rounded">{tag}</span>)}
              </div>
            </div>

            {/* 雷达图 - 移动端隐藏或简化 */}
            <div className="order-3 hidden sm:block">
              <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-2">
                <RadarChart stats={displayStats} color={char.accentColor} size={200} />
              </div>
            </div>
          </div>

          {/* 简介 - 移动端在下方 */}
          <div className="mt-4 sm:mt-6">
            <p className="text-gray-300 leading-relaxed text-sm max-w-2xl">{char.description}</p>
            {work && <p className="text-xs text-gray-500 mt-2">📺 出自《{work.title}》({work.year})</p>}
          </div>

          {/* 移动端雷达图 */}
          <div className="sm:hidden mt-4 flex justify-center">
            <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl p-1">
              <RadarChart stats={displayStats} color={char.accentColor} size={200} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {/* Stat Bars */}
        <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{ background: char.accentColor }}></span>
            六维评分
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {STAT_KEYS.map(key => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300"><span>{STAT_ICONS[key]}</span>{STAT_LABELS[key]}</div>
                  <span className="text-xs sm:text-sm font-black tabular-nums"
                    style={{ color: displayStats[key] >= 90 ? char.accentColor : displayStats[key] >= 70 ? '#fbbf24' : '#9ca3af' }}>{displayStats[key]}</span>
                </div>
                <div className="h-1.5 sm:h-2 bg-[#2d2d4e] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${displayStats[key]}%`, background: `linear-gradient(90deg, ${char.accentColor}88, ${char.accentColor})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-4 rounded-full" style={{ background: char.accentColor }}></span>
                技能库
                <span className="text-xs sm:text-sm font-normal text-gray-500">({skills.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {skills.map(skill => <SkillCard key={skill.id} skill={skill} accentColor={char.accentColor} />)}
            </div>
          </div>
        )}

        {/* Forms */}
        {char.forms.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: char.accentColor }}></span>
              形态切换
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {char.forms.map((form, i) => (
                <button key={i} onClick={() => setActiveForm(i)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border"
                  style={activeForm === i
                    ? { borderColor: char.accentColor + '60', background: char.accentColor + '20', color: char.accentColor }
                    : { borderColor: '#2d2d4e', color: '#9ca3af' }}>
                  {form.name}
                </button>
              ))}
            </div>
            {currentForm && (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                {/* 文字信息 */}
                <div className="text-center sm:text-left sm:flex-1 sm:min-w-0">
                  <h3 className="font-bold text-white text-lg mb-1">{currentForm.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 sm:mb-4 leading-relaxed">{currentForm.description}</p>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="text-xs sm:text-sm text-gray-500">战力</span>
                    <span className="text-2xl sm:text-3xl font-black" style={{ color: char.accentColor }}>{currentForm.overallScore.toLocaleString()}</span>
                  </div>
                </div>
                {/* 雷达图 */}
                <div className="shrink-0">
                  <RadarChart stats={currentForm.stats} color={char.accentColor} size={260} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Evidence */}
        {char.evidence.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: char.accentColor }}></span>
              战力依据
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {char.evidence.map((ev, i) => (
                <div key={i} className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[#0f0f0f] rounded-xl border border-[#2d2d4e]">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0"
                    style={{ background: char.accentColor + '25', color: char.accentColor }}>{i + 1}</div>
                  <div className="min-w-0">
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{ev.desc}</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-1">📍 {ev.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: char.accentColor }}></span>
              同宇宙角色
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {related.map(c => (
                <Link key={c.id} to={`/characters/${c.id}`}>
                  <div className="bg-[#0f0f0f] border border-[#2d2d4e] rounded-xl p-2.5 sm:p-3 hover:border-orange-500/40 hover:bg-[#1a1a2e] transition-all group text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg mx-auto flex items-center justify-center text-lg sm:text-xl mb-1.5 sm:mb-2"
                      style={{ background: c.accentColor + '22', color: c.accentColor }}>{c.name[0]}</div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-300 transition-colors truncate">{c.name}</div>
                    <div className="text-[10px] sm:text-xs tabular-nums mt-0.5" style={{ color: c.accentColor }}>{c.overallScore.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}


