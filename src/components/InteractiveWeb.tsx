import React, { useState, useEffect, useRef } from "react";
import { WebNode, WebLink, DecisionGraph } from "../types";
import { Info, ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface InteractiveWebProps {
  graph: DecisionGraph;
}

interface RenderNode {
  id: string;
  label: string;
  type: "decision" | "pro" | "con" | "factor";
  score: number;
  description: string;
  x: number;
  y: number;
}

export default function InteractiveWeb({ graph }: InteractiveWebProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<RenderNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<RenderNode | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

  // Handle Container Dimensions on Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 400),
          height: Math.max(height || 450, 400),
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute Layout Positions (Hierarchical Polar Layout)
  useEffect(() => {
    if (!graph || !graph.nodes || graph.nodes.length === 0) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    const computedNodes: RenderNode[] = [];
    const rootNodes = graph.nodes.filter((n) => n.type === "decision");
    const factorNodes = graph.nodes.filter((n) => n.type === "factor");
    const prosConsNodes = graph.nodes.filter((n) => n.type === "pro" || n.type === "con");

    // 1. Root node at center
    rootNodes.forEach((n) => {
      computedNodes.push({
        ...n,
        x: centerX,
        y: centerY,
      });
    });

    // 2. Inner circle for factors (dimensions)
    const factorRadius = Math.min(width, height) * 0.22;
    factorNodes.forEach((n, index) => {
      const angle = (index / factorNodes.length) * 2 * Math.PI;
      computedNodes.push({
        ...n,
        x: centerX + Math.cos(angle) * factorRadius,
        y: centerY + Math.sin(angle) * factorRadius,
      });
    });

    // 3. Outer circle for Pros/Cons
    const outerRadius = Math.min(width, height) * 0.38;
    prosConsNodes.forEach((n, index) => {
      // Find what factor/dimension node this pro/con connects to
      const relativeLink = graph.links.find(
        (l) => l.source === n.id || l.target === n.id
      );
      let baseAngle = (index / prosConsNodes.length) * 2 * Math.PI;

      if (relativeLink) {
        // Position close to its parent factor
        const parentId = relativeLink.source === n.id ? relativeLink.target : relativeLink.source;
        const parentIdx = factorNodes.findIndex((fn) => fn.id === parentId);
        if (parentIdx !== -1) {
          const parentAngle = (parentIdx / factorNodes.length) * 2 * Math.PI;
          // Add offset to avoid overlap
          baseAngle = parentAngle + (index % 3 - 1) * 0.28;
        }
      }

      computedNodes.push({
        ...n,
        x: centerX + Math.cos(baseAngle) * (outerRadius + (n.score * 8)),
        y: centerY + Math.sin(baseAngle) * (outerRadius + (n.score * 8)),
      });
    });

    setNodes(computedNodes);
    // Autofocus critical root node
    const rootNode = computedNodes.find((n) => n.type === "decision") || computedNodes[0];
    if (rootNode) {
      setSelectedNode(rootNode);
    }
  }, [graph, dimensions]);

  // Drag handlers
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedNodeId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes((prevNodes) =>
      prevNodes.map((n) => (n.id === draggedNodeId ? { ...n, x, y } : n))
    );

    // Keep active node sync'd on drag
    if (selectedNode?.id === draggedNodeId) {
      setSelectedNode((prev) => (prev ? { ...prev, x, y } : null));
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Color mappings
  const getNodeStyles = (type: string) => {
    switch (type) {
      case "decision":
        return {
          bg: "fill-slate-900 stroke-cyan-400",
          glow: "rgba(34, 211, 238, 0.4)",
          radius: 26,
          textColor: "text-cyan-400 font-bold",
        };
      case "pro":
        return {
          bg: "fill-slate-950 stroke-emerald-500",
          glow: "rgba(16, 185, 129, 0.25)",
          radius: 17,
          textColor: "text-emerald-400 font-semibold",
        };
      case "con":
        return {
          bg: "fill-slate-950 stroke-rose-500",
          glow: "rgba(244, 63, 94, 0.25)",
          radius: 17,
          textColor: "text-rose-400 font-semibold",
        };
      default: // factor
        return {
          bg: "fill-slate-950 stroke-violet-500",
          glow: "rgba(139, 92, 246, 0.2)",
          radius: 20,
          textColor: "text-violet-400 font-medium",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map visualization area */}
      <div className="lg:col-span-2 bg-slate-950/80 border border-slate-900 rounded-2xl p-4 relative flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              The Decision Web
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
              className="p-1 hover:bg-slate-800 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <span className="text-[10px] text-slate-400 px-1 font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.5))}
              className="p-1 hover:bg-slate-800 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                // Reset positions
                setDimensions((prev) => ({ ...prev }));
              }}
              className="p-1 hover:bg-slate-800 rounded transition border-l border-slate-800"
              title="Reset Viewport"
            >
              <Maximize className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-16 left-6 flex flex-col gap-1.5 z-10 text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Decision Point
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Dimension / Factor
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Key Advantage (Pro)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Risk / Barrier (Con)
          </div>
        </div>

        {/* SVG Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 w-full bg-slate-950/20 rounded-xl relative select-none overflow-hidden touch-none"
          style={{ minHeight: "390px" }}
        >
          <svg
            width="100%"
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="transition-transform duration-100 ease-out"
          >
            {/* Draw links first so they render under node text */}
            <g transform={`scale(${zoomLevel})`} style={{ transformOrigin: "center center" }}>
              {graph.links.map((link, idx) => {
                const sourceNode = nodes.find((n) => n.id === link.source);
                const targetNode = nodes.find((n) => n.id === link.target);

                if (!sourceNode || !targetNode) return null;

                const isHighlighted =
                  selectedNode?.id === sourceNode.id || selectedNode?.id === targetNode.id;

                let linkColor = "stroke-slate-800";
                if (isHighlighted) {
                  if (link.relationship === "supports") linkColor = "stroke-emerald-500/80";
                  else if (link.relationship === "opposes") linkColor = "stroke-rose-500/80";
                  else linkColor = "stroke-purple-500/80";
                }

                return (
                  <g key={idx}>
                    {/* Background glow when active */}
                    {isHighlighted && (
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        className="stroke-cyan-500/10"
                        strokeWidth={7}
                      />
                    )}
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      className={`transition-colors duration-200 ${linkColor}`}
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      strokeDasharray={link.relationship === "opposes" ? "4 4" : undefined}
                    />
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const { bg, glow, radius } = getNodeStyles(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-grab active:cursor-grabbing group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                  >
                    {/* Shadow Radial glow */}
                    <circle
                      r={radius + 10}
                      fill="transparent"
                      className="transition-all duration-300"
                      style={{
                        boxShadow: isSelected ? `0 0 20px ${glow}` : "none",
                      }}
                    />

                    {/* Outer Circle Ring */}
                    <circle
                      r={radius}
                      className={`transition-all duration-300 stroke-[1.5] ${bg} ${
                        isSelected
                          ? "stroke-[2.5]"
                          : "group-hover:stroke-[2] group-hover:scale-105"
                      }`}
                      style={{
                        filter: isSelected
                          ? `drop-shadow(0 0 6px ${glow})`
                          : "none",
                      }}
                    />

                    {/* Score fill indicator for Pros/Cons */}
                    {(node.type === "pro" || node.type === "con") && (
                      <circle
                        r={radius - 5}
                        className={
                          node.type === "pro"
                            ? "fill-emerald-500/15 stroke-none"
                            : "fill-rose-500/15 stroke-none"
                        }
                      />
                    )}

                    {/* Center dot for Decisions */}
                    {node.type === "decision" && (
                      <circle r={6} className="fill-cyan-400 stroke-none" />
                    )}

                    {/* Node Label Text */}
                    <text
                      y={radius + 15}
                      textAnchor="middle"
                      className={`text-[10px] font-mono tracking-tight fill-slate-300 pointer-events-none select-none transition-colors ${
                        isSelected ? "fill-cyan-400 font-semibold" : "group-hover:fill-slate-100"
                      }`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <span className="text-[10px] text-slate-500 font-mono mt-2 select-none">
          💡 Drag circles to rearrange. Click a node to inspect parameters & linked relations.
        </span>
      </div>

      {/* Node details Inspector panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between max-h-[500px] overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/80">
            <Info className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
              Cognitive Node Inspector
            </h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-cyan-400 inline-block mb-1.5">
                  Type: {selectedNode.type}
                </span>
                <h4 className="text-base font-semibold text-slate-100 leading-tight">
                  {selectedNode.label === "root" ? "Central Dilemma" : selectedNode.label}
                </h4>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 text-xs md:text-sm text-slate-300 leading-relaxed max-h-[140px] overflow-y-auto">
                {selectedNode.description}
              </div>

              {(selectedNode.type === "pro" || selectedNode.type === "con") && (
                <div className="grid grid-cols-2 gap-3 bg-slate-950/60 rounded-xl p-3 border border-slate-850/85">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {selectedNode.type === "pro" ? "💪 Strength score" : "⚠️ Severity score"}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-bold text-slate-100 font-mono">
                        {selectedNode.score}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`w-1.5 h-1.5 rounded-full ${
                              s <= selectedNode.score
                                ? selectedNode.type === "pro"
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                                : "bg-slate-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Factor Impact
                    </span>
                    <span className="text-xs font-semibold text-slate-200 inline-block mt-1">
                      🔥 Priority High
                    </span>
                  </div>
                </div>
              )}

              {/* Connected relationships analysis */}
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block mb-2">
                  Relationships & Paths
                </span>
                <div className="space-y-1.5">
                  {graph.links
                    .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
                    .map((link, idx) => {
                      const otherId = link.source === selectedNode.id ? link.target : link.source;
                      const otherNode = nodes.find((n) => n.id === otherId);
                      if (!otherNode) return null;

                      return (
                        <div
                          key={idx}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedNode(otherNode)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedNode(otherNode);
                            }
                          }}
                          className="flex items-center justify-between p-2 bg-slate-950 hover:bg-slate-950/60 rounded-lg border border-slate-850 text-xs cursor-pointer transition"
                        >
                          <span className="text-slate-400 font-mono truncate max-w-[130px]">
                            {otherNode.label === "root" ? "Decision Root" : otherNode.label}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold ${
                              link.relationship === "supports"
                                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                                : link.relationship === "opposes"
                                ? "bg-rose-950/40 text-rose-400 border border-rose-900/40"
                                : "bg-purple-950/40 text-purple-400 border border-purple-900/40"
                            }`}
                          >
                            {link.relationship}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-xs md:text-sm">
                No node selected. Select any vertex in the web to fetch dynamic structural feedback.
              </p>
            </div>
          )}
        </div>

        {selectedNode && (
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed mt-4">
            🔍 Visualizing the path assists you in spotting hidden bottleneck elements or positive feedback loops dynamically.
          </div>
        )}
      </div>
    </div>
  );
}
