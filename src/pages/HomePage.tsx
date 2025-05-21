import React, { useState, useMemo } from "react";
import TreeHeader from "../components/tree/TreeHeader";
import { Box } from "@mui/material";
import { Tree } from "react-arborist";
import styles from "./HomePage.module.css";
import TreeNode from "../components/tree/TreeNode";
import { useTreeOperations } from "../hooks/useTreeManager";
import DetailsOverview from "../components/detailsOverview/detailsOverview";
import { filterTree } from "../utils/treeOperationsHelper";
import { useElementSize } from "../hooks/useElementSize";

const HomePage: React.FC = () => {
  const {
    treeData,
    treeRef,
    selectedNode,
    handleMove,
    handleDelete,
    handleSelect,
    handleCreateFolder,
    handleNodeRename,
    handleCreateAsset,
    handleNavigate,
    handleManageDatapoints,
    handleUpdateLabels,
  } = useTreeOperations();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(
    () => filterTree(treeData, searchQuery),
    [treeData, searchQuery]
  );

  const [treeContainerRef, { width: treeWidth, height: treeHeight }] =
    useElementSize();

  return (
    <Box className={styles.treeContainer}>
      <Box display="flex" flexDirection="row" sx={{ height: "100%" }}>
        <Box
          flex={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 100px)",
            overflow: "hidden",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <TreeHeader
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onCreateFolder={handleCreateFolder}
            createDisabled={
              selectedNode?.type === "asset" ||
              selectedNode?.type === "datapoint"
            }
          />

          <Box
            ref={treeContainerRef}
            sx={{
              flexGrow: 1,
              overflow: "auto",
              width: "100%",
            }}
          >
            <Tree
              ref={treeRef}
              data={filteredData}
              onMove={handleMove}
              width={treeWidth || 600}
              height={treeHeight || 700}
              indent={24}
              rowHeight={36}
              childrenAccessor="children"
              onSelect={handleSelect}
              className="no-outline-tree"
              selection={selectedNode?.id || ""}
              disableDrag={(node) => node.type === "datapoint"}
            >
              {(props) => (
                <TreeNode
                  onDelete={handleDelete}
                  {...props}
                  dragHandle={props.dragHandle as React.Ref<any>}
                />
              )}
            </Tree>
          </Box>
        </Box>

        <Box
          flex={1}
          px={3}
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <DetailsOverview
            node={selectedNode}
            treeData={treeData}
            onNavigate={handleNavigate}
            onUpdateDatapoints={handleManageDatapoints}
            onRename={handleNodeRename}
            onCreateAsset={handleCreateAsset}
            onUpdateLabels={handleUpdateLabels}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
