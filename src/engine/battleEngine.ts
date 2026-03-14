import type { Character, Skill, BattleCharacter, BattleEvent, BattleRound, BattleResult } from '../types'

// ============ 初始化对战角色 ============
export function initBattleCharacter(character: Character, skillsMap: Record<string, Skill[]>): BattleCharacter {
  const maxHp = Math.round(character.overallScore * 2)
  const maxStamina = Math.round(character.stats.stamina * 10)
  const skills = skillsMap[character.id] ?? []
  return {
    character,
    hp: maxHp,
    maxHp,
    stamina: maxStamina,
    maxStamina,
    skills,
    skillCooldowns: {},
  }
}

// ============ 选择技能（AI逻辑）============
function selectSkill(bc: BattleCharacter, isUrgent: boolean): Skill {
  const available = bc.skills.filter(skill => {
    const cd = bc.skillCooldowns[skill.id] ?? 0
    return cd <= 0 && bc.stamina >= skill.staminaCost
  })

  if (available.length === 0) {
    // 体力不足时用普通攻击（第一个技能不消耗体力）
    return bc.skills[0]
  }

  if (isUrgent) {
    // 血量低时优先用大招
    const ultimates = available.filter(s => s.type === 'ultimate')
    if (ultimates.length > 0) return ultimates[0]
  }

  // 随机权重选择（大招权重低，普通攻击权重高）
  const weights = available.map(s => {
    if (s.type === 'ultimate') return 1
    if (s.type === 'special') return 2
    if (s.type === 'defense') return 1.5
    return 3
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let rand = Math.random() * totalWeight
  for (let i = 0; i < available.length; i++) {
    rand -= weights[i]
    if (rand <= 0) return available[i]
  }
  return available[available.length - 1]
}

// ============ 格式化叙事文本 ============
function formatNarrative(template: string, attacker: string, target: string): string {
  return template.replace(/\{attacker\}/g, attacker).replace(/\{target\}/g, target)
}

// ============ 计算伤害 ============
function calcDamage(attacker: BattleCharacter, defender: BattleCharacter, skill: Skill): {
  damage: number
  isCritical: boolean
} {
  const baseAtk = attacker.character.stats.attack
  const baseDef = defender.character.stats.defense
  // 暴击率与速度相关
  const critRate = attacker.character.stats.speed / 400
  const isCritical = Math.random() < critRate

  let damage = Math.round(
    baseAtk * skill.damageMult * (1 - baseDef / 300) * (0.85 + Math.random() * 0.3)
  )
  if (isCritical) damage = Math.round(damage * 1.5)

  // 体力不足时伤害打折
  const staminaRatio = attacker.stamina / attacker.maxStamina
  if (staminaRatio < 0.3) damage = Math.round(damage * 0.7)

  return { damage: Math.max(damage, 10), isCritical }
}

// ============ 生成回合开场白 ============
function roundStartNarrative(round: number, a: BattleCharacter, b: BattleCharacter): string {
  const intros = [
    `——【第${round}回合】——\n${a.character.name}的气息越发凝重，${b.character.name}丝毫不退，双方凝视对方的眼睛，空气仿佛凝固……`,
    `——【第${round}回合】——\n战场上尘埃未散，${a.character.name}调整呼吸，${b.character.name}运转着体内的力量，新一轮交锋即将爆发！`,
    `——【第${round}回合】——\n两人如同两颗星球，引力让他们无法停止碰撞。${a.character.name}率先蓄力，${b.character.name}感知到危险开始戒备……`,
    `——【第${round}回合】——\n时间在爆发中流逝，${a.character.name}与${b.character.name}都已伤痕累累，但无一人有退缩之意……`,
    `——【第${round}回合】——\n力量的碰撞将地面化为废墟，${a.character.name}眼中燃烧着战意，${b.character.name}同样寸步不让，战斗进入白热化！`,
  ]
  return intros[Math.min(round - 1, intros.length - 1)]
}

// ============ 生成战斗结束叙事 ============
function generateEndNarrative(winner: BattleCharacter, loser: BattleCharacter, totalRounds: number): string {
  const w = winner.character.name
  const l = loser.character.name
  const endings = [
    `经过${totalRounds}回合惊天动地的较量，${l}终于力竭，轰然倒地。${w}喘着粗气，望向倒下的对手，缓缓收回拳头——这场战斗，以${w}的胜利告终。`,
    `${l}抬起头，身上的伤已无法支撑继续战斗。${w}静静地站在原地，"是你输了。"简短的一句话，宣告了这场战斗的终章。`,
    `在第${totalRounds}回合，${l}的防线彻底崩溃，${w}以压倒性的最后一击终结了战斗。废墟之中，只有${w}的身影还屹立不倒。`,
  ]
  return endings[Math.floor(Math.random() * endings.length)]
}

// ============ 核心模拟函数 ============
export function simulateBattle(charA: Character, charB: Character, skillsMap: Record<string, Skill[]>): BattleResult {
  const bcA = initBattleCharacter(charA, skillsMap)
  const bcB = initBattleCharacter(charB, skillsMap)
  const rounds: BattleRound[] = []
  const MAX_ROUNDS = 12

  let currentRound = 0

  while (bcA.hp > 0 && bcB.hp > 0 && currentRound < MAX_ROUNDS) {
    currentRound++
    const events: BattleEvent[] = []

    // 回合开场叙事
    events.push({
      type: 'round_start',
      attacker: charA.name,
      target: charB.name,
      narrative: roundStartNarrative(currentRound, bcA, bcB),
    })

    // 每回合双方各行动一次，速度高的先出手
    const order: [BattleCharacter, BattleCharacter][] = charA.stats.speed >= charB.stats.speed
      ? [[bcA, bcB], [bcB, bcA]]
      : [[bcB, bcA], [bcA, bcB]]

    for (const [attacker, defender] of order) {
      if (defender.hp <= 0) break

      const isUrgent = attacker.hp / attacker.maxHp < 0.3
      const skill = selectSkill(attacker, isUrgent)

      // 命中判定
      const hit = Math.random() < skill.hitRate

      if (!hit) {
        events.push({
          type: 'miss',
          attacker: attacker.character.name,
          target: defender.character.name,
          skill,
          narrative: `${attacker.character.name}使出【${skill.name}】，但${defender.character.name}敏锐地察觉到，侧身闪过，攻击落空！`,
        })
      } else {
        const { damage, isCritical } = calcDamage(attacker, defender, skill)
        defender.hp = Math.max(0, defender.hp - damage)

        // 消耗体力
        attacker.stamina = Math.max(0, attacker.stamina - skill.staminaCost)
        // 更新冷却
        attacker.skillCooldowns[skill.id] = skill.cooldown

        // 选取叙事模板
        const templates = skill.narrativeTemplates
        let narrative = formatNarrative(
          templates[Math.floor(Math.random() * templates.length)],
          attacker.character.name,
          defender.character.name,
        )

        if (isCritical) {
          narrative += `\n暴击！${attacker.character.name}的攻击精准命中要害，${defender.character.name}受到了${damage}点重创！`
        } else {
          narrative += `\n${defender.character.name}承受了${damage}点伤害`
          if (defender.hp / defender.maxHp < 0.3) {
            narrative += `，已经岌岌可危……`
          } else if (defender.hp / defender.maxHp < 0.6) {
            narrative += `，状态明显下滑。`
          } else {
            narrative += `。`
          }
        }

        events.push({
          type: isCritical ? 'critical' : (skill.type === 'ultimate' ? 'ultimate' : 'attack'),
          attacker: attacker.character.name,
          target: defender.character.name,
          skill,
          damage,
          isCritical,
          narrative,
        })
      }

      // 冷却倒计时
      for (const key of Object.keys(attacker.skillCooldowns)) {
        if (attacker.skillCooldowns[key] > 0) attacker.skillCooldowns[key]--
      }
      // 体力自然恢复
      attacker.stamina = Math.min(attacker.maxStamina, attacker.stamina + Math.round(attacker.maxStamina * 0.1))
    }

    rounds.push({
      roundNumber: currentRound,
      events,
      hpA: bcA.hp,
      hpB: bcB.hp,
      staminaA: bcA.stamina,
      staminaB: bcB.stamina,
    })
  }

  // 判定胜负
  let winner: BattleCharacter
  let loser: BattleCharacter
  if (bcA.hp <= 0 && bcB.hp <= 0) {
    // 同归于尽判血量更高者
    winner = bcA.hp >= bcB.hp ? bcA : bcB
    loser = winner === bcA ? bcB : bcA
  } else if (bcB.hp <= 0) {
    winner = bcA; loser = bcB
  } else if (bcA.hp <= 0) {
    winner = bcB; loser = bcA
  } else {
    // 超时判剩余血量百分比
    const ratioA = bcA.hp / bcA.maxHp
    const ratioB = bcB.hp / bcB.maxHp
    winner = ratioA >= ratioB ? bcA : bcB
    loser = winner === bcA ? bcB : bcA
  }

  // 战斗结束事件
  const lastRound = rounds[rounds.length - 1]
  if (lastRound) {
    lastRound.events.push({
      type: 'battle_end',
      attacker: winner.character.name,
      target: loser.character.name,
      narrative: generateEndNarrative(winner, loser, currentRound),
    })
  }

  return {
    winner: winner.character.id,
    loser: loser.character.id,
    rounds,
    totalRounds: currentRound,
    summary: `${winner.character.name} 胜！共战斗 ${currentRound} 回合。${winner.character.name}剩余HP：${winner.hp}/${winner.maxHp}`,
  }
}
