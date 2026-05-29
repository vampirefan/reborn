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

export const ALL_SCENARIOS: PreBuiltScenario[] = [
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
]

let usedScenarioIds: string[] = []

export function getRandomScenario(): PreBuiltScenario {
  // Avoid repeating scenarios until all have been played
  const available = ALL_SCENARIOS.filter(s => !usedScenarioIds.includes(s.id))
  const pool = available.length > 0 ? available : ALL_SCENARIOS

  if (available.length === 0) {
    usedScenarioIds = []
  }

  const scenario = pool[Math.floor(Math.random() * pool.length)]
  usedScenarioIds.push(scenario.id)
  return scenario
}

export function getScenarioById(id: string): PreBuiltScenario | undefined {
  return ALL_SCENARIOS.find(s => s.id === id)
}
