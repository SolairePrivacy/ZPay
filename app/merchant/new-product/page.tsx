"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  Position,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import axios from "axios";

import "@xyflow/react/dist/style.css";
import IdlNode from "@/app/components/IdlNode";

import Sidebar from "@/app/components/NodeSidebar";
import { DnDProvider, useDnD } from "@/app/components/DnDContext";

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "ZCash Deposit" },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
  },
  {
    id: "2",
    type: "custom",
    data: { label: "ZCash Withdraw" },
    position: { x: 125, y: 0 },
    sourcePosition: Position.Bottom,
  },
];

let nodeId = 3;
const getId = () => `dndnode_${nodeId++}`;

function MerchantContent() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [instructions, setInstructions] = useState<any[] | null>(null);
  const [instructionFlow, setInstructionFlow] = useState<idlProgram[]>([]);
  const [selectedInstruction, setSelectedInstruction] = useState<any>(null);
  const [metadata, setMetadata] = useState<Metadata>({
    name: "",
    description: "",
    price: 0,
  });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const [draggedNode, setDraggedNode] = useDnD();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!draggedNode) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: draggedNode.nodeType,
        position,
        data: { label: draggedNode.name },
        sourcePosition: Position.Bottom,
      };

      setNodes((nds) => nds.concat(newNode));
      setDraggedNode(null);
    },
    [draggedNode, screenToFlowPosition, setDraggedNode, setNodes]
  );

  const nodeTypes = {
    custom: IdlNode,
  };

  function importIDL(files: FileList) {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const idl = JSON.parse(e.target?.result as string);
        console.log(e.target?.result as string);
        setInstructions(idl.instructions);
      };
      reader.readAsText(file);
    }
  }

  function addInstructionNode(instruction: any) {
    setInstructionFlow((flow) => [...flow, instruction]);
    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: `${instruction.name}-${currentNodes.length + 1}`,
        type: "custom",
        data: { label: instruction.name },
        position: { x: 0, y: 25 },
        sourcePosition: Position.Bottom,
      },
    ]);
  }

  function onSaveDraft() {
    axios.post("/api/save/draft", {
      program: {
        metadata: metadata,
        instructions: instructionFlow,
      },
    });
  }

  function onSaveArticle() {
    axios.post("/api/save/article", {
      program: {
        metadata: metadata,
        instructions: instructionFlow,
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="grid grid-cols-2 gap-2">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">
              Solana IDL Import:
            </div>
            <input
              type="file"
              accept="json/*"
              onChange={(e) => importIDL(e.target.files as FileList)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none"
            />

            <section className={`mt-4 ${instructions ? "block" : "hidden"}`}>
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                Executable Instructions:
              </div>
              <div className="mt-4">
                {instructions &&
                  instructions.map((instruction: any) => (
                    <div
                      key={instruction.name}
                      onDoubleClick={() => addInstructionNode(instruction)}
                      className={`border border-white/10 rounded-xl p-2 mb-2 ${
                        selectedInstruction === instruction ? "bg-white/10" : ""
                      }`}
                      onClick={() => setSelectedInstruction(instruction)}
                    >
                      <div className="text-sm font-bold">
                        {instruction.name}
                      </div>
                      {instruction.args && (
                        <div className="text-sm">
                          (
                          {instruction.args
                            .map((arg: any) => arg.name)
                            .join(", ")}
                          )
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>

            <div className="text-xs uppercase tracking-[0.3em] text-white/60 mt-4">
              Metadata:
            </div>

            <div className="flex flex-col gap-2 ">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={metadata.name}
                  onChange={(e) =>
                    setMetadata({ ...metadata, name: e.target.value })
                  }
                  type="text"
                  placeholder="Product Name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none"
                />
                <input
                  value={metadata.price}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      price: parseFloat(e.target.value),
                    })
                  }
                  type="number"
                  min="0"
                  step="0.001"
                  placeholder="Product Price"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none"
                />
              </div>
              <textarea
                value={metadata.description}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
                rows={4}
                placeholder="Product Description"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onSaveDraft}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none hover:bg-white/10"
                >
                  Save Draft
                </button>
                <button
                  onClick={onSaveArticle}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none hover:bg-white/10"
                >
                  Create Article
                </button>
              </div>
            </div>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">
              Execution Preview:
            </div>
            <div className="mt-4">
              <div className="dndflow">
                <div
                  className="reactflow-wrapper h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40"
                  ref={reactFlowWrapper}
                >
                  <ReactFlow
                    className="h-full w-full"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                  >
                    <Controls />
                    <Background />
                  </ReactFlow>
                </div>
                <Sidebar />
              </div>

              <div className="mt-4 space-y-2">
                {instructionFlow.map((instruction: any) => (
                  <div key={instruction.name}>
                    <div className="text-sm font-bold">{instruction.name}</div>
                    <div className="text-sm">
                      ({instruction.args.map((arg: any) => arg.name).join(", ")}
                      )
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function MerchantPage() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <MerchantContent />
      </DnDProvider>
    </ReactFlowProvider>
  );
}