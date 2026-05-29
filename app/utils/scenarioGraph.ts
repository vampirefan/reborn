import type { PreBuiltScenario, ScenarioNode, ScenarioChoice } from '~/data/types'
import type { NodePosition } from '~/stores/userScenariosStore'

/**
 * Vue Flow uses string ids for nodes and edges. We adopt the convention:
 *   - graph node id = scenario node id
 *   - graph edge id = `${sourceNodeId}::${choiceId}`
 *
 * The "::" separator is forbidden inside choice ids by the validator,
 * which guarantees a lossless round-trip.
 */

export interface GraphNode {
  id: string
  position: NodePosition
  data: ScenarioNode & { isStart: boolean }
  type?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  data: {
    choiceId: string
    text: string
    textEn: string
  }
}

export interface ScenarioGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const EDGE_SEP = '::'

export function makeEdgeId(sourceNodeId: string, choiceId: string): string {
  return `${sourceNodeId}${EDGE_SEP}${choiceId}`
}

export function parseEdgeId(edgeId: string): { sourceNodeId: string, choiceId: string } | null {
  const idx = edgeId.indexOf(EDGE_SEP)
  if (idx < 0) return null
  return {
    sourceNodeId: edgeId.slice(0, idx),
    choiceId: edgeId.slice(idx + EDGE_SEP.length),
  }
}

/**
 * Convert a PreBuiltScenario into Vue Flow-compatible nodes/edges.
 * Missing positions fall back to a simple grid layout.
 */
export function scenarioToGraph(
  scenario: PreBuiltScenario,
  positions: Record<string, NodePosition> = {},
): ScenarioGraph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const fallback = autoLayout(scenario)

  for (const nodeId of Object.keys(scenario.nodes)) {
    const node = scenario.nodes[nodeId]!
    const pos = positions[nodeId] ?? fallback[nodeId] ?? { x: 0, y: 0 }
    nodes.push({
      id: nodeId,
      position: pos,
      data: { ...node, isStart: nodeId === scenario.startNodeId },
      type: 'scenarioNode',
    })

    for (const choice of node.choices) {
      // Skip edges to non-existent nodes so Vue Flow doesn't warn
      if (!scenario.nodes[choice.nextNodeId]) continue
      edges.push({
        id: makeEdgeId(nodeId, choice.id),
        source: nodeId,
        target: choice.nextNodeId,
        label: choice.text,
        data: {
          choiceId: choice.id,
          text: choice.text,
          textEn: choice.textEn,
        },
      })
    }
  }

  return { nodes, edges }
}

/**
 * Convert Vue Flow nodes/edges back into a scenario shape.
 * The caller is responsible for preserving the start node id, birth info,
 * and any node fields not represented in the graph (we only read positions
 * and edge → choice associations here).
 */
export function graphToScenario(
  base: PreBuiltScenario,
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
): { scenario: PreBuiltScenario, positions: Record<string, NodePosition> } {
  const newNodes: Record<string, ScenarioNode> = {}
  const positions: Record<string, NodePosition> = {}

  // Build node map preserving original choice metadata where possible.
  for (const gNode of graphNodes) {
    const original = base.nodes[gNode.id]
    const node: ScenarioNode = original
      ? { ...original, ...gNode.data, id: gNode.id, choices: [] }
      : {
          id: gNode.id,
          narrative: gNode.data.narrative ?? '',
          narrativeEn: gNode.data.narrativeEn ?? '',
          choices: [],
          stateMutations: gNode.data.stateMutations ?? {},
          imageTag: gNode.data.imageTag ?? 'default',
          metadata: gNode.data.metadata ?? { year: base.birthInfo.birthYear },
          encyclopedia: gNode.data.encyclopedia,
        }
    // Drop the isStart helper before saving
    delete (node as unknown as { isStart?: boolean }).isStart
    newNodes[gNode.id] = node
    positions[gNode.id] = { ...gNode.position }
  }

  // Re-attach choices from edges (preserve choice id stability).
  for (const edge of graphEdges) {
    const sourceNode = newNodes[edge.source]
    if (!sourceNode) continue
    const choice: ScenarioChoice = {
      id: edge.data.choiceId,
      text: edge.data.text,
      textEn: edge.data.textEn,
      nextNodeId: edge.target,
    }
    sourceNode.choices.push(choice)
  }

  return {
    scenario: {
      ...base,
      nodes: newNodes,
    },
    positions,
  }
}

/**
 * Simple BFS-based auto-layout: BFS layers from startNodeId, columns from
 * order within a layer. Disconnected nodes are placed below the main flow.
 */
export function autoLayout(scenario: PreBuiltScenario): Record<string, NodePosition> {
  const COL_W = 280
  const ROW_H = 180
  const positions: Record<string, NodePosition> = {}
  const visited = new Set<string>()
  const layers: string[][] = []

  if (scenario.nodes[scenario.startNodeId]) {
    let frontier: string[] = [scenario.startNodeId]
    while (frontier.length > 0) {
      layers.push(frontier)
      for (const id of frontier) visited.add(id)
      const next: string[] = []
      for (const id of frontier) {
        const node = scenario.nodes[id]
        if (!node) continue
        for (const c of node.choices) {
          if (!visited.has(c.nextNodeId) && scenario.nodes[c.nextNodeId] && !next.includes(c.nextNodeId)) {
            next.push(c.nextNodeId)
          }
        }
      }
      frontier = next
    }
  }

  layers.forEach((layer, layerIdx) => {
    layer.forEach((id, colIdx) => {
      positions[id] = {
        x: layerIdx * COL_W,
        y: colIdx * ROW_H - ((layer.length - 1) * ROW_H) / 2,
      }
    })
  })

  // Disconnected nodes
  let orphanIdx = 0
  for (const id of Object.keys(scenario.nodes)) {
    if (!visited.has(id)) {
      positions[id] = {
        x: orphanIdx * COL_W,
        y: (layers.length + 2) * ROW_H,
      }
      orphanIdx++
    }
  }

  return positions
}
