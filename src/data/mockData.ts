import type { Universe, Work, Character, BattleRecord, Skill } from '../types'

// ============ 技能库 ============
export const skillsMap: Record<string, Skill[]> = {
  goku: [
    {
      id: 'goku-kamehameha', name: '龟派气功', type: 'energy',
      description: '汇聚全身气弹形成强大能量波',
      damageMult: 1.8, staminaCost: 20, cooldown: 1, hitRate: 0.92,
      effectDesc: '炽烈的蓝色能量波席卷而来',
      narrativeTemplates: [
        '{attacker}双手合拢，低吼一声"龟——派——气——功！"，蓝色能量波如同小型海啸般轰向{target}！',
        '{attacker}猛地伸出双掌，浓缩到极致的气弹瞬间释放，龟派气功将周围的空气撕裂，直冲{target}而去！',
      ]
    },
    {
      id: 'goku-instant', name: '瞬身拳', type: 'physical',
      description: '利用瞬间移动发动奇袭重拳',
      damageMult: 1.5, staminaCost: 15, cooldown: 0, hitRate: 0.85,
      effectDesc: '身影消失，拳头已至',
      narrativeTemplates: [
        '{attacker}身形一晃，瞬间出现在{target}身后，一记重拳狠狠砸在对方背部！',
        '{attacker}踏出瞬身步，{target}还没反应过来，已经被一记沉重的上勾拳击飞！',
      ]
    },
    {
      id: 'goku-spirit-bomb', name: '元气弹', type: 'ultimate',
      description: '汇聚世间万物生命能量形成的终极技',
      damageMult: 3.5, staminaCost: 60, cooldown: 4, hitRate: 0.80,
      effectDesc: '巨大的光球积聚了宇宙的能量',
      narrativeTemplates: [
        '{attacker}双手高举过头，仰望苍穹，从宇宙四方汇聚而来的能量凝成一颗巨大光球！"元气弹！"——轰然砸下，{target}被淹没在耀眼的白光中！',
      ]
    },
    {
      id: 'goku-god-ki', name: '神之气·爆发', type: 'special',
      description: '激发超级赛亚人神蓝的神之气',
      damageMult: 2.2, staminaCost: 35, cooldown: 2, hitRate: 0.88,
      effectDesc: '神圣的蓝色火焰将悟空整个包裹',
      narrativeTemplates: [
        '{attacker}全身涌现出神圣的蓝色气焰，瞳孔化为碧蓝，神之气瞬间压垮了周围的空间，{target}感到一股无形的力量将自己压制！',
      ]
    },
    {
      id: 'goku-counter', name: '本能回避', type: 'defense',
      description: '极意功·本能状态下的直觉反应',
      damageMult: 0.5, staminaCost: 10, cooldown: 0, hitRate: 1.0,
      effectDesc: '身体自动躲避攻击并反击',
      narrativeTemplates: [
        '{attacker}的身体仿佛拥有自己的意识，不经思考便闪过了{target}的攻击，随即以一记反手掌击精准回击！',
      ]
    },
  ],

  vegeta: [
    {
      id: 'vegeta-bigbang', name: '终极闪光', type: 'energy',
      description: '集中全部战斗力于一点爆发',
      damageMult: 2.0, staminaCost: 25, cooldown: 1, hitRate: 0.90,
      effectDesc: '白金色的能量柱刺破天际',
      narrativeTemplates: [
        '{attacker}将右手伸向{target}，轻声说"终……极……闪光"，下一瞬间白金色能量柱将周遭一切轰为虚无！',
        '{attacker}双手交叉蓄力，凝聚的气压将地面压出深坑，"终极闪光！"——毁灭性的能量直奔{target}！',
      ]
    },
    {
      id: 'vegeta-galick', name: '加力卡炮', type: 'energy',
      description: '紫色气炮强力齐射',
      damageMult: 1.6, staminaCost: 18, cooldown: 0, hitRate: 0.92,
      effectDesc: '紫色能量弹密集倾泻',
      narrativeTemplates: [
        '{attacker}双手抵住侧脸，紫色光芒爆发，"加——力——卡——炮！"，{target}被漫天紫色气弹覆盖！',
      ]
    },
    {
      id: 'vegeta-pride', name: '赛亚人之傲', type: 'special',
      description: '激发王族血脉，短暂大幅提升攻击',
      damageMult: 2.5, staminaCost: 40, cooldown: 3, hitRate: 0.88,
      effectDesc: '赛亚人王族的骄傲燃烧殆尽',
      narrativeTemplates: [
        '"我是赛亚人的王子！"——{attacker}怒吼着，蓝色气焰冲天，随即以超越极限的爆发力将{target}轰飞！',
      ]
    },
    {
      id: 'vegeta-rush', name: '精英连击', type: 'physical',
      description: '高速连续出拳踢击',
      damageMult: 1.4, staminaCost: 12, cooldown: 0, hitRate: 0.88,
      effectDesc: '拳影残留空气中',
      narrativeTemplates: [
        '{attacker}身形如残影般快速移动，对{target}展开上中下三路的精准连击，每一拳都蕴含着赛亚人精英的骄傲！',
      ]
    },
    {
      id: 'vegeta-overload', name: '超越极限', type: 'ultimate',
      description: '突破自身极限爆发全部力量',
      damageMult: 3.2, staminaCost: 55, cooldown: 4, hitRate: 0.85,
      effectDesc: '超出身体承受极限的气劲将周围一切震飞',
      narrativeTemplates: [
        '"我要超越你，卡卡罗特……也超越我自己！"——{attacker}爆发出远超极限的战斗气，将{target}与整片战场一同震碎！',
      ]
    },
  ],

  naruto: [
    {
      id: 'naruto-rasengan', name: '螺旋丸', type: 'physical',
      description: '汇聚查克拉于掌心形成旋转球体',
      damageMult: 1.7, staminaCost: 20, cooldown: 0, hitRate: 0.90,
      effectDesc: '旋转的查克拉球贯穿防御',
      narrativeTemplates: [
        '{attacker}掌心凝聚出蓝色旋转球体，"螺旋丸！"——直接贯入{target}的防御中，爆炸性的查克拉将对方炸飞！',
        '{attacker}猛地冲向{target}，将蓄满查克拉的螺旋丸硬压在对方身上，旋转的能量将防御撕碎！',
      ]
    },
    {
      id: 'naruto-shadow-clone', name: '多重影分身', type: 'special',
      description: '召唤大量实体分身群攻',
      damageMult: 2.0, staminaCost: 30, cooldown: 2, hitRate: 0.85,
      effectDesc: '千名分身从四面八方涌来',
      narrativeTemplates: [
        '"影分身之术！"——瞬间，数百个一模一样的{attacker}包围了{target}，从四面八方同时冲来，密集的拳脚让对方完全无法防御！',
      ]
    },
    {
      id: 'naruto-tailed-beast-bomb', name: '尾兽玉', type: 'energy',
      description: '九尾模式下压缩正负查克拉发射',
      damageMult: 2.8, staminaCost: 45, cooldown: 3, hitRate: 0.88,
      effectDesc: '黑白相间的压缩球体爆发毁灭性能量',
      narrativeTemplates: [
        '{attacker}化为九尾查克拉模式，口中凝聚出正负查克拉交织的漆黑球体，轰然射出，{target}所在位置被爆炸吞噬！',
      ]
    },
    {
      id: 'naruto-sage-art', name: '仙法·超大玉螺旋手里剑', type: 'ultimate',
      description: '仙人模式下的终极忍术',
      damageMult: 3.3, staminaCost: 58, cooldown: 4, hitRate: 0.82,
      effectDesc: '巨大的风刃螺旋吞噬目标',
      narrativeTemplates: [
        '{attacker}进入仙人模式，静止片刻汲取自然能量，随即召唤出巨大的风属性螺旋手里剑，"超大玉螺旋手里剑！"——{target}被席卷进切割一切的风刃旋涡中！',
      ]
    },
    {
      id: 'naruto-talk', name: '话术·鸣人之道', type: 'special',
      description: '以言语触动对手内心',
      damageMult: 0.8, staminaCost: 5, cooldown: 1, hitRate: 0.95,
      effectDesc: '意外地让对手产生动摇',
      narrativeTemplates: [
        '{attacker}直视着{target}，眼中没有恐惧只有坚定："我绝对不会放弃！"——这份意志竟让{target}微微一愣，给了鸣人可乘之机！',
      ]
    },
  ],

  thanos: [
    {
      id: 'thanos-power-stone', name: '力量宝石·爆碎', type: 'physical',
      description: '借助力量宝石爆发无与伦比的力量',
      damageMult: 2.2, staminaCost: 25, cooldown: 1, hitRate: 0.90,
      effectDesc: '地面在脚步声中开裂',
      narrativeTemplates: [
        '{attacker}拳头上紫色宝石闪烁，一拳轰出——空气被压缩成冲击波，{target}连同周围的岩石一起被震碎飞出！',
      ]
    },
    {
      id: 'thanos-space-stone', name: '空间宝石·折叠', type: 'special',
      description: '扭曲空间进行瞬移与困锁',
      damageMult: 1.5, staminaCost: 20, cooldown: 1, hitRate: 0.95,
      effectDesc: '空间折叠，目标被困于扭曲维度',
      narrativeTemplates: [
        '{attacker}蓝色宝石发光，将{target}周围的空间猛地折叠，对方像被无形之手挤压，无法动弹！',
      ]
    },
    {
      id: 'thanos-reality-stone', name: '现实宝石·扭曲', type: 'special',
      description: '改变现实让攻击化为泡影',
      damageMult: 1.8, staminaCost: 30, cooldown: 2, hitRate: 0.92,
      effectDesc: '物理定律在此地形同虚设',
      narrativeTemplates: [
        '{attacker}轻轻摆动手套，{target}的攻击在接触的瞬间变成了漫天花瓣散落，随即现实反转，灭霸的反击从意想不到的角度出现！',
      ]
    },
    {
      id: 'thanos-snap', name: '响指·命运裁决', type: 'ultimate',
      description: '六颗宝石集齐时的终极一击',
      damageMult: 4.0, staminaCost: 80, cooldown: 6, hitRate: 0.90,
      effectDesc: '一声响指，命运就此改变',
      narrativeTemplates: [
        '{attacker}缓缓抬起装备着六颗无限宝石的手套，目光平静地看向{target}，"这是……必要的牺牲。"——手指合拢，一声轻响，宇宙的意志降临！',
      ]
    },
    {
      id: 'thanos-double-blade', name: '双刃战斧·横扫', type: 'physical',
      description: '以泰坦双刃战斧进行近身割裂',
      damageMult: 1.9, staminaCost: 22, cooldown: 1, hitRate: 0.88,
      effectDesc: '锋利的战斧划破空气',
      narrativeTemplates: [
        '{attacker}抄起双刃战斧，以泰坦之力横扫而出，斧刃所过之处空气都被切割，{target}被迫全力抵挡！',
      ]
    },
  ],

  luffy: [
    {
      id: 'luffy-red-hawk', name: '红鹰', type: 'physical',
      description: 'Gear2结合武装色霸气的火焰拳',
      damageMult: 1.8, staminaCost: 20, cooldown: 1, hitRate: 0.90,
      effectDesc: '拳头燃起真实的火焰',
      narrativeTemplates: [
        '{attacker}双腿蒸汽喷涌，整个人化为残影，拳头燃起烈焰，"红鹰！"——带着火焰的重拳命中{target}，爆炸性的冲击瞬间扩散！',
      ]
    },
    {
      id: 'luffy-kong-gun', name: 'Gear4·空气炮', type: 'energy',
      description: '将自身压缩弹出的超级重拳',
      damageMult: 2.2, staminaCost: 30, cooldown: 2, hitRate: 0.88,
      effectDesc: '压缩的空气随着拳头爆炸性释放',
      narrativeTemplates: [
        '{attacker}吹气膨胀进入Gear4形态，肌肉上的黑色武装霸气纹路浮现，"空气炮！"——压缩到极致的拳头轰出，{target}被冲击波正面击中！',
      ]
    },
    {
      id: 'luffy-gear5', name: 'Gear5·太阳神炮', type: 'ultimate',
      description: '太阳神形态下将一切变成橡皮的终极攻击',
      damageMult: 3.5, staminaCost: 60, cooldown: 4, hitRate: 0.85,
      effectDesc: '白色蓬蒙中，一切规则都变成了笑话',
      narrativeTemplates: [
        '{attacker}白发飘舞，红晕浮现，太阳神的力量涌现！笑声之中，{attacker}随手将周围的地面捏成一颗巨球，笑嘻嘻地朝{target}砸去，然而这力量却比任何招式都更加恐怖！',
      ]
    },
    {
      id: 'luffy-haki-burst', name: '霸王色霸气·迸发', type: 'special',
      description: '爆发霸王色霸气震慑对手',
      damageMult: 1.5, staminaCost: 25, cooldown: 2, hitRate: 0.92,
      effectDesc: '无形的意志压垮周围一切',
      narrativeTemplates: [
        '{attacker}怒吼一声，金色的霸王色霸气从体内爆发，如同闪电般在空中蔓延，{target}感到一股难以抗拒的王者意志将自己压制！',
      ]
    },
    {
      id: 'luffy-gator', name: 'Gear4·蛇人·Python', type: 'physical',
      description: '扭曲轨迹的弹射重击',
      damageMult: 1.6, staminaCost: 18, cooldown: 1, hitRate: 0.82,
      effectDesc: '拳头以不可思议的曲线命中',
      narrativeTemplates: [
        '{attacker}的拳头以匪夷所思的曲线绕过{target}的防御，从背后猛然爆发，"蛇人Python！"——{target}根本没有预判到这个角度！',
      ]
    },
  ],

  sasuke: [
    {
      id: 'sasuke-chidori', name: '千鸟', type: 'energy',
      description: '汇聚雷遁查克拉于手中刺穿目标',
      damageMult: 2.0, staminaCost: 25, cooldown: 1, hitRate: 0.88,
      effectDesc: '雷光在手中咆哮如千鸟鸣叫',
      narrativeTemplates: [
        '{attacker}手中雷鸣大作，蓝白色闪电将手掌包裹，"千鸟！"——以穿透一切的速度直刺{target}，雷遁查克拉撕裂了防御！',
        '{attacker}以超速冲向{target}，雷光轰鸣，千鸟破空而出，那声音如真的鸟鸣一般刺穿耳膜，更刺穿了{target}的防线！',
      ]
    },
    {
      id: 'sasuke-amaterasu', name: '天照', type: 'special',
      description: '以万花筒写轮眼引燃不灭的黑焰',
      damageMult: 2.5, staminaCost: 35, cooldown: 3, hitRate: 0.90,
      effectDesc: '黑色火焰燃烧七天七夜',
      narrativeTemplates: [
        '{attacker}左眼鲜血流下，目光锁定{target}——猝然间，黑色火焰无声蔓延，天照之焰将{target}的一切防御燃为灰烬，且永不熄灭！',
      ]
    },
    {
      id: 'sasuke-susanoo', name: '须佐能乎', type: 'defense',
      description: '召唤出守护佐助的完全体神明',
      damageMult: 1.8, staminaCost: 40, cooldown: 2, hitRate: 0.95,
      effectDesc: '紫色的巨神降临战场',
      narrativeTemplates: [
        '{attacker}双眸同时开启万花筒写轮眼，一声低吼，紫色骸骨外壳逐渐成形——须佐能乎完全体降临！巨神持剑横扫，{target}被迫全力应对这无差别的攻击！',
      ]
    },
    {
      id: 'sasuke-rinnegan-space', name: '轮回眼·空间跳跃', type: 'special',
      description: '利用轮回眼进行空间置换奇袭',
      damageMult: 1.6, staminaCost: 20, cooldown: 1, hitRate: 0.93,
      effectDesc: '瞬间出现在目标身后',
      narrativeTemplates: [
        '{attacker}左眼轮回眼闪动，与预先布置的标记瞬间置换位置，出现在{target}毫无防备的侧面，千鸟从近距离贯穿而出！',
      ]
    },
    {
      id: 'sasuke-kirin', name: '麒麟', type: 'ultimate',
      description: '操控天雷引发的究极雷击',
      damageMult: 3.8, staminaCost: 65, cooldown: 5, hitRate: 0.85,
      effectDesc: '整片天空的雷电化为一击',
      narrativeTemplates: [
        '{attacker}望向阴云密布的天空，大量火遁将积雨云点燃，随即以查克拉引导整片天空的雷电，"麒麟！"——如神罚般的天雷以光速轰向{target}，连逃跑都来不及！',
      ]
    },
  ],

  ironman: [
    {
      id: 'ironman-repulsor', name: '掌心斥力炮', type: 'energy',
      description: '掌心斥力发射器的密集射击',
      damageMult: 1.5, staminaCost: 15, cooldown: 0, hitRate: 0.92,
      effectDesc: '红金色能量束精准命中',
      narrativeTemplates: [
        '{attacker}双掌射出炙热的斥力光束，轰鸣声中{target}被连番命中，纳米盔甲的AI系统自动锁定每一个弱点！',
      ]
    },
    {
      id: 'ironman-unibeam', name: '胸口能量炮·全开', type: 'energy',
      description: '胸口方舟反应炉倾力输出',
      damageMult: 2.5, staminaCost: 40, cooldown: 2, hitRate: 0.88,
      effectDesc: '白色光束将夜晚照如白昼',
      narrativeTemplates: [
        '"方舟反应炉……全功率输出。"——{attacker}胸口的弧形反应炉爆发出耀眼白光，巨大能量束轰向{target}，连空气都在高温中融化！',
      ]
    },
    {
      id: 'ironman-nano-swarm', name: '纳米蜂群·围剿', type: 'special',
      description: '纳米颗粒群包围目标进行全方位攻击',
      damageMult: 1.8, staminaCost: 25, cooldown: 2, hitRate: 0.90,
      effectDesc: '无数纳米粒子从四面八方涌来',
      narrativeTemplates: [
        '{attacker}手臂爆开，数以万计的纳米颗粒如蜂群般散开，将{target}团团围住，从每个角度同时展开攻击，密集程度令人窒息！',
      ]
    },
    {
      id: 'ironman-infinity-gauntlet', name: '纳米手套·响指', type: 'ultimate',
      description: '佩戴无限宝石时的终极一击',
      damageMult: 4.0, staminaCost: 90, cooldown: 6, hitRate: 0.88,
      effectDesc: '以生命为代价的最终决断',
      narrativeTemplates: [
        '"我是钢铁侠。"——{attacker}的纳米装甲汇聚成无限手套，包裹着六颗无限宝石，以燃烧自身的代价打出命运的响指，{target}在橙色的光芒中化为飞灰！',
      ]
    },
    {
      id: 'ironman-analysis', name: '战术分析·精准打击', type: 'physical',
      description: 'AI分析对手弱点发动精准一击',
      damageMult: 1.7, staminaCost: 10, cooldown: 1, hitRate: 0.95,
      effectDesc: 'AI锁定最薄弱的防御缝隙',
      narrativeTemplates: [
        '盔甲AI在0.3秒内完成了对{target}防御体系的全面分析，"FRIDAY，锁定弱点。"——{attacker}以精准到毫米级的打击切入{target}防御的每一处破绽！',
      ]
    },
  ],

  eren: [
    {
      id: 'eren-titan-punch', name: '始祖巨人·轰天拳', type: 'physical',
      description: '骸骨巨人形态下的毁灭性重拳',
      damageMult: 2.2, staminaCost: 25, cooldown: 1, hitRate: 0.88,
      effectDesc: '拳头带起的气浪将山体震碎',
      narrativeTemplates: [
        '{attacker}的始祖巨人形态高耸入云，一拳轰下，冲击波将{target}连同周围地形一起砸碎，那不是拳头，是一场地震！',
      ]
    },
    {
      id: 'eren-wall-titans', name: '地鸣·万军踏碎', type: 'ultimate',
      description: '驱动墙壁中数万巨人踏平一切',
      damageMult: 3.6, staminaCost: 70, cooldown: 5, hitRate: 0.90,
      effectDesc: '大地颤抖，天地变色，万千巨人列阵而来',
      narrativeTemplates: [
        '{attacker}双目化为发光的十字形，远处传来如同末日的脚步声——数以万计的超大型巨人从地平线涌现，朝{target}的方向席卷而来，这是地鸣，这是世界的终结！',
      ]
    },
    {
      id: 'eren-hardening', name: '战槌·水晶硬化', type: 'defense',
      description: '利用战槌巨人能力生成超硬水晶防御与武器',
      damageMult: 1.6, staminaCost: 20, cooldown: 1, hitRate: 0.90,
      effectDesc: '透明晶体以闪电速度从身体延伸',
      narrativeTemplates: [
        '{attacker}继承了战槌巨人之力，从地面急速生长出坚硬的水晶尖刺，将{target}逼入死角，随即形成锐利的水晶长枪刺去！',
      ]
    },
    {
      id: 'eren-warcry', name: '始祖之力·呼唤', type: 'special',
      description: '用始祖巨人之力控制周围巨人',
      damageMult: 2.0, staminaCost: 35, cooldown: 3, hitRate: 0.85,
      effectDesc: '周围所有巨人响应呼唤涌向目标',
      narrativeTemplates: [
        '{attacker}发出一声嘶吼，始祖之力传遍每一个巨人，附近所有的巨人同时转向{target}，疯狂扑去——{target}陷入了巨人的海洋！',
      ]
    },
    {
      id: 'eren-attack-titan', name: '进击的巨人·前进', type: 'physical',
      description: '进击巨人以超强韧性不断前进的意志',
      damageMult: 1.5, staminaCost: 15, cooldown: 0, hitRate: 0.88,
      effectDesc: '即便身受重伤也绝不停止',
      narrativeTemplates: [
        '{attacker}身上伤口不断愈合，进击巨人的天性让其毫无退意，"向前，向前，一直向前——"带着破损的身躯以不可撼动的意志冲向{target}！',
      ]
    },
  ],
}

export const universes: Universe[] = [
  { id: 'dragon-ball', name: '龙珠宇宙', tier: 'S', tierCoeff: 1.5, color: '#f97316' },
  { id: 'marvel', name: '漫威宇宙', tier: 'A', tierCoeff: 1.2, color: '#e11d48' },
  { id: 'dc', name: 'DC宇宙', tier: 'A', tierCoeff: 1.2, color: '#2563eb' },
  { id: 'naruto', name: '火影宇宙', tier: 'B', tierCoeff: 1.0, color: '#f59e0b' },
  { id: 'one-piece', name: '海贼王宇宙', tier: 'B', tierCoeff: 1.0, color: '#10b981' },
  { id: 'attack-on-titan', name: '进击的巨人', tier: 'C', tierCoeff: 0.8, color: '#6b7280' },
  { id: 'mcu', name: 'MCU', tier: 'A', tierCoeff: 1.1, color: '#dc2626' },
]

export const works: Work[] = [
  { id: 'dbz', title: '龙珠Z', type: 'anime', universeId: 'dragon-ball', year: 1989, cover: '' },
  { id: 'dbs', title: '龙珠超', type: 'anime', universeId: 'dragon-ball', year: 2015, cover: '' },
  { id: 'avengers', title: '复仇者联盟', type: 'film', universeId: 'mcu', year: 2012, cover: '' },
  { id: 'naruto-s', title: '火影忍者疾风传', type: 'anime', universeId: 'naruto', year: 2007, cover: '' },
  { id: 'one-piece-s', title: '海贼王', type: 'anime', universeId: 'one-piece', year: 1999, cover: '' },
  { id: 'aot-s', title: '进击的巨人', type: 'anime', universeId: 'attack-on-titan', year: 2013, cover: '' },
]

export const characters: Character[] = [
  {
    id: 'goku',
    name: '孙悟空',
    alias: ['卡卡罗特', 'Son Goku'],
    workId: 'dbs',
    universeId: 'dragon-ball',
    tags: ['超级赛亚人', '宇宙级', '力量型', '速度型'],
    race: '赛亚人',
    faction: '正义',
    description: '来自赛亚星的地球守护者，不断突破极限的最强战士，掌握超级赛亚人神·超级赛亚人变换。',
    coverImage: '',
    accentColor: '#f97316',
    stats: { attack: 99, defense: 88, speed: 97, intelligence: 72, stamina: 95, special: 98 },
    overallScore: 9800,
    baseScore: 6533,
    forms: [
      { name: '普通态', description: '基础状态', overallScore: 3200, stats: { attack: 70, defense: 65, speed: 68, intelligence: 72, stamina: 75, special: 60 } },
      { name: '超级赛亚人', description: '第一次超越极限', overallScore: 5500, stats: { attack: 82, defense: 75, speed: 80, intelligence: 72, stamina: 80, special: 78 } },
      { name: '超级赛亚人神', description: '神之力量', overallScore: 7800, stats: { attack: 91, defense: 84, speed: 90, intelligence: 72, stamina: 88, special: 90 } },
      { name: '超级赛亚人·神蓝', description: '神之力与赛亚人之力的融合', overallScore: 9800, stats: { attack: 99, defense: 88, speed: 97, intelligence: 72, stamina: 95, special: 98 } },
    ],
    evidence: [
      { desc: '与贝吉塔的战斗中展现神蓝等级战力', source: '龙珠超 第27集' },
      { desc: '本能之极·完全体突破界王神等级', source: '龙珠超 第129集' },
    ],
    rank: 1,
  },
  {
    id: 'vegeta',
    name: '贝吉塔',
    alias: ['赛亚人王子', 'Vegeta'],
    workId: 'dbs',
    universeId: 'dragon-ball',
    tags: ['超级赛亚人', '宇宙级', '力量型', '王族'],
    race: '赛亚人',
    faction: '正义',
    description: '赛亚人王子，自尊心极强的精英战士，从宿敌到盟友，战力始终与悟空并驾齐驱。',
    coverImage: '',
    accentColor: '#8b5cf6',
    stats: { attack: 98, defense: 87, speed: 95, intelligence: 85, stamina: 93, special: 95 },
    overallScore: 9650,
    baseScore: 6433,
    forms: [
      { name: '普通态', description: '基础状态', overallScore: 3100, stats: { attack: 68, defense: 63, speed: 66, intelligence: 85, stamina: 72, special: 58 } },
      { name: '超级赛亚人蓝', description: '超越极限的蓝发形态', overallScore: 9650, stats: { attack: 98, defense: 87, speed: 95, intelligence: 85, stamina: 93, special: 95 } },
    ],
    evidence: [{ desc: '神蓝等级与悟空势均力敌', source: '龙珠超 第27集' }],
    rank: 2,
  },
  {
    id: 'naruto',
    name: '漩涡鸣人',
    alias: ['七代目火影', 'Naruto Uzumaki'],
    workId: 'naruto-s',
    universeId: 'naruto',
    tags: ['忍者', '尾兽人柱力', '仙术', '六道'],
    race: '人类',
    faction: '木叶村',
    description: '从被村子排斥的孤儿成长为守护世界的七代目火影，六道仙人查克拉持有者。',
    coverImage: '',
    accentColor: '#f59e0b',
    stats: { attack: 95, defense: 88, speed: 92, intelligence: 70, stamina: 97, special: 96 },
    overallScore: 6530,
    baseScore: 6530,
    forms: [
      { name: '普通模式', description: '基础忍者形态', overallScore: 2200, stats: { attack: 60, defense: 55, speed: 58, intelligence: 70, stamina: 80, special: 55 } },
      { name: '仙人模式', description: '吸收自然能量', overallScore: 3800, stats: { attack: 78, defense: 72, speed: 75, intelligence: 70, stamina: 85, special: 78 } },
      { name: '尾兽模式', description: '九尾查克拉模式', overallScore: 5200, stats: { attack: 88, defense: 82, speed: 86, intelligence: 70, stamina: 93, special: 88 } },
      { name: '六道仙人模式', description: '六道仙人力量', overallScore: 6530, stats: { attack: 95, defense: 88, speed: 92, intelligence: 70, stamina: 97, special: 96 } },
    ],
    evidence: [{ desc: '与佐助联手击败大筒木辉夜', source: '火影忍者疾风传 第479集' }],
    rank: 3,
  },
  {
    id: 'thanos',
    name: '灭霸',
    alias: ['疯狂泰坦', 'Thanos'],
    workId: 'avengers',
    universeId: 'mcu',
    tags: ['宇宙级', '无限手套', '力量型', '智力型'],
    race: '永恒族衍生种',
    faction: '反派',
    description: '来自泰坦星的宇宙征服者，集齐无限宝石后拥有宇宙最强战力，一弹指消灭宇宙半数生命。',
    coverImage: '',
    accentColor: '#a855f7',
    stats: { attack: 92, defense: 91, speed: 78, intelligence: 95, stamina: 94, special: 99 },
    overallScore: 6380,
    baseScore: 5800,
    forms: [
      { name: '普通态', description: '无宝石状态', overallScore: 4200, stats: { attack: 85, defense: 84, speed: 78, intelligence: 95, stamina: 88, special: 70 } },
      { name: '无限手套（六宝石）', description: '集齐六颗无限宝石', overallScore: 6380, stats: { attack: 92, defense: 91, speed: 78, intelligence: 95, stamina: 94, special: 99 } },
    ],
    evidence: [{ desc: '单挑几乎击败复仇者联盟全员', source: '复仇者联盟：无限战争' }],
    rank: 4,
  },
  {
    id: 'luffy',
    name: '蒙奇·D·路飞',
    alias: ['草帽路飞', '五皇路飞'],
    workId: 'one-piece-s',
    universeId: 'one-piece',
    tags: ['海贼', '橡皮果实', '霸气', '五皇'],
    race: '人类',
    faction: '草帽海贼团',
    description: '目标是成为海贼王的男人，拥有橡皮橡皮果实能力，觉醒后进入Gear5白色蓬蒙形态。',
    coverImage: '',
    accentColor: '#10b981',
    stats: { attack: 94, defense: 85, speed: 90, intelligence: 65, stamina: 96, special: 95 },
    overallScore: 6200,
    baseScore: 6200,
    forms: [
      { name: 'Gear2', description: '加速血液流动', overallScore: 2500, stats: { attack: 70, defense: 58, speed: 82, intelligence: 65, stamina: 75, special: 65 } },
      { name: 'Gear4 蛇人', description: '气压弹性与流速结合', overallScore: 4800, stats: { attack: 85, defense: 78, speed: 88, intelligence: 65, stamina: 82, special: 85 } },
      { name: 'Gear5 太阳神', description: '果实觉醒·最高形态', overallScore: 6200, stats: { attack: 94, defense: 85, speed: 90, intelligence: 65, stamina: 96, special: 95 } },
    ],
    evidence: [{ desc: 'Gear5状态与四皇凯多战斗', source: '海贼王 第1049话' }],
    rank: 5,
  },
  {
    id: 'sasuke',
    name: '宇智波佐助',
    alias: ['最后的宇智波', 'Sasuke Uchiha'],
    workId: 'naruto-s',
    universeId: 'naruto',
    tags: ['写轮眼', '忍者', '六道', '速度型'],
    race: '人类',
    faction: '木叶村',
    description: '宇智波族最后的传人，拥有万花筒写轮眼与轮回眼，六道级别的力量。',
    coverImage: '',
    accentColor: '#6366f1',
    stats: { attack: 94, defense: 85, speed: 93, intelligence: 90, stamina: 88, special: 95 },
    overallScore: 6480,
    baseScore: 6480,
    forms: [
      { name: '万花筒写轮眼', description: '须佐能乎完全体', overallScore: 5000, stats: { attack: 88, defense: 82, speed: 87, intelligence: 90, stamina: 82, special: 88 } },
      { name: '六道轮回眼', description: '六道仙人力量', overallScore: 6480, stats: { attack: 94, defense: 85, speed: 93, intelligence: 90, stamina: 88, special: 95 } },
    ],
    evidence: [{ desc: '六道级须佐能乎与鸣人六道尾兽玉交锋', source: '火影忍者疾风传 第476集' }],
    rank: 6,
  },
  {
    id: 'ironman',
    name: '托尼·斯塔克',
    alias: ['钢铁侠', 'Iron Man'],
    workId: 'avengers',
    universeId: 'mcu',
    tags: ['科技型', '智力型', '盔甲', '复仇者'],
    race: '人类',
    faction: '复仇者联盟',
    description: '拥有全球最先进科技的天才亿万富翁，纳米装甲战斗力极强，最终用无限手套拯救宇宙。',
    coverImage: '',
    accentColor: '#ef4444',
    stats: { attack: 82, defense: 86, speed: 80, intelligence: 99, stamina: 75, special: 88 },
    overallScore: 4850,
    baseScore: 4400,
    forms: [
      { name: 'Mark III', description: '早期钢铁侠盔甲', overallScore: 2000, stats: { attack: 65, defense: 68, speed: 60, intelligence: 99, stamina: 60, special: 62 } },
      { name: 'Mark L 纳米盔甲', description: '纳米技术盔甲', overallScore: 4850, stats: { attack: 82, defense: 86, speed: 80, intelligence: 99, stamina: 75, special: 88 } },
    ],
    evidence: [{ desc: '独自对抗灭霸坚持数回合', source: '复仇者联盟：无限战争' }],
    rank: 7,
  },
  {
    id: 'eren',
    name: '艾伦·耶格尔',
    alias: ['自由之鸟', 'Eren Yeager'],
    workId: 'aot-s',
    universeId: 'attack-on-titan',
    tags: ['巨人', '始祖', '战槌', '进击'],
    race: '人类/巨人',
    faction: '地鸣',
    description: '继承始祖、进击、战槌三种巨人之力，发动地鸣试图消灭岛外所有生命。',
    coverImage: '',
    accentColor: '#6b7280',
    stats: { attack: 88, defense: 80, speed: 72, intelligence: 86, stamina: 85, special: 92 },
    overallScore: 3520,
    baseScore: 4400,
    forms: [
      { name: '进击的巨人', description: '基础巨人形态', overallScore: 2200, stats: { attack: 72, defense: 65, speed: 60, intelligence: 86, stamina: 75, special: 68 } },
      { name: '始祖巨人（地鸣）', description: '骸骨巨人·终极形态', overallScore: 3520, stats: { attack: 88, defense: 80, speed: 72, intelligence: 86, stamina: 85, special: 92 } },
    ],
    evidence: [{ desc: '驱动万千巨人踏平陆地', source: '进击的巨人 第131话' }],
    rank: 8,
  },
]

export const hotBattles: BattleRecord[] = [
  { id: 'b1', charA: 'goku', charB: 'naruto', votesA: 8432, votesB: 5621, hot: true },
  { id: 'b2', charA: 'luffy', charB: 'naruto', votesA: 6120, votesB: 5980, hot: true },
  { id: 'b3', charA: 'thanos', charB: 'vegeta', votesA: 4210, votesB: 7830, hot: true },
  { id: 'b4', charA: 'sasuke', charB: 'ironman', votesA: 9100, votesB: 2300, hot: false },
]

export function getCharacterById(id: string) { return characters.find(c => c.id === id) }
export function getUniverseById(id: string) { return universes.find(u => u.id === id) }
export function getWorkById(id: string) { return works.find(w => w.id === id) }
export function getCharactersByUniverse(universeId: string) { return characters.filter(c => c.universeId === universeId) }
