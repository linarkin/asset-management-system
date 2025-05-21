import { useState } from "react";
import type { Label, TreeNode } from "../types/types";

interface UseLabelEditorProps {
  node: TreeNode;
  onUpdateLabels?: (
    nodeId: string,
    labels: Label[],
    datapoints?: TreeNode[]
  ) => void;
}

interface UseLabelEditorResult {
  isEditingLabels: boolean;
  handleStartEditingLabels: () => void;
  handleSaveLabels: (updatedLabels: Label[]) => void;
  handleCancelEditLabels: () => void;
}

/**
 * Custom hook to manage label editing functionality
 */
export function useLabelEditor({
  node,
  onUpdateLabels,
}: UseLabelEditorProps): UseLabelEditorResult {
  const [isEditingLabels, setIsEditingLabels] = useState(false);

  const handleStartEditingLabels = () => {
    setIsEditingLabels(true);
  };

  const handleSaveLabels = (updatedLabels: Label[]) => {
    if (onUpdateLabels) {
      onUpdateLabels(node.id, updatedLabels);
    }
    setIsEditingLabels(false);
  };

  const handleCancelEditLabels = () => {
    setIsEditingLabels(false);
  };

  return {
    isEditingLabels,
    handleStartEditingLabels,
    handleSaveLabels,
    handleCancelEditLabels,
  };
}
