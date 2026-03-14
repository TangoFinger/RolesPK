import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import RadarChart from '../components/RadarChart'
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
    <div className="bg-[#0f0f0f] border border-[#2d2d4e] rounded-xl p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded font-bold"
            style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
          <h4 className="text-white font-bold text-sm">{skill.name}</h4>
          {skill.type === 'ultimate' && <span className="text-yellow-400 text-xs">★ 必杀技</span>}
        </div>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed mb-3">{skill.description}</p>
      <p className="text-gray-500 text-xs italic mb-3">"{skill.effectDesc}"</p>
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">伤害倍率</span>
          <span className="font-bold" style={{ color: accentColor }}>×{skill.damageMult}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">体力消耗</span>
          <span className="font-bold text-blue-400">-{skill.staminaCost}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">命中率</span>
          <span className="font-bold text-green-400">{Math.round(skill.hitRate * 100)}%</span>
        </div>
        {skill.cooldown > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-gray-600">冷却</span>
            <span className="font-bold text-orange-400">{skill.cooldown} 回合</span>
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
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden px-4 py-10"
        style={{ background: `linear-gradient(135deg, ${char.accentColor}18 0%, #0f0f0f 60%)` }}>
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-[200px] font-black opacity-5 select-none pointer-events-none"
          style={{ color: char.accentColor }}>{char.name[0]}</div>
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-gray-300">首页</Link><span>/</span>
            <Link to="/characters" className="hover:text-gray-300">角色库</Link><span>/</span>
            <span style={{ color: char.accentColor }}>{char.name}</span>
          </nav>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-4 border border-[#2d2d4e]"
                style={{ background: char.accentColor + '22', color: char.accentColor }}>{char.name[0]}</div>
              <h1 className="text-4xl font-black text-white mb-1">{char.name}</h1>
              <p className="text-gray-400 mb-4">{char.alias.join(' · ')}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {universe && <span className="text-sm px-3 py-1 rounded-full border font-semibold"
                  style={{ color: char.accentColor, borderColor: char.accentColor + '50', background: char.accentColor + '18' }}>{universe.name}</span>}
                {universe && <span className="text-sm px-3 py-1 rounded-full bg-[#2d2d4e] text-gray-300 font-mono">{universe.tier}级宇宙 ×{universe.tierCoeff}</span>}
                <span className="text-sm px-3 py-1 rounded-full bg-[#2d2d4e] text-gray-300">{char.race}</span>
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${char.faction === '反派' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{char.faction}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {char.tags.map(tag => <span key={tag} className="text-xs bg-[#1a1a2e] border border-[#2d2d4e] text-gray-400 px-2 py-1 rounded-lg">{tag}</span>)}
              </div>
              <p className="text-gray-300 leading-relaxed text-base mb-5 max-w-xl">{char.description}</p>
              {work && <p className="text-sm text-gray-500">📺 出自：<span className="text-gray-300">{work.title}</span><span className="text-gray-600 ml-2">({work.year})</span></p>}
              <div className="flex gap-3 mt-5 flex-wrap">
                <button onClick={() => navigate(`/battle`)}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-lg shadow-orange-500/25 text-sm">
                  🔥 模拟对战
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl px-8 py-5 text-center min-w-[200px]">
                <div className="text-xs text-gray-500 mb-1">{currentForm ? currentForm.name : '综合战力值'}</div>
                <div className="text-5xl font-black tabular-nums" style={{ color: char.accentColor }}>{displayScore.toLocaleString()}</div>
                {char.rank && <div className="text-xs text-gray-500 mt-2">全宇宙排名 #{char.rank}</div>}
              </div>
              <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-2">
                <RadarChart stats={displayStats} color={char.accentColor} size={280} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Stat Bars */}
        <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">📊 六维评分</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STAT_KEYS.map(key => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-300"><span>{STAT_ICONS[key]}</span>{STAT_LABELS[key]}</div>
                  <span className="text-sm font-black tabular-nums"
                    style={{ color: displayStats[key] >= 90 ? char.accentColor : displayStats[key] >= 70 ? '#fbbf24' : '#9ca3af' }}>{displayStats[key]}</span>
                </div>
                <div className="h-2.5 bg-[#2d2d4e] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${displayStats[key]}%`, background: `linear-gradient(90deg, ${char.accentColor}88, ${char.accentColor})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                🎯 技能库
                <span className="text-sm font-normal text-gray-500">({skills.length} 个技能)</span>
              </h2>
              <button onClick={() => navigate('/battle')}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ color: char.accentColor, background: char.accentColor + '15', border: `1px solid ${char.accentColor}40` }}>
                用这些技能去对战 →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map(skill => <SkillCard key={skill.id} skill={skill} accentColor={char.accentColor} />)}
            </div>
          </div>
        )}

        {/* Forms */}
        {char.forms.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">🔄 形态列表</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {char.forms.map((form, i) => (
                <button key={i} onClick={() => setActiveForm(i)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                  style={activeForm === i
                    ? { borderColor: char.accentColor + '60', background: char.accentColor + '20', color: char.accentColor }
                    : { borderColor: '#2d2d4e', color: '#9ca3af' }}>
                  {form.name}
                </button>
              ))}
            </div>
            {currentForm && (
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xl mb-1">{currentForm.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{currentForm.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">形态战力值</span>
                    <span className="text-3xl font-black" style={{ color: char.accentColor }}>{currentForm.overallScore.toLocaleString()}</span>
                  </div>
                </div>
                <RadarChart stats={currentForm.stats} color={char.accentColor} size={220} />
              </div>
            )}
          </div>
        )}

        {/* Evidence */}
        {char.evidence.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">📋 战力依据</h2>
            <div className="space-y-3">
              {char.evidence.map((ev, i) => (
                <div key={i} className="flex gap-3 p-3 bg-[#0f0f0f] rounded-xl border border-[#2d2d4e]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: char.accentColor + '25', color: char.accentColor }}>{i + 1}</div>
                  <div>
                    <p className="text-gray-200 text-sm">{ev.desc}</p>
                    <p className="text-gray-500 text-xs mt-1">📍 {ev.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">🌌 同宇宙角色</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map(c => (
                <Link key={c.id} to={`/characters/${c.id}`}>
                  <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl p-3 hover:border-orange-500/30 transition-all group text-center">
                    <div className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center text-xl mb-2"
                      style={{ background: c.accentColor + '22', color: c.accentColor }}>{c.name[0]}</div>
                    <div className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">{c.name}</div>
                    <div className="text-xs tabular-nums mt-1" style={{ color: c.accentColor }}>{c.overallScore.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


