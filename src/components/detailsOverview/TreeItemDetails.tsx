import React from "react";
import { Box, Divider } from "@mui/material";
import type { TreeNode, Label } from "../../types/types";
import NodeIcon from "../tree/NodeIcon";
import DatapointManager from "../datapoints/DatapointManager";
import AssetCreationSection from "../assets/AssetCreationSection";
import LabelSection from "../labels/LabelSection";
import NameEditor from "./TreeItemEditor";

interface TreeItemDetailsProps {
  node: TreeNode;
  treeData: TreeNode[];
  onEditDatapoint?: (
    nodeId: string,
    datapointId: string,
    newName: string
  ) => void;
  onUpdateDatapoints?: (
    nodeId: string,
    datapoints: { id: string; name: string }[]
  ) => void;
  onRename?: (nodeId: string, newName: string) => void;
  onCreateAsset?: (parentId: string, assetName: string) => void;
  onUpdateLabels?: (nodeId: string, labels: Label[]) => void;
}

const TreeItemDetails: React.FC<TreeItemDetailsProps> = ({
  node,
  treeData,
  onUpdateDatapoints,
  onRename,
  onCreateAsset,
  onUpdateLabels,
}) => {
  const handleNameChange = (newName: string) => {
    if (onRename) onRename(node.id, newName);
  };

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <NodeIcon type={node.type} size={32} />
        <NameEditor
          name={node.name}
          onRename={onRename ? handleNameChange : undefined}
        />
      </Box>
      <Divider sx={{ my: 2 }} />

      {node.type === "folder" && onCreateAsset && (
        <AssetCreationSection
          parentId={node.id}
          onCreateAsset={onCreateAsset}
        />
      )}

      {node.type === "asset" &&
        node.children &&
        node.children.length > 0 &&
        onUpdateDatapoints && (
          <DatapointManager
            datapoints={node.children}
            onUpdateDatapoints={(dps) => onUpdateDatapoints(node.id, dps)}
            title="Edit Datapoints"
            parentId={node.id}
          />
        )}

      <LabelSection
        node={node}
        treeData={treeData}
        onUpdateLabels={onUpdateLabels}
      />
    </>
  );
};

export default TreeItemDetails;
