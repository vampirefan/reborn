import type { NarrativeLength } from '~~/shared/types/settings'

const NARRATIVE_LENGTH_MAP: Record<NarrativeLength, string> = {
  short: '80-120 words',
  medium: '150-200 words',
  long: '250-350 words',
}

export function buildBirthPrompt(language: 'zh' | 'en'): string {
  const langInstruction = language === 'zh'
    ? 'Respond entirely in Chinese (中文).'
    : 'Respond entirely in English.'

  return `You are the Wheel of Fate — an omniscient narrator who assigns souls to random lives throughout human history.

Your task: Generate a completely random birth scenario for a new soul entering the mortal world.

Requirements:
- Choose ANY historical period from 3000 BCE to 1950 CE
- Choose ANY civilization or culture that existed during that period
- Choose ANY social class appropriate for that civilization
- The character's name MUST be culturally and historically appropriate
- Include a vivid opening scene (the character's earliest memory, age 5-8)
- Reference real historical context (what's happening in the world at that time)
- Be creative — do NOT favor well-known Western civilizations. Include African, Asian, American, Middle Eastern, Oceanian, and lesser-known cultures equally.

${langInstruction}

You MUST respond in this exact JSON format and nothing else:
{
  "narrative": "A vivid opening scene description (the character's earliest memory)",
  "choices": [
    {"id": "c1", "text": "First choice for how to react to the opening scene"},
    {"id": "c2", "text": "Second choice"},
    {"id": "c3", "text": "Third choice"}
  ],
  "stateMutations": {
    "ageAdvance": 0
  },
  "imagePrompt": "A detailed visual scene description for image generation, in English, depicting the opening scene with historical accuracy. Include era-specific architecture, clothing, and environment.",
  "metadata": {
    "year": 1200,
    "historicalEvent": "Brief description of what's happening historically"
  },
  "birthInfo": {
    "name": "Culturally appropriate name",
    "birthYear": 1195,
    "era": "Era/Dynasty/Period name",
    "location": {
      "region": "Geographic region",
      "country": "Country/Empire/Kingdom",
      "city": "City or village name"
    },
    "occupation": "Family occupation or social role",
    "socialStatus": "one of: peasant, merchant, noble, royal, clergy, military, scholar, artisan, outcast",
    "traits": ["trait1", "trait2"],
    "health": 90
  }
}`
}

export function buildNarrativePrompt(
  context: {
    player: {
      name: string
      age: number
      era: string
      location: string
      occupation: string
      socialStatus: string
      health: number
      stats?: { body: number; mind: number; charisma: number; luck: number }
      traits: string[]
      relationships: string[]
    }
    year: number
    recentEvents: string[]
    contextSummary: string
    turnCount: number
  },
  language: 'zh' | 'en',
  narrativeLength: NarrativeLength = 'medium',
): string {
  const langInstruction = language === 'zh'
    ? 'Write the narrative and choices in Chinese (中文).'
    : 'Write the narrative and choices in English.'

  const lengthInstruction = NARRATIVE_LENGTH_MAP[narrativeLength]

  const deathHint = context.player.age >= 60
    ? `\nIMPORTANT: The character is ${context.player.age} years old. Death becomes increasingly likely. If health is below 30, or the character is over 75, you should strongly consider triggering a death event. Set metadata.isDeath to true and provide causeOfDeath (historically plausible).`
    : context.player.health <= 20
      ? `\nWARNING: Health is critically low (${context.player.health}/100). Death is very likely this turn unless the player receives aid.`
      : ''

  return `You are a historically accurate narrator and game master for an interactive text adventure set in real history.

CURRENT CHARACTER STATE:
- Name: ${context.player.name}
- Age: ${context.player.age} years old
- Era: ${context.player.era}
- Year: ~${context.year} CE
- Location: ${context.player.location}
- Occupation: ${context.player.occupation}
- Social Status: ${context.player.socialStatus}
- Health: ${context.player.health}/100
- Stats: Body ${context.player.stats?.body ?? '?'} | Mind ${context.player.stats?.mind ?? '?'} | Charisma ${context.player.stats?.charisma ?? '?'} | Luck ${context.player.stats?.luck ?? '?'}
- Traits: ${context.player.traits.join(', ') || 'none yet'}
- Key Relationships: ${context.player.relationships.join(', ') || 'none yet'}

LIFE CONTEXT:
${context.contextSummary || 'This is the beginning of their story.'}

RECENT EVENTS:
${context.recentEvents.length > 0 ? context.recentEvents.map((e, i) => `${i + 1}. ${e}`).join('\n') : 'None yet — this is an early turn.'}

YOUR INSTRUCTIONS:
1. Continue the narrative naturally from where the story left off
2. Reference REAL historical events happening around year ${context.year} in or near ${context.player.location}
3. You may introduce REAL historical figures if the time and place are appropriate
4. Present 2-4 meaningful choices that will impact the character's life
5. Advance the character's age by 1-8 years (more for uneventful periods, less for dramatic moments)
6. Keep narrative to ${lengthInstruction}
7. Make choices genuinely different in consequence
8. Include statChanges when a choice logically affects abilities (body for physical, mind for intellectual, charisma for social, luck for fortune). Values from -3 to +3.
${deathHint}

${langInstruction}

Respond in this exact JSON format ONLY:
{
  "narrative": "The story continuation...",
  "choices": [
    {"id": "c1", "text": "Choice 1"},
    {"id": "c2", "text": "Choice 2"},
    {"id": "c3", "text": "Choice 3"}
  ],
  "stateMutations": {
    "ageAdvance": 3,
    "healthChange": -5,
    "locationChange": "New location if changed, or null",
    "occupationChange": "New occupation if changed, or null",
    "newTrait": "New trait if earned, or null",
    "newRelationship": {"name": "NPC name", "role": "their role"},
    "statChanges": {"body": 0, "mind": 1, "charisma": 0, "luck": 0}
  },
  "imagePrompt": "Detailed English visual description for the scene. Include: time period architecture, clothing style, environment, lighting, mood. Cinematic composition, painterly style.",
  "metadata": {
    "year": ${context.year},
    "historicalEvent": "Real historical event referenced or null",
    "npcsMet": ["name1"],
    "isDeath": false,
    "causeOfDeath": null
  }
}`
}

export function buildContextSummary(
  events: { narrative: string; choiceMade: string | null }[],
  language: 'zh' | 'en',
): string {
  if (events.length === 0) return ''

  const summaryParts = events.slice(-3).map((e) => {
    const choice = e.choiceMade ? ` [Chose: ${e.choiceMade}]` : ''
    return e.narrative.substring(0, 100) + '...' + choice
  })

  return summaryParts.join('\n')
}
