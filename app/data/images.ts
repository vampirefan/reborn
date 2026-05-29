/**
 * Image registry - maps image tags to pre-built image paths.
 * When no image generation API key is available, these images are used.
 */

export interface ImageEntry {
  path: string
  alt: string
  altEn: string
}

const SCENE_BASE = '/images/scenes/'

export const IMAGE_REGISTRY: Record<string, ImageEntry> = {
  // Egypt scenes
  'egypt-nile': { path: `${SCENE_BASE}egypt-nile.webp`, alt: '尼罗河畔的古埃及', altEn: 'Ancient Egypt by the Nile' },
  'egypt-temple': { path: `${SCENE_BASE}egypt-temple.webp`, alt: '古埃及神殿', altEn: 'Ancient Egyptian temple' },
  'egypt-scribe-room': { path: `${SCENE_BASE}egypt-scribe-room.webp`, alt: '书吏的房间', altEn: 'Scribe\'s room' },
  'egypt-war': { path: `${SCENE_BASE}egypt-war.webp`, alt: '古埃及战争', altEn: 'Ancient Egyptian warfare' },
  'egypt-pyramid': { path: `${SCENE_BASE}egypt-pyramid.webp`, alt: '金字塔建设', altEn: 'Pyramid construction' },

  // Athens scenes
  'athens-agora': { path: `${SCENE_BASE}athens-agora.webp`, alt: '雅典广场', altEn: 'Athenian Agora' },
  'athens-acropolis': { path: `${SCENE_BASE}athens-acropolis.webp`, alt: '雅典卫城', altEn: 'The Acropolis' },
  'athens-theater': { path: `${SCENE_BASE}athens-theater.webp`, alt: '古希腊剧场', altEn: 'Greek theater' },
  'athens-war': { path: `${SCENE_BASE}athens-war.webp`, alt: '伯罗奔尼撒战争', altEn: 'Peloponnesian War' },

  // Qin scenes
  'qin-village': { path: `${SCENE_BASE}qin-village.webp`, alt: '秦朝村庄', altEn: 'Qin Dynasty village' },
  'qin-wall': { path: `${SCENE_BASE}qin-wall.webp`, alt: '长城修建', altEn: 'Great Wall construction' },
  'qin-army': { path: `${SCENE_BASE}qin-army.webp`, alt: '秦军方阵', altEn: 'Qin army formation' },
  'qin-palace': { path: `${SCENE_BASE}qin-palace.webp`, alt: '秦宫殿', altEn: 'Qin palace' },

  // Pompeii scenes
  'pompeii-market': { path: `${SCENE_BASE}pompeii-market.webp`, alt: '庞贝市场', altEn: 'Pompeii market' },
  'pompeii-eruption': { path: `${SCENE_BASE}pompeii-eruption.webp`, alt: '维苏威火山爆发', altEn: 'Vesuvius eruption' },
  'pompeii-villa': { path: `${SCENE_BASE}pompeii-villa.webp`, alt: '罗马别墅', altEn: 'Roman villa' },

  // Tang scenes
  'tang-changan': { path: `${SCENE_BASE}tang-changan.webp`, alt: '唐朝长安城', altEn: 'Tang Dynasty Chang\'an' },
  'tang-examination': { path: `${SCENE_BASE}tang-examination.webp`, alt: '科举考场', altEn: 'Imperial examination hall' },
  'tang-poetry-gathering': { path: `${SCENE_BASE}tang-poetry-gathering.webp`, alt: '诗会', altEn: 'Poetry gathering' },
  'tang-anlushan-rebellion': { path: `${SCENE_BASE}tang-anlushan-rebellion.webp`, alt: '安史之乱', altEn: 'An Lushan Rebellion' },
  'tang-mountain-monastery': { path: `${SCENE_BASE}tang-mountain-monastery.webp`, alt: '终南山道观', altEn: 'Mountain monastery' },
  'tang-river-journey': { path: `${SCENE_BASE}tang-river-journey.webp`, alt: '江上行舟', altEn: 'River journey' },
  'tang-shu-cottage': { path: `${SCENE_BASE}tang-shu-cottage.webp`, alt: '蜀中草堂', altEn: 'Thatched cottage in Shu' },
  'tang-moonlit-study': { path: `${SCENE_BASE}tang-moonlit-study.webp`, alt: '月下书房', altEn: 'Moonlit study' },
  'tang-writing-study': { path: `${SCENE_BASE}tang-writing-study.webp`, alt: '书房著书', altEn: 'Writing study' },
  'tang-peaceful-courtyard': { path: `${SCENE_BASE}tang-peaceful-courtyard.webp`, alt: '宁静庭院', altEn: 'Peaceful courtyard' },
  'tang-war-refugees': { path: `${SCENE_BASE}tang-war-refugees.webp`, alt: '战乱难民', altEn: 'War refugees' },
  'tang-pagoda-autumn': { path: `${SCENE_BASE}tang-pagoda-autumn.webp`, alt: '秋日大雁塔', altEn: 'Pagoda in autumn' },

  // Viking scenes
  'viking-fjord-village': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '峡湾村落', altEn: 'Fjord village' },
  'viking-longship-sea': { path: `${SCENE_BASE}viking-longship-sea.webp`, alt: '海上龙船', altEn: 'Longship at sea' },
  'viking-trade-route': { path: `${SCENE_BASE}viking-trade-route.webp`, alt: '贸易路线', altEn: 'Trade route' },
  'viking-raid-monastery': { path: `${SCENE_BASE}viking-raid-monastery.webp`, alt: '袭击修道院', altEn: 'Monastery raid' },
  'viking-constantinople': { path: `${SCENE_BASE}viking-constantinople.webp`, alt: '君士坦丁堡', altEn: 'Constantinople' },
  'viking-siege-paris': { path: `${SCENE_BASE}viking-siege-paris.webp`, alt: '围攻巴黎', altEn: 'Siege of Paris' },
  'viking-ship-burial': { path: `${SCENE_BASE}viking-ship-burial.webp`, alt: '维京船葬', altEn: 'Viking ship burial' },
  'viking-great-hall': { path: `${SCENE_BASE}viking-great-hall.webp`, alt: '维京大厅', altEn: 'Viking great hall' },
  'viking-iceland-landing': { path: `${SCENE_BASE}viking-iceland-landing.webp`, alt: '冰岛登陆', altEn: 'Iceland landing' },

  // Aztec scenes
  'aztec-tenochtitlan': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '特诺奇提特兰', altEn: 'Tenochtitlan' },
  'aztec-eagle-warrior': { path: `${SCENE_BASE}aztec-eagle-warrior.webp`, alt: '鹰战士', altEn: 'Eagle warrior' },
  'aztec-temple-priest': { path: `${SCENE_BASE}aztec-temple-priest.webp`, alt: '神殿祭司', altEn: 'Temple priest' },
  'aztec-noche-triste': { path: `${SCENE_BASE}aztec-noche-triste.webp`, alt: '悲伤之夜', altEn: 'La Noche Triste' },
  'aztec-final-siege': { path: `${SCENE_BASE}aztec-final-siege.webp`, alt: '最终围城', altEn: 'Final siege' },
  'aztec-hidden-valley': { path: `${SCENE_BASE}aztec-hidden-valley.webp`, alt: '隐秘山谷', altEn: 'Hidden valley' },
  'aztec-temple-fall': { path: `${SCENE_BASE}aztec-temple-fall.webp`, alt: '神殿陷落', altEn: 'Temple fall' },

  // Edo scenes
  'edo-samurai-tenement': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '武士长屋', altEn: 'Samurai tenement' },
  'edo-sword-duel': { path: `${SCENE_BASE}edo-sword-duel.webp`, alt: '剑术比试', altEn: 'Sword duel' },
  'edo-night-rescue': { path: `${SCENE_BASE}edo-night-rescue.webp`, alt: '夜间救人', altEn: 'Night rescue' },
  'edo-dojo': { path: `${SCENE_BASE}edo-dojo.webp`, alt: '道场', altEn: 'Dojo' },
  'edo-cherry-blossom-river': { path: `${SCENE_BASE}edo-cherry-blossom-river.webp`, alt: '樱花河畔', altEn: 'Cherry blossoms by the river' },
  'edo-tea-room': { path: `${SCENE_BASE}edo-tea-room.webp`, alt: '茶室', altEn: 'Tea room' },
  'edo-mountain-village': { path: `${SCENE_BASE}edo-mountain-village.webp`, alt: '山间村落', altEn: 'Mountain village' },
  'edo-tokaido-road': { path: `${SCENE_BASE}edo-tokaido-road.webp`, alt: '东海道', altEn: 'Tokaido road' },

  // Revolution scenes
  'revolution-paris-streets': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '巴黎街头', altEn: 'Paris streets' },
  'revolution-bastille': { path: `${SCENE_BASE}revolution-bastille.webp`, alt: '攻占巴士底狱', altEn: 'Storming the Bastille' },
  'revolution-jacobin-club': { path: `${SCENE_BASE}revolution-jacobin-club.webp`, alt: '雅各宾俱乐部', altEn: 'Jacobin Club' },
  'revolution-guillotine': { path: `${SCENE_BASE}revolution-guillotine.webp`, alt: '断头台', altEn: 'The guillotine' },
  'revolution-napoleon-coronation': { path: `${SCENE_BASE}revolution-napoleon-coronation.webp`, alt: '拿破仑加冕', altEn: 'Napoleon\'s coronation' },
  'revolution-bakery-peace': { path: `${SCENE_BASE}revolution-bakery-peace.webp`, alt: '和平的面包房', altEn: 'Peaceful bakery' },

  // WWII scenes
  'wwii-warsaw-bombing': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '华沙轰炸', altEn: 'Warsaw bombing' },
  'wwii-resistance-meeting': { path: `${SCENE_BASE}wwii-resistance-meeting.webp`, alt: '抵抗组织会议', altEn: 'Resistance meeting' },
  'wwii-ghetto-wall': { path: `${SCENE_BASE}wwii-ghetto-wall.webp`, alt: '隔都围墙', altEn: 'Ghetto wall' },
  'wwii-warsaw-uprising': { path: `${SCENE_BASE}wwii-warsaw-uprising.webp`, alt: '华沙起义', altEn: 'Warsaw Uprising' },
  'wwii-liberation': { path: `${SCENE_BASE}wwii-liberation.webp`, alt: '解放', altEn: 'Liberation' },
  'wwii-rebuild-warsaw': { path: `${SCENE_BASE}wwii-rebuild-warsaw.webp`, alt: '重建华沙', altEn: 'Rebuilding Warsaw' },
  'wwii-sewer-escape': { path: `${SCENE_BASE}wwii-sewer-escape.webp`, alt: '下水道逃生', altEn: 'Sewer escape' },
  'wwii-underground-press': { path: `${SCENE_BASE}wwii-underground-press.webp`, alt: '地下出版', altEn: 'Underground press' },

  // Generic fallback
  'default': { path: `${SCENE_BASE}default-scene.webp`, alt: '历史场景', altEn: 'Historical scene' },
}

/**
 * Get image entry by tag. Falls back to a similar tag or default.
 */
export function getImageByTag(tag: string): ImageEntry {
  if (IMAGE_REGISTRY[tag]) {
    return IMAGE_REGISTRY[tag]
  }

  // Try partial matching (prefix match)
  const prefix = tag.split('-')[0]
  const fallback = Object.keys(IMAGE_REGISTRY).find(k => k.startsWith(prefix) && k !== 'default')
  if (fallback) {
    return IMAGE_REGISTRY[fallback]
  }

  return IMAGE_REGISTRY['default']
}

/**
 * Get all image tags for a given era prefix
 */
export function getImageTagsByEra(era: string): string[] {
  return Object.keys(IMAGE_REGISTRY).filter(k => k.startsWith(era))
}
