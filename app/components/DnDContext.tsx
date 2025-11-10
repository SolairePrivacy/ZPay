import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type DraggedNode = { name: string; nodeType: string } | null;
type DnDContextValue = [DraggedNode, Dispatch<SetStateAction<DraggedNode>>];

const defaultValue: DnDContextValue = [null, () => null];

const DnDContext = createContext<DnDContextValue>(defaultValue);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [node, setNode] = useState<DraggedNode>(null);

  return (
    <DnDContext.Provider value={[node, setNode]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};