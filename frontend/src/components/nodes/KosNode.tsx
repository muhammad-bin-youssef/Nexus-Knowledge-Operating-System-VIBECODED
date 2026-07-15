import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { nodeTypeColor, formatNodeType } from '../../lib/graphUtils'

interface KosNodeData {
  label: string
  nodeType: string
  verified: boolean
  content?: string | null
}

function KosNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as KosNodeData
  const color = nodeTypeColor(nodeData.nodeType)

  return (
    <div
      className={`react-flow__node-kos rounded-2xl border ${selected ? 'border-white/20 shadow-[0_0_0_1px_rgba(148,163,184,0.35)] shadow-slate-800' : 'border-transparent'}`}
      title={`${formatNodeType(nodeData.nodeType)} • ${nodeData.label}`}
      style={{ backgroundColor: '#0f1117' }}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />
      <div
        className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-t-lg flex items-center justify-between"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <span>{formatNodeType(nodeData.nodeType)}</span>
        {nodeData.verified && (
          <span className="ml-2 opacity-80 text-[10px]">✓</span>
        )}
      </div>
      <div className="px-3 py-2">
        <div className="font-medium text-sm leading-tight line-clamp-2" title={nodeData.label}>
          {nodeData.label}
        </div>
        {nodeData.content && (
          <div className="mt-1 text-[11px] text-slate-400 line-clamp-3">
            {nodeData.content}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  )
}

export const KosNode = memo(KosNodeComponent)
