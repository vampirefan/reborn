import { egyptScribe } from './egypt-scribe'
import { athensCitizen } from './athens-citizen'
import { qinPeasant } from './qin-peasant'
import { pompeiiMerchant } from './pompeii-merchant'
import { tangPoet } from './tang-poet'
import { vikingTrader } from './viking-trader'
import { aztecNoble } from './aztec-noble'
import { edoRonin } from './edo-ronin'
import { revolutionParis } from './revolution-paris'
import { wwiiCivilian } from './wwii-civilian'
import type { PreBuiltScenario } from '../types'

/**
 * Frozen list of built-in scenarios shipped with the game.
 * These are read-only at runtime — to edit, duplicate via the admin page.
 *
 * Random selection and lookup logic lives in `useScenarioRepository()`,
 * which merges these with user-created scenarios from localStorage.
 */
export const BUILT_IN_SCENARIOS: readonly PreBuiltScenario[] = Object.freeze([
  egyptScribe,
  athensCitizen,
  qinPeasant,
  pompeiiMerchant,
  tangPoet,
  vikingTrader,
  aztecNoble,
  edoRonin,
  revolutionParis,
  wwiiCivilian,
])

export const BUILT_IN_SCENARIO_IDS: ReadonlySet<string> = new Set(
  BUILT_IN_SCENARIOS.map(s => s.id),
)
