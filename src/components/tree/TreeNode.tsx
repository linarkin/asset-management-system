import React, { memo, useCallback, useState } from "react";
import { NodeApi } from "react-arborist";
import type { TreeNode, NodeType } from "../../types/types";

import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NodeIcon from "./NodeIcon";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

interface TreeNodeProps {
  node: NodeApi<TreeNode>;
  style: React.CSSProperties;
  dragHandle: React.Ref<any>;
  onDelete: (info: { ids: string[] }) => void;
}

/**
 * Renders a customized node for the tree
 */
const TreeNodeComponent = memo(
  ({ node, style, dragHandle, onDelete }: TreeNodeProps) => {
    const isDataPoint = node.data.type === "datapoint";
    const type = node.data.type as NodeType;
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const actualDragHandle = isDataPoint ? undefined : dragHandle;

    const handleToggle = useCallback(() => {
      node.toggle();
    }, [node]);

    const handleDeleteRequest = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteConfirmation(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (onDelete) {
        onDelete({ ids: [node.id] });
      }
      setShowDeleteConfirmation(false);
    }, [node.id, onDelete]);

    const handleCancelDelete = useCallback(() => {
      setShowDeleteConfirmation(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    return (
      <>
        <Box
          ref={actualDragHandle}
          style={{
            ...style,
            width: "auto",
            minWidth: style.width,
            display: "flex",
            userSelect: "none",
            background: node.isSelected ? "#c8e6c9" : "transparent",
            alignItems: "center",
            cursor: isDataPoint ? "default" : "grab",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!isDataPoint && (
            <Box
              onClick={handleToggle}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: node.isLeaf ? "default" : "pointer",
                width: 24,
                height: 24,
                textAlign: "center",
              }}
            >
              {!node.isLeaf &&
                (node.isOpen ? (
                  <KeyboardArrowDownIcon fontSize="small" />
                ) : (
                  <KeyboardArrowRightIcon fontSize="small" />
                ))}
            </Box>
          )}

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              padding: "0 8px",
              marginRight: 4,
              width: 40,
              height: 24,
              position: "relative",
            }}
          >
            <NodeIcon type={type} />
          </Box>

          <Box
            style={{
              flexGrow: 1,
              minWidth: "100px",
              overflow: "hidden",
            }}
          >
            <Typography
              noWrap
              title={node.data.name}
              sx={{
                fontStyle: isDataPoint ? "italic" : "normal",
                fontSize: isDataPoint ? "0.9rem" : "inherit",
                color: isDataPoint ? "text.secondary" : "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {node.data.name}
            </Typography>
          </Box>

          {isHovered && (
            <Tooltip title={`Delete ${node.data.name}`}>
              <IconButton
                size="small"
                onClick={handleDeleteRequest}
                aria-label={`Delete ${node.data.name}`}
                style={{ marginRight: "10px" }}
              >
                <DeleteForeverIcon
                  style={{ color: "#ff7043" }}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Add Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={showDeleteConfirmation}
          nodeId={node.id}
          nodeName={node.data.name}
          nodeType={node.data.type}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </>
    );
  }
);

TreeNodeComponent.displayName = "TreeNodeComponent";

/**
 * Wrapper component to maintain backward compatibility
 */
const TreeCustomizationNode = (props: TreeNodeProps) => {
  return <TreeNodeComponent {...props} />;
};

export default TreeCustomizationNode;
