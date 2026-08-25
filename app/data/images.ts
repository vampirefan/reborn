/**
 * Image registry - maps image tags to pre-built image paths.
 * When no image generation API key is available, these images are used.
 *
 * NOTE: Only 11 base scene images currently ship with the game.
 * Every tag maps to its series base image so no request 404s.
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
  'egypt-temple': { path: `${SCENE_BASE}egypt-nile.webp`, alt: '古埃及神殿', altEn: 'Ancient Egyptian temple' },
  'egypt-scribe-room': { path: `${SCENE_BASE}egypt-nile.webp`, alt: '书吏的房间', altEn: 'Scribe\'s room' },
  'egypt-war': { path: `${SCENE_BASE}egypt-nile.webp`, alt: '古埃及战争', altEn: 'Ancient Egyptian warfare' },
  'egypt-pyramid': { path: `${SCENE_BASE}egypt-nile.webp`, alt: '金字塔建设', altEn: 'Pyramid construction' },
  'egypt-palace': { path: `${SCENE_BASE}egypt-nile.webp`, alt: '古埃及宫殿', altEn: 'Egyptian palace' },

  // Athens scenes
  'athens-agora': { path: `${SCENE_BASE}athens-agora.webp`, alt: '雅典广场', altEn: 'Athenian Agora' },
  'athens-acropolis': { path: `${SCENE_BASE}athens-agora.webp`, alt: '雅典卫城', altEn: 'The Acropolis' },
  'athens-theater': { path: `${SCENE_BASE}athens-agora.webp`, alt: '古希腊剧场', altEn: 'Greek theater' },
  'athens-war': { path: `${SCENE_BASE}athens-agora.webp`, alt: '伯罗奔尼撒战争', altEn: 'Peloponnesian War' },

  // Qin scenes
  'qin-village': { path: `${SCENE_BASE}qin-village.webp`, alt: '秦朝村庄', altEn: 'Qin Dynasty village' },
  'qin-wall': { path: `${SCENE_BASE}qin-village.webp`, alt: '长城修建', altEn: 'Great Wall construction' },
  'qin-army': { path: `${SCENE_BASE}qin-village.webp`, alt: '秦军方阵', altEn: 'Qin army formation' },
  'qin-palace': { path: `${SCENE_BASE}qin-village.webp`, alt: '秦宫殿', altEn: 'Qin palace' },

  // Pompeii scenes
  'pompeii-market': { path: `${SCENE_BASE}pompeii-market.webp`, alt: '庞贝市场', altEn: 'Pompeii market' },
  'pompeii-eruption': { path: `${SCENE_BASE}pompeii-market.webp`, alt: '维苏威火山爆发', altEn: 'Vesuvius eruption' },
  'pompeii-villa': { path: `${SCENE_BASE}pompeii-market.webp`, alt: '罗马别墅', altEn: 'Roman villa' },

  // Tang scenes
  'tang-changan': { path: `${SCENE_BASE}tang-changan.webp`, alt: '唐朝长安城', altEn: 'Tang Dynasty Chang\'an' },
  'tang-examination': { path: `${SCENE_BASE}tang-changan.webp`, alt: '科举考场', altEn: 'Imperial examination hall' },
  'tang-poetry-gathering': { path: `${SCENE_BASE}tang-changan.webp`, alt: '诗会', altEn: 'Poetry gathering' },
  'tang-anlushan-rebellion': { path: `${SCENE_BASE}tang-changan.webp`, alt: '安史之乱', altEn: 'An Lushan Rebellion' },
  'tang-mountain-monastery': { path: `${SCENE_BASE}tang-changan.webp`, alt: '终南山道观', altEn: 'Mountain monastery' },
  'tang-river-journey': { path: `${SCENE_BASE}tang-changan.webp`, alt: '江上行舟', altEn: 'River journey' },
  'tang-shu-cottage': { path: `${SCENE_BASE}tang-changan.webp`, alt: '蜀中草堂', altEn: 'Thatched cottage in Shu' },
  'tang-moonlit-study': { path: `${SCENE_BASE}tang-changan.webp`, alt: '月下书房', altEn: 'Moonlit study' },
  'tang-writing-study': { path: `${SCENE_BASE}tang-changan.webp`, alt: '书房著书', altEn: 'Writing study' },
  'tang-peaceful-courtyard': { path: `${SCENE_BASE}tang-changan.webp`, alt: '宁静庭院', altEn: 'Peaceful courtyard' },
  'tang-war-refugees': { path: `${SCENE_BASE}tang-changan.webp`, alt: '战乱难民', altEn: 'War refugees' },
  'tang-pagoda-autumn': { path: `${SCENE_BASE}tang-changan.webp`, alt: '秋日大雁塔', altEn: 'Pagoda in autumn' },
  'tang-lingnan-exile': { path: `${SCENE_BASE}tang-changan.webp`, alt: '岭南流放', altEn: 'Lingnan exile' },
  'tang-hermit-retreat': { path: `${SCENE_BASE}tang-changan.webp`, alt: '隐士居所', altEn: 'Hermit retreat' },
  'tang-rebellion-news': { path: `${SCENE_BASE}tang-changan.webp`, alt: '叛乱消息', altEn: 'Rebellion news' },
  'tang-painting-studio': { path: `${SCENE_BASE}tang-changan.webp`, alt: '画室', altEn: 'Painting studio' },
  'tang-liberation-changan': { path: `${SCENE_BASE}tang-changan.webp`, alt: '光复长安', altEn: 'Liberation of Chang\'an' },
  'tang-occupied-changan': { path: `${SCENE_BASE}tang-changan.webp`, alt: '沦陷长安', altEn: 'Occupied Chang\'an' },
  'tang-mountain-hermit': { path: `${SCENE_BASE}tang-changan.webp`, alt: '山中隐士', altEn: 'Mountain hermit' },
  'tang-prison': { path: `${SCENE_BASE}tang-changan.webp`, alt: '牢狱', altEn: 'Prison' },

  // Viking scenes
  'viking-fjord-village': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '峡湾村落', altEn: 'Fjord village' },
  'viking-longship-sea': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '海上龙船', altEn: 'Longship at sea' },
  'viking-trade-route': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '贸易路线', altEn: 'Trade route' },
  'viking-raid-monastery': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '袭击修道院', altEn: 'Monastery raid' },
  'viking-constantinople': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '君士坦丁堡', altEn: 'Constantinople' },
  'viking-siege-paris': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '围攻巴黎', altEn: 'Siege of Paris' },
  'viking-ship-burial': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '维京船葬', altEn: 'Viking ship burial' },
  'viking-great-hall': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '维京大厅', altEn: 'Viking great hall' },
  'viking-iceland-landing': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '冰岛登陆', altEn: 'Iceland landing' },
  'viking-smithy': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '铁匠铺', altEn: 'Viking smithy' },
  'viking-tactical-approach': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '战术接近', altEn: 'Tactical approach' },
  'viking-manuscripts': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '手稿', altEn: 'Manuscripts' },
  'viking-varangian-guard': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '瓦兰吉卫队', altEn: 'Varangian Guard' },
  'viking-volga-trade': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '伏尔加贸易', altEn: 'Volga trade' },
  'viking-ireland-coast': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '爱尔兰海岸', altEn: 'Ireland coast' },
  'viking-ship-repair': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '修船', altEn: 'Ship repair' },
  'viking-master-forge': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '大师锻造', altEn: 'Master forge' },
  'viking-fleet-horizon': { path: `${SCENE_BASE}viking-fjord-village.webp`, alt: '舰队地平线', altEn: 'Fleet on the horizon' },

  // Aztec scenes
  'aztec-tenochtitlan': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '特诺奇提特兰', altEn: 'Tenochtitlan' },
  'aztec-eagle-warrior': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '鹰战士', altEn: 'Eagle warrior' },
  'aztec-temple-priest': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '神殿祭司', altEn: 'Temple priest' },
  'aztec-noche-triste': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '悲伤之夜', altEn: 'La Noche Triste' },
  'aztec-final-siege': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '最终围城', altEn: 'Final siege' },
  'aztec-hidden-valley': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '隐秘山谷', altEn: 'Hidden valley' },
  'aztec-temple-fall': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '神殿陷落', altEn: 'Temple fall' },
  'aztec-merchant-journey': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '商人旅途', altEn: 'Merchant journey' },
  'aztec-meeting-spanish': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '会见西班牙人', altEn: 'Meeting the Spanish' },
  'aztec-hidden-codex': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '隐藏的手抄本', altEn: 'Hidden codex' },
  'aztec-first-contact': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '初次接触', altEn: 'First contact' },
  'aztec-alliance-failure': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '联盟失败', altEn: 'Alliance failure' },
  'aztec-uprising': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '起义', altEn: 'Uprising' },
  'aztec-translator': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '翻译', altEn: 'Translator' },
  'aztec-failed-diplomacy': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '外交失败', altEn: 'Failed diplomacy' },
  'aztec-jungle-guerrilla': { path: `${SCENE_BASE}aztec-tenochtitlan.webp`, alt: '丛林游击', altEn: 'Jungle guerrilla' },

  // Edo scenes
  'edo-samurai-tenement': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '武士长屋', altEn: 'Samurai tenement' },
  'edo-sword-duel': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '剑术比试', altEn: 'Sword duel' },
  'edo-night-rescue': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '夜间救人', altEn: 'Night rescue' },
  'edo-dojo': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '道场', altEn: 'Dojo' },
  'edo-cherry-blossom-river': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '樱花河畔', altEn: 'Cherry blossoms by the river' },
  'edo-tea-room': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '茶室', altEn: 'Tea room' },
  'edo-mountain-village': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '山间村落', altEn: 'Mountain village' },
  'edo-tokaido-road': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '东海道', altEn: 'Tokaido road' },
  'edo-study-room': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '书房', altEn: 'Study room' },
  'edo-merchant-district': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '商人区', altEn: 'Merchant district' },
  'edo-shogun-audience': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '将军谒见', altEn: 'Shogun audience' },
  'edo-rangaku-study': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '兰学书房', altEn: 'Rangaku study' },
  'edo-private-school': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '私塾', altEn: 'Private school' },
  'edo-rice-market': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '米市', altEn: 'Rice market' },
  'edo-night-confrontation': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '夜间对峙', altEn: 'Night confrontation' },
  'edo-reform-office': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '改革奉行所', altEn: 'Reform office' },
  'edo-charity-work': { path: `${SCENE_BASE}edo-samurai-tenement.webp`, alt: '慈善事业', altEn: 'Charity work' },

  // Revolution scenes
  'revolution-paris-streets': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '巴黎街头', altEn: 'Paris streets' },
  'revolution-bastille': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '攻占巴士底狱', altEn: 'Storming the Bastille' },
  'revolution-jacobin-club': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '雅各宾俱乐部', altEn: 'Jacobin Club' },
  'revolution-guillotine': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '断头台', altEn: 'The guillotine' },
  'revolution-napoleon-coronation': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '拿破仑加冕', altEn: 'Napoleon\'s coronation' },
  'revolution-bakery-peace': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '和平的面包房', altEn: 'Peaceful bakery' },
  'revolution-bread-shortage': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '面包短缺', altEn: 'Bread shortage' },
  'revolution-national-guard': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '国民自卫军', altEn: 'National Guard' },
  'revolution-newspaper': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '革命报纸', altEn: 'Revolution newspaper' },
  'revolution-bakery': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '面包房', altEn: 'Bakery' },
  'revolution-tribunal': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '革命法庭', altEn: 'Revolutionary Tribunal' },
  'revolution-moderate-danger': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '温和派的危险', altEn: 'Moderate danger' },
  'revolution-sans-culottes': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '无套裤汉', altEn: 'Sans-culottes' },
  'revolution-terror': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '恐怖统治', altEn: 'The Terror' },
  'revolution-thermidor': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '热月政变', altEn: 'Thermidorian Reaction' },
  'revolution-thermidor-plot': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '热月阴谋', altEn: 'Thermidorian plot' },
  'revolution-underground': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '地下救援', altEn: 'Underground rescue' },
  'revolution-aftermath': { path: `${SCENE_BASE}revolution-paris-streets.webp`, alt: '革命余波', altEn: 'Revolution aftermath' },
  'revolution-exile-london': { path: `${SCENE_BASE}default-scene.webp`, alt: '伦敦流亡', altEn: 'Exile in London' },
  'revolution-exile-remorse': { path: `${SCENE_BASE}default-scene.webp`, alt: '流亡悔恨', altEn: 'Exile remorse' },

  // WWII scenes
  'wwii-warsaw-bombing': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '华沙轰炸', altEn: 'Warsaw bombing' },
  'wwii-resistance-meeting': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '抵抗组织会议', altEn: 'Resistance meeting' },
  'wwii-ghetto-wall': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '隔都围墙', altEn: 'Ghetto wall' },
  'wwii-warsaw-uprising': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '华沙起义', altEn: 'Warsaw Uprising' },
  'wwii-liberation': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '解放', altEn: 'Liberation' },
  'wwii-rebuild-warsaw': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '重建华沙', altEn: 'Rebuilding Warsaw' },
  'wwii-sewer-escape': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '下水道逃生', altEn: 'Sewer escape' },
  'wwii-underground-press': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '地下出版', altEn: 'Underground press' },
  'wwii-underground-class': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '地下大学', altEn: 'Underground class' },
  'wwii-radio-operator': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '无线电操作员', altEn: 'Radio operator' },
  'wwii-ghetto-rescue': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '隔都救援', altEn: 'Ghetto rescue' },
  'wwii-hidden-families': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '藏匿家庭', altEn: 'Hidden families' },
  'wwii-pow-camp': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '战俘营', altEn: 'POW camp' },
  'wwii-soviet-liberation': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '苏联解放', altEn: 'Soviet liberation' },
  'wwii-arrest': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '逮捕', altEn: 'Arrest' },
  'wwii-exile-new-york': { path: `${SCENE_BASE}default-scene.webp`, alt: '流亡纽约', altEn: 'Exile in New York' },
  'wwii-writer-memoir': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '作家回忆录', altEn: 'Writer memoir' },
  'wwii-ship-hope': { path: `${SCENE_BASE}wwii-warsaw-bombing.webp`, alt: '希望之船', altEn: 'Ship of hope' },

  // Generic fallback
  'generic-night': { path: `${SCENE_BASE}default-scene.webp`, alt: '夜晚', altEn: 'Night' },
  'generic-dawn': { path: `${SCENE_BASE}default-scene.webp`, alt: '黎明', altEn: 'Dawn' },
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
