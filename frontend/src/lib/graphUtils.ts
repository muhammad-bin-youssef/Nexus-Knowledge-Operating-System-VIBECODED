import type { GraphEdge, GraphNode } from '../types'
import type { Edge, Node } from '@xyflow/react'

const NODE_TYPE_COLORS: Record<string, string> = {
  concept: '#6366f1',
  topic: '#8b5cf6',
  claim: '#f59e0b',
  evidence: '#10b981',
  question: '#3b82f6',
  answer: '#06b6d4',
  person: '#ec4899',
  book: '#f97316',
  article: '#f43f5e',
  definition: '#14b8a6',
  event: '#8b5cf6',
  organization: '#38bdf8',
  place: '#22c55e',
  scholar: '#7c3aed',
  argument: '#f43f5e',
  counter_argument: '#ea580c',
  conclusion: '#0ea5e9',
  timeline_event: '#22c55e',
  custom: '#64748b',
}

const NODE_TYPE_LABELS: Record<string, string> = {
  concept: 'Concept',
  topic: 'Topic',
  claim: 'Claim',
  evidence: 'Evidence',
  question: 'Question',
  answer: 'Answer',
  person: 'Person',
  book: 'Book',
  article: 'Article',
  definition: 'Definition',
  event: 'Event',
  organization: 'Organization',
  place: 'Place',
  scholar: 'Scholar',
  argument: 'Argument',
  counter_argument: 'Counter Argument',
  conclusion: 'Conclusion',
  timeline_event: 'Timeline Event',
  custom: 'Custom',
}

export function nodeTypeColor(nodeType: string): string {
  return NODE_TYPE_COLORS[nodeType] ?? '#64748b'
}

export function formatNodeType(nodeType: string): string {
  return NODE_TYPE_LABELS[nodeType] ?? nodeType.replace(/_/g, ' ')
}

export function nodeTypeDescription(nodeType: string): string {
  switch (nodeType) {
    case 'concept':
      return 'A key concept or idea in the knowledge graph.'
    case 'topic':
      return 'A subject area or theme covered by the imported content.'
    case 'claim':
      return 'A statement or assertion that may be supported or refuted by evidence.'
    case 'evidence':
      return 'A factual detail, quote, or data point that supports claims.'
    case 'question':
      return 'A question extracted from the text or user input.'
    case 'answer':
      return 'An answer or response related to a question.'
    case 'definition':
      return 'A definition or explanation of a concept.'
    case 'book':
      return 'A referenced book or document source.'
    case 'article':
      return 'A referenced article or publication.'
    case 'person':
      return 'A person or named individual mentioned in the knowledge graph.'
    case 'event':
      return 'An event, date, or historical occurrence.'
    case 'organization':
      return 'An organization, institution, or group entity.'
    case 'place':
      return 'A location or geographic place.'
    case 'scholar':
      return 'A scholar or author referenced in the content.'
    case 'argument':
      return 'A reasoning step, support, or opposition used to explain a claim.'
    case 'counter_argument':
      return 'An opposing argument or perspective associated with a claim.'
    case 'conclusion':
      return 'A summary statement or result from reasoning and evidence.'
    case 'timeline_event':
      return 'A dated occurrence or sequence item in a historical timeline.'
    default:
      return 'A knowledge graph entity with metadata and connections.'
  }
}

export function toFlowNodes(nodes: GraphNode[]): Node[] {
  return nodes.map((node) => ({
    id: node.id,
    type: 'kos',
    position: { x: node.position_x, y: node.position_y },
    data: {
      label: node.label,
      nodeType: node.node_type,
      verified: node.verified,
      content: node.content,
    },
  }))
}

export function toFlowEdges(edges: GraphEdge[]): Edge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source_id,
    target: edge.target_id,
    label: edge.edge_type.replace(/_/g, ' '),
    animated: !edge.verified,
    data: { evidence: edge.evidence, verified: edge.verified },
  }))
}
