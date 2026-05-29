import type { PreBuiltScenario } from '~/data/types'

export interface ValidationIssue {
  level: 'error' | 'warning'
  code: string
  message: string
  messageEn: string
  nodeId?: string
  choiceId?: string
}

export interface ValidationResult {
  ok: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

const ID_RE = /^[a-zA-Z0-9_-]+$/
const FORBIDDEN_IN_CHOICE_ID = '::'

export function useScenarioValidator() {
  function validate(scenario: PreBuiltScenario): ValidationResult {
    const errors: ValidationIssue[] = []
    const warnings: ValidationIssue[] = []

    // ---------- Top level fields ----------
    if (!scenario.id || !scenario.id.startsWith('user-')) {
      errors.push({
        level: 'error',
        code: 'BAD_ID',
        message: '剧本 ID 必须以 user- 开头',
        messageEn: 'Scenario id must start with "user-"',
      })
    }
    if (!scenario.birthInfo) {
      errors.push({
        level: 'error',
        code: 'MISSING_BIRTH',
        message: '缺少出生信息 (birthInfo)',
        messageEn: 'Missing birthInfo',
      })
    }
    else {
      const b = scenario.birthInfo
      if (!b.name?.trim()) errors.push({ level: 'error', code: 'BIRTH_NAME', message: '出生信息缺少中文姓名', messageEn: 'birthInfo.name is required' })
      if (!b.nameEn?.trim()) errors.push({ level: 'error', code: 'BIRTH_NAME_EN', message: '出生信息缺少英文姓名', messageEn: 'birthInfo.nameEn is required' })
      if (typeof b.birthYear !== 'number') errors.push({ level: 'error', code: 'BIRTH_YEAR', message: '出生年份必须是数字', messageEn: 'birthInfo.birthYear must be a number' })
      if (typeof b.health !== 'number' || b.health < 0 || b.health > 100) {
        warnings.push({ level: 'warning', code: 'BIRTH_HEALTH', message: '初始健康值通常在 0-100', messageEn: 'birthInfo.health is usually within 0–100' })
      }
    }

    // ---------- Nodes ----------
    if (!scenario.nodes || Object.keys(scenario.nodes).length === 0) {
      errors.push({
        level: 'error',
        code: 'NO_NODES',
        message: '剧本必须包含至少一个节点',
        messageEn: 'Scenario must contain at least one node',
      })
      return finalize(errors, warnings)
    }

    if (!scenario.startNodeId || !scenario.nodes[scenario.startNodeId]) {
      errors.push({
        level: 'error',
        code: 'BAD_START',
        message: `起始节点 "${scenario.startNodeId}" 不存在`,
        messageEn: `Start node "${scenario.startNodeId}" does not exist`,
      })
    }

    const choiceIdsSeen = new Map<string, Set<string>>() // nodeId -> set
    for (const [nodeId, node] of Object.entries(scenario.nodes)) {
      if (nodeId !== node.id) {
        errors.push({
          level: 'error',
          code: 'NODE_ID_MISMATCH',
          message: `节点 key "${nodeId}" 与 node.id "${node.id}" 不一致`,
          messageEn: `Node key "${nodeId}" does not match node.id "${node.id}"`,
          nodeId,
        })
      }
      if (!ID_RE.test(nodeId)) {
        errors.push({
          level: 'error',
          code: 'BAD_NODE_ID',
          message: `节点 ID "${nodeId}" 含有非法字符（仅允许字母数字、下划线、横线）`,
          messageEn: `Node id "${nodeId}" has invalid characters (alphanumeric, _, - only)`,
          nodeId,
        })
      }
      if (!node.narrative?.trim()) warnings.push({ level: 'warning', code: 'EMPTY_NARRATIVE', message: '节点缺少中文叙述', messageEn: 'Node missing narrative', nodeId })
      if (!node.narrativeEn?.trim()) warnings.push({ level: 'warning', code: 'EMPTY_NARRATIVE_EN', message: '节点缺少英文叙述', messageEn: 'Node missing narrativeEn', nodeId })

      const choiceIds = new Set<string>()
      choiceIdsSeen.set(nodeId, choiceIds)
      for (const choice of node.choices ?? []) {
        if (!choice.id || !ID_RE.test(choice.id)) {
          errors.push({ level: 'error', code: 'BAD_CHOICE_ID', message: `选项 ID "${choice.id}" 含非法字符`, messageEn: `Choice id "${choice.id}" has invalid characters`, nodeId, choiceId: choice.id })
        }
        if (choice.id?.includes(FORBIDDEN_IN_CHOICE_ID)) {
          errors.push({ level: 'error', code: 'CHOICE_ID_RESERVED', message: '选项 ID 不能包含 "::"', messageEn: 'Choice id cannot contain "::"', nodeId, choiceId: choice.id })
        }
        if (choiceIds.has(choice.id)) {
          errors.push({ level: 'error', code: 'DUPLICATE_CHOICE', message: `节点内选项 ID 重复: "${choice.id}"`, messageEn: `Duplicate choice id "${choice.id}" within node`, nodeId, choiceId: choice.id })
        }
        choiceIds.add(choice.id)
        if (!choice.text?.trim()) warnings.push({ level: 'warning', code: 'EMPTY_CHOICE_TEXT', message: '选项缺少中文文本', messageEn: 'Choice missing text', nodeId, choiceId: choice.id })
        if (!choice.textEn?.trim()) warnings.push({ level: 'warning', code: 'EMPTY_CHOICE_TEXT_EN', message: '选项缺少英文文本', messageEn: 'Choice missing textEn', nodeId, choiceId: choice.id })
        if (!scenario.nodes[choice.nextNodeId]) {
          errors.push({
            level: 'error',
            code: 'DANGLING_EDGE',
            message: `选项指向不存在的节点 "${choice.nextNodeId}"`,
            messageEn: `Choice points to missing node "${choice.nextNodeId}"`,
            nodeId,
            choiceId: choice.id,
          })
        }
      }

      const isDeath = node.metadata?.isDeath === true
      if (!isDeath && (node.choices?.length ?? 0) === 0) {
        warnings.push({
          level: 'warning',
          code: 'DEAD_END',
          message: '非死亡节点没有任何选项，将无法继续',
          messageEn: 'Non-death node has no choices — playthrough will stop',
          nodeId,
        })
      }
    }

    // ---------- Reachability ----------
    if (scenario.startNodeId && scenario.nodes[scenario.startNodeId]) {
      const reachable = new Set<string>()
      const stack = [scenario.startNodeId]
      while (stack.length) {
        const id = stack.pop()!
        if (reachable.has(id)) continue
        reachable.add(id)
        for (const c of scenario.nodes[id]?.choices ?? []) {
          if (scenario.nodes[c.nextNodeId]) stack.push(c.nextNodeId)
        }
      }
      for (const nodeId of Object.keys(scenario.nodes)) {
        if (!reachable.has(nodeId)) {
          warnings.push({
            level: 'warning',
            code: 'UNREACHABLE',
            message: `节点 "${nodeId}" 从起始节点不可达`,
            messageEn: `Node "${nodeId}" is unreachable from the start`,
            nodeId,
          })
        }
      }
    }

    return finalize(errors, warnings)
  }

  return { validate }
}

function finalize(errors: ValidationIssue[], warnings: ValidationIssue[]): ValidationResult {
  return { ok: errors.length === 0, errors, warnings }
}
