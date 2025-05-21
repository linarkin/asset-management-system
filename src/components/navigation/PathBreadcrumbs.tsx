import React, { useMemo, useState } from "react";
import {
  Breadcrumbs,
  Link,
  Box,
  Button,
  Tooltip,
  Snackbar,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import type { TreeNode } from "../../types/types";
import { findPathToNode } from "../../utils/treeOperationsHelper";

interface PathBreadcrumbsProps {
  node: TreeNode | null;
  treeData: TreeNode[];
  onNavigate?: (nodeId: string) => void;
}

const PathBreadcrumbs: React.FC<PathBreadcrumbsProps> = ({
  node,
  treeData,
  onNavigate,
}) => {
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const path = useMemo(() => {
    if (!node || !treeData || treeData.length === 0) return [];
    return findPathToNode(treeData, node.id);
  }, [node, treeData]);

  const pathString = useMemo(() => {
    if (path.length === 0) return node ? node.name : "";
    const pathNames = path.map((item) => item.name);
    return pathNames.join("/");
  }, [path, node]);

  const handleCopyPath = () => {
    navigator.clipboard
      .writeText(pathString)
      .then(() => {
        setShowCopyNotification(true);
      })
      .catch((err) => {
        console.error("Failed to copy path: ", err);
      });
  };

  const handleCloseNotification = () => {
    setShowCopyNotification(false);
  };

  if (!node) return null;

  return (
    <Box>
      <Box
        mb={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ flexGrow: 1, mr: 1 }}
        >
          {path.map((item, index) => (
            <Link
              key={item.id}
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate(item.id);
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {index === 0 && <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />}
              {item.name}
            </Link>
          ))}
        </Breadcrumbs>

        <Tooltip title="Copy path">
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyPath}
            sx={{ minWidth: "auto", py: 0.5 }}
          >
            Copy path
          </Button>
        </Tooltip>
      </Box>

      <Snackbar
        open={showCopyNotification}
        autoHideDuration={1500}
        onClose={handleCloseNotification}
        message="Path copied to clipboard"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseNotification}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default PathBreadcrumbs;
