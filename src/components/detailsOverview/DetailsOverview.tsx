import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import type { TreeNode, Label } from "../../types/types";
import PathBreadcrumbs from "../navigation/PathBreadcrumbs";
import TreeItemDetails from "./TreeItemDetails";

interface DetailsOverviewProps {
  node: TreeNode | null;
  treeData: TreeNode[];
  onNavigate?: (nodeId: string) => void;
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

const DetailsOverview: React.FC<DetailsOverviewProps> = ({
  node,
  treeData,
  onNavigate,
  onEditDatapoint,
  onUpdateDatapoints,
  onRename,
  onCreateAsset,
  onUpdateLabels,
}) => {
  if (!node) {
    return (
      <Paper elevation={1} sx={{ p: 3, height: "100%", bgcolor: "#f9f9f9" }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Select an item to view its details
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        height: "calc(100vh - 150px)",
        maxHeight: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <PathBreadcrumbs
        node={node}
        treeData={treeData}
        onNavigate={onNavigate}
      />

      <TreeItemDetails
        node={node}
        treeData={treeData}
        onEditDatapoint={onEditDatapoint}
        onUpdateDatapoints={onUpdateDatapoints}
        onRename={onRename}
        onCreateAsset={onCreateAsset}
        onUpdateLabels={onUpdateLabels}
      />
    </Box>
  );
};

export default DetailsOverview;
