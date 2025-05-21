export interface Label {
  key: string;
  value: string;
}

export type NodeType = "folder" | "asset" | "datapoint";

/**
 * Core tree node interface that represents any item in the tree
 */
export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  labels: Label[];
  children?: TreeNode[];
}

export interface DatapointInput {
  id: string;
  name: string;
}
