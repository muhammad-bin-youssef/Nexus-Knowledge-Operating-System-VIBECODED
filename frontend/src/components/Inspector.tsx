import { ChevronLeft, ChevronRight, Shield, ShieldOff } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchGraph } from '../api/client'
import { useAppStore, selectSelectedNode } from '../store/appStore'
import { formatNodeType, nodeTypeColor, nodeTypeDescription } from '../lib/graphUtils'

export function Inspector() {
  const collapsed = useAppStore((s) => s.inspectorCollapsed)
  const toggleInspector = useAppStore((s) => s.toggleInspector)
  const selectedNodeId = useAppStore((s) => s.selectedNodeId)

  const { data: graph } = useQuery({
    queryKey: ['graph'],
    queryFn: fetchGraph,
  })

  const selectedNode = selectSelectedNode(graph?.nodes ?? [], selectedNodeId)

  if (collapsed) {
    return (
      <aside className="w-10 flex flex-col items-center py-3 border-l border-[#2a3042] bg-[#161922]">
        <button
          onClick={toggleInspector}
          className="p-1.5 rounded hover:bg-[#2a3042] text-slate-400"
          title="Expand inspector"
        >
          <ChevronLeft size={16} />
        </button>
      </aside>
    )
  }

  return (
    <aside className="w-80 flex flex-col border-l border-[#2a3042] bg-[#161922] shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a3042]">
        <span className="font-semibold text-sm">Inspector</span>
        <button
          onClick={toggleInspector}
          className="p-1 rounded hover:bg-[#2a3042] text-slate-400"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode ? (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#13161f] border border-[#2a3042] p-4">
              <div
                className="inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${nodeTypeColor(selectedNode.node_type)}22`,
                  color: nodeTypeColor(selectedNode.node_type),
                }}
              >
                {formatNodeType(selectedNode.node_type)}
              </div>
              <h2 className="text-xl font-semibold mt-3">{selectedNode.label}</h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {nodeTypeDescription(selectedNode.node_type)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#13161f] border border-[#2a3042] p-4">
              <div className="flex items-center gap-2 text-sm">
                {selectedNode.verified ? (
                  <>
                    <Shield size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Verified</span>
                  </>
                ) : (
                  <>
                    <ShieldOff size={14} className="text-amber-400" />
                    <span className="text-amber-400">Unverified</span>
                  </>
                )}
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <span className="text-slate-500">Node ID</span>
                  <span className="break-all">{selectedNode.id}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <span className="text-slate-500">Type</span>
                  <span>{formatNodeType(selectedNode.node_type)}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <span className="text-slate-500">Source</span>
                  <span>{selectedNode.provenance.source_type}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <span className="text-slate-500">Created</span>
                  <span>{new Date(selectedNode.created_at).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <span className="text-slate-500">Updated</span>
                  <span>{new Date(selectedNode.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {selectedNode.content && (
              <div className="rounded-2xl bg-[#13161f] border border-[#2a3042] p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                  Full content
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedNode.content}
                </p>
              </div>
            )}

            <div className="rounded-2xl bg-[#13161f] border border-[#2a3042] p-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-3">
                Provenance & excerpt
              </div>
              <div className="grid gap-3 text-sm text-slate-300">
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <span className="text-slate-500">Source ID</span>
                  <span className="break-all">{selectedNode.provenance.source_id}</span>
                </div>
                {selectedNode.provenance.excerpt ? (
                  <div>
                    <div className="text-slate-500 mb-1">Excerpt</div>
                    <div className="rounded-xl bg-[#0f1117] border border-[#2a3042] p-3 text-slate-300 text-sm italic">
                      “{selectedNode.provenance.excerpt}”
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500">No excerpt available for this node.</div>
                )}
              </div>
            </div>

            {graph && (
              <div className="rounded-2xl bg-[#13161f] border border-[#2a3042] p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-3">
                  Connections
                </div>
                <ul className="space-y-2 text-sm">
                  {graph.edges
                    .filter(
                      (e) =>
                        e.source_id === selectedNode.id ||
                        e.target_id === selectedNode.id,
                    )
                    .map((edge) => {
                      const isOutgoing = edge.source_id === selectedNode.id
                      const otherId = isOutgoing ? edge.target_id : edge.source_id
                      const other = graph.nodes.find((n) => n.id === otherId)
                      return (
                        <li
                          key={edge.id}
                          className="rounded-xl bg-[#0f1117] border border-[#2a3042] p-3"
                        >
                          <div className="flex items-center gap-2 text-slate-300 mb-1">
                            <span className="text-indigo-400">{isOutgoing ? '→' : '←'}</span>
                            <span className="text-[11px] uppercase text-slate-500">
                              {edge.edge_type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-slate-100 font-medium truncate">
                            {other?.label ?? otherId}
                          </div>
                          {edge.evidence && (
                            <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              {edge.evidence}
                            </div>
                          )}
                        </li>
                      )
                    })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            Select a node to inspect its properties, provenance, and connections
          </div>
        )}
      </div>
    </aside>
  )
}
