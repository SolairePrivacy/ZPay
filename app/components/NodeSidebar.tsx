import React from "react";
import { useDnD } from "./DnDContext";

const NodeSidebar = () => {
  const [, setDraggedNode] = useDnD();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    name: string,
    nodeType: string
  ) => {
    setDraggedNode({ name, nodeType });
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <div className="text-xs uppercase tracking-[0.3em] text-white/60 mt-4">
        Default instructions:
      </div>
      <div className="bg-slate-900/40 border border-white/10 p-2 grid grid-cols-2 gap-2">
        <div
          className="dndnode input bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "Transfer", "")}
          draggable
        >
          Transfer
        </div>
        <div
          className="dndnode bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "ZPay Wallet", "default")}
          draggable
        >
          ZPay Wallet
        </div>
        <div
          className="dndnode output bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "ZCash Deposit", "output")}
          draggable
        >
          ZCash Deposit
        </div>
        <div
          className="dndnode output bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "ZCash Withdraw", "output")}
          draggable
        >
          ZCash Withdraw
        </div>
        <div
          className="dndnode output bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "Pumpfun Buy", "output")}
          draggable
        >
          Pumpfun Buy
        </div>
        <div
          className="dndnode output bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "Pumpfun Sell", "output")}
          draggable
        >
          Pumpfun Sell
        </div>
        <div
          className="dndnode output bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "Swap", "output")}
          draggable
        >
          Swap
        </div>
        <div
          className="dndnode output bg-white/10 p-2 text-center"
          onDragStart={(event) => onDragStart(event, "Check balance", "output")}
          draggable
        >
          Check balance
        </div>
      </div>
    </>
  );
};

export default NodeSidebar;
