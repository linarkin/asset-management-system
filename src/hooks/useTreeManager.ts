import { useCallback, useRef, useEffect, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";
import {
  removeNodesById,
  insertNodes,
  deleteNodesById,
  createFolderNode,
  addNodeToParent,
  findNodeById,
  traverseTree,
} from "../utils/treeOperationsHelper";
import type { TreeNode, Label } from "../types/types";
import cloneDeep from "lodash/cloneDeep";

const TREE_DATA_STORAGE_KEY = "asset-management-tree-data";
const SELECTED_ID_STORAGE_KEY = "asset-management-selected-id";

interface MoveParams {
  dragIds: string[];
  parentId: string | null;
  index: number;
}

interface DeleteParams {
  ids: string[];
}

export function useTreeOperations() {
  const [treeData, setTreeData] = useLocalStorage<TreeNode[]>(
    TREE_DATA_STORAGE_KEY,
    []
  );
  const [selectedId, setSelectedId] = useLocalStorage<string | null>(
    SELECTED_ID_STORAGE_KEY,
    null
  );
  const treeRef = useRef<any>(null);

  const didInitRef = useRef(false);

  // on first data load, restore stored selection or pick first node
  useEffect(() => {
    if (didInitRef.current || treeData.length === 0) return;
    didInitRef.current = true;
    const targetId =
      selectedId && treeRef.current?.get(selectedId)
        ? selectedId
        : treeData[0].id;
    setSelectedId(targetId);
    // expand, select and scroll
    const api = treeRef.current?.get(targetId);
    if (api) {
      treeRef.current.select(targetId);
      let curr = api;
      while (curr.parent) {
        curr.parent.open();
        curr = curr.parent;
      }
      treeRef.current.scrollTo(targetId);
    }
  }, [treeData, selectedId, setSelectedId]);

  // Whenever selectedId changes, re-open & scroll into view
  useEffect(() => {
    if (!selectedId) return;
    const api = treeRef.current?.get(selectedId);
    if (api) {
      treeRef.current.select(selectedId);
      let curr = api;
      while (curr.parent) {
        curr.parent.open();
        curr = curr.parent;
      }
      treeRef.current.scrollTo(selectedId);
    }
  }, [selectedId]);

  const selectedNode = useMemo(
    () => (selectedId ? findNodeById(treeData, selectedId) : null),
    [treeData, selectedId]
  );

  const updateTreeData = useCallback(
    (processor: (draft: TreeNode[]) => TreeNode[]) => {
      setTreeData((prev) => processor(cloneDeep(prev)));
    },
    [setTreeData]
  );

  const handleMove = useCallback(
    ({ dragIds, parentId, index }: MoveParams) => {
      if (
        (parentId && findNodeById(treeData, parentId)?.type === "asset") ||
        (parentId === null &&
          dragIds.some((id) => findNodeById(treeData, id)?.type === "asset"))
      ) {
        return;
      }

      updateTreeData((draft) => {
        const { updatedTree, removedNodes } = removeNodesById(draft, dragIds);
        return insertNodes(updatedTree, removedNodes, parentId, index);
      });

      // after move, select the moved item
      if (dragIds.length > 0) {
        const movedId = dragIds[0];
        setSelectedId(movedId);
        treeRef.current?.select(movedId);
      }
    },
    [treeData, updateTreeData]
  );

  const handleDelete = useCallback(
    ({ ids }: DeleteParams) =>
      ids.length > 0 && updateTreeData((draft) => deleteNodesById(draft, ids)),
    [updateTreeData]
  );

  const handleSelect = useCallback((nodes: TreeNode[]) => {
    const id = nodes[0]?.id ?? null;
    setSelectedId(id);
  }, []);

  const handleCreateFolder = useCallback(() => {
    const newFolder = createFolderNode();

    // if tree is empty, add as root
    if (treeData.length === 0) {
      updateTreeData(() => [newFolder]);
      setSelectedId(newFolder.id);
      return newFolder.id;
    }

    // otherwise only add under a selected folder
    if (selectedNode?.type !== "folder") return;
    updateTreeData(
      (draft) => addNodeToParent(draft, newFolder, selectedId).tree
    );
    treeRef.current?.get(selectedId)?.open();
    return newFolder.id;
  }, [treeData, selectedId, selectedNode, updateTreeData, setSelectedId]);

  const handleNodeRename = useCallback(
    (nodeId: string, newName: string) =>
      updateTreeData((draft) => {
        traverseTree(draft, nodeId, (node) => (node.name = newName));
        return draft;
      }),
    [updateTreeData]
  );

  const handleCreateAsset = useCallback(
    (
      parentId: string,
      assetName: string,
      datapoints: { id: string; name: string }[] = []
    ) => {
      const newAsset: TreeNode = {
        id: `asset-${Date.now()}`,
        name: assetName,
        type: "asset",
        labels: [],
        children: datapoints.map((dp) => ({
          id: dp.id,
          name: dp.name,
          type: "datapoint",
          labels: [],
        })),
      };
      updateTreeData((draft) => {
        traverseTree(draft, parentId, (node) => {
          node.children = [newAsset, ...(node.children ?? [])];
        });
        return draft;
      });
      treeRef.current?.get(parentId)?.open();
    },
    [updateTreeData]
  );

  const handleNavigate = useCallback((nodeId: string) => {
    const nodeApi = treeRef.current?.get(nodeId);
    if (!nodeApi) return;
    setSelectedId(nodeId);
    treeRef.current.select(nodeId);
    let curr = nodeApi;
    while (curr.parent) {
      curr.parent.open();
      curr = curr.parent;
    }
    treeRef.current.scrollTo(nodeId);
  }, []);

  const handleManageDatapoints = useCallback(
    (
      nodeId: string,
      datapoints: { id: string; name: string }[] | { id: string; name: string }
    ) => {
      const updates = Array.isArray(datapoints) ? datapoints : [datapoints];
      updateTreeData((draft) => {
        traverseTree(draft, nodeId, (node) => {
          if (node.type === "asset") {
            const existing = new Map(
              node.children?.map((c) => [c.id, c]) ?? []
            );
            node.children = [
              ...updates.map((dp) => ({
                id: dp.id,
                name: dp.name,
                type: "datapoint" as const,
                labels: [],
              })),
              ...Array.from(existing.values()).filter(
                (c) => !updates.some((u) => u.id === c.id)
              ),
            ];
          }
        });
        return draft;
      });
    },
    [updateTreeData]
  );

  const handleUpdateLabels = useCallback(
    (nodeId: string, newLabels: Label[]) =>
      updateTreeData((draft) => {
        traverseTree(draft, nodeId, (node) => (node.labels = newLabels));
        return draft;
      }),
    [updateTreeData]
  );

  return {
    treeData,
    setTreeData: updateTreeData,
    selectedNode,
    treeRef,
    handleMove,
    handleDelete,
    handleSelect,
    handleCreateFolder,
    handleNodeRename,
    handleCreateAsset,
    handleNavigate,
    handleManageDatapoints,
    handleUpdateLabels,
  };
}
