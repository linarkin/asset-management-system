import React from "react";
import { Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { TreeNode, Label } from "../../types/types";
import { useLabelEditor } from "../../hooks/useLabelManager";
import LabelEditor from "./LabelEditor";
import ParentLabels from "./ParentLabels";
import LabelItem from "./LabelItem";

interface LabelSectionProps {
  node: TreeNode;
  treeData: TreeNode[];
  onUpdateLabels?: (nodeId: string, labels: Label[]) => void;
}

const LabelSection: React.FC<LabelSectionProps> = ({
  node,
  treeData,
  onUpdateLabels,
}) => {
  const {
    isEditingLabels,
    handleStartEditingLabels,
    handleSaveLabels,
    handleCancelEditLabels,
  } = useLabelEditor({ node, onUpdateLabels });

  return (
    <Box mt={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle1">Labels</Typography>
        {onUpdateLabels && !isEditingLabels && (
          <Button
            startIcon={<EditIcon />}
            size="small"
            onClick={handleStartEditingLabels}
            variant="outlined"
          >
            Manage Labels
          </Button>
        )}
      </Box>

      {isEditingLabels ? (
        <LabelEditor
          labels={node.labels}
          onSave={handleSaveLabels}
          onCancel={handleCancelEditLabels}
          nodeId={node.id}
        />
      ) : node.labels.length > 0 ? (
        node.labels.map((label, idx) => <LabelItem key={idx} label={label} />)
      ) : (
        <Typography variant="body2" color="text.secondary">
          No labels defined
        </Typography>
      )}

      <ParentLabels node={node} treeData={treeData} />
    </Box>
  );
};

export default LabelSection;
