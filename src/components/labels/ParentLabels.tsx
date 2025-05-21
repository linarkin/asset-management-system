import React, { useMemo } from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";
import type { TreeNode } from "../../types/types";
import { findPathToNode, findNodeById } from "../../utils/treeOperationsHelper";
import LabelItem from "./LabelItem";

interface ParentLabelsProps {
  node: TreeNode;
  treeData: TreeNode[];
}

const ParentLabels: React.FC<ParentLabelsProps> = ({ node, treeData }) => {
  const parentLabels = useMemo(() => {
    const path = findPathToNode(treeData, node.id);

    const parents = path.slice(0, -1);

    return parents
      .filter((parent) => {
        const parentNode = findNodeById(treeData, parent.id);
        return parentNode && parentNode.labels && parentNode.labels.length > 0;
      })
      .map((parent) => {
        const parentNode = findNodeById(treeData, parent.id);
        return {
          id: parent.id,
          name: parent.name,
          labels: parentNode?.labels || [],
        };
      });
  }, [node.id, treeData]);

  if (parentLabels.length === 0) {
    return null;
  }

  return (
    <Box mt={3}>
      <Divider sx={{ my: 2 }} />
      <Typography
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Labels of the path
      </Typography>
      <Box
        sx={{
          borderRadius: 1,
          p: 2,
          border: "1px solid #ffb74d",
        }}
      >
        {parentLabels.map((parent) => (
          <Box
            key={parent.id}
            sx={{
              mb: 3,
              pb: 2,
              borderBottom: "1px dashed rgba(0, 0, 0, 0.12)",
            }}
          >
            <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: "bold", mr: 1 }}
              >
                From:
              </Typography>
              <Chip
                label={parent.name}
                size="small"
                color="primary"
                sx={{ fontWeight: "medium", px: 0.5 }}
                variant="outlined"
              />
            </Box>
            <Box pl={2}>
              {parent.labels.map((label, index) => (
                <LabelItem key={index} label={label} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ParentLabels;
