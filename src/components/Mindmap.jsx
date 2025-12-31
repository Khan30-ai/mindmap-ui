import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import mindmapData from "../data/mindmap.json";
import CustomNode from "./CustomNode";
import Sidebar from "./Sidebar";
import { Documentation } from "./Documentation";

//horizontal and vertical spacing between nodes.
const NODE_X_GAP = 220; 
const NODE_Y_GAP = 120;

const nodeTypes = { custom: CustomNode }; //custom node type for Reactflow

//whenever expansion or hover state changes
function generateFlowData(data, expandedNodes, onHover, hoveredNodeId) {
  const nodes = [];
  const edges = [];
  let currentY = 0;
//recursive function to place nodes
  function traverse(node, depth = 0, parentId = null) {
    const nodeId = node.id;
    let startY = currentY;
    //render children first
    if (node.children && expandedNodes.has(node.id)) {
      node.children.forEach((child) => traverse(child, depth + 1, nodeId));
    }
    //if not children then allocate space
    if (!node.children || !expandedNodes.has(node.id)) {
      currentY += NODE_Y_GAP;
    }
      //centering the parent nodde between its children
    let endY = currentY;
    let nodeY = (startY + endY) / 2;

    //place current node at centre
    nodes.push({
      id: nodeId,
      type: "custom",
      data: {
        label: node.name,
        fullData: node,
        onHover, //callback used by customNode to update sidebar
      },
      position: {
        x: depth * NODE_X_GAP,
        y: nodeY,
      },
    });
    //connect edges from parent to child
    if (parentId) {
      const isHighlighted =
        hoveredNodeId &&
        (hoveredNodeId === parentId || hoveredNodeId === nodeId);

      edges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        style: {
          stroke: isHighlighted ? "#fbbf24" : "#60a5fa",
          strokeWidth: isHighlighted ? 4 : 2,
        },
        animated: isHighlighted,
      });
    }
  }

  traverse(data);
  return { nodes, edges };
}

export default function Mindmap() {
  const [flow, setFlow] = useState({ nodes: [], edges: [] });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showDocs, setShowDocs] = useState(false);

  //this stores id of those node which are expanded by user
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [rfInstance, setRfInstance] = useState(null);//internal instance of reactflow 

  const handleHover = useCallback((node) => {
    setHoveredNode(node); //when hovering a node sidebar will update
  }, []);

  const expandAll = () => {
    const allIds = new Set(); //created empty set
    //collect all nodes id and updates state with recursive function
    function collect(node) {
      allIds.add(node.id);
      node.children?.forEach(collect);  //if child undefine it will skip 
    }
    collect(mindmapData);
    setExpandedNodes(allIds);
  };


  const collapseAll = () => {
    setExpandedNodes(new Set()); //collapse everything except root
  };

  const fitView = () => {
    rfInstance?.fitView({ padding: 0.2 }); //instance of ReactFlow
  };

  useEffect(() => {
    const hoveredNodeId = hoveredNode?.id || null;
    setFlow(
      generateFlowData(mindmapData, expandedNodes, handleHover, hoveredNodeId)
    );
  }, [expandedNodes, hoveredNode, handleHover]);

  return (
    <div className="flex w-screen h-screen bg-black">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-50 flex gap-2">
  <button
    onClick={expandAll}
    className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
  >
    Expand All
  </button>
  <button
    onClick={collapseAll}
    className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
  >
    Collapse All
  </button>
  <button
    onClick={fitView}
    className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
  >
    Fit View
  </button>
</div>

{/*right side button */}
<div className="absolute top-4 right-4 z-50"> 
  <button
    onClick={() => setShowDocs(true)}
    className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
  >
    Full Documentation
  </button>
</div>

        <ReactFlow
          nodes={flow.nodes} //Array of node objects
          edges={flow.edges} //Array of edge objects
          nodeTypes={nodeTypes}
          fitView
          onInit={setRfInstance}
          onNodeClick={(e, node) => {
            setExpandedNodes((prev) => {
              const next = new Set(prev);

              // if expanded then collapse, if collapsed then expand
              if (next.has(node.id)) {
                next.delete(node.id);
              } else {
                next.add(node.id);
              }

              return next;
            });
          }}
        >
          <Background color="#2a2a2a" gap={24} />
          <Controls />
        </ReactFlow>
        {showDocs && (
          <div className="fixed inset-0 `z-100` bg-black/70">
            <div className="absolute inset-0 bg-white overflow-y-auto">
              <button
                onClick={() => setShowDocs(false)}
                className="absolute top-4 right-4 px-3 py-1 bg-red-600  hover:bg-red-500 cursor-pointer text-white rounded"
              >
                Close
              </button>

              <Documentation />
            </div>
          </div>
        )}
      </div>

      <Sidebar node={hoveredNode} />
    </div>
  );
}
