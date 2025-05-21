import type { TreeNode } from "../types/types";

/**
 * Filters a tree by node name, retaining parent path if children match.
 */
export function filterTree(treeData: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return treeData;
  const q = query.toLowerCase();

  function recurse(nodes: TreeNode[]): TreeNode[] {
    return nodes
      .map((node) => {
        const children = node.children ? recurse(node.children) : [];

        // match by name or any label key/value
        const nameMatch = node.name.toLowerCase().includes(q);
        const labelMatch = node.labels.some(
          (lbl) =>
            lbl.key.toLowerCase().includes(q) ||
            lbl.value.toLowerCase().includes(q)
        );
        const match = nameMatch || labelMatch;

        return match || children.length ? { ...node, children } : null;
      })
      .filter((node): node is TreeNode => node !== null)
      .map((node) => {
        if (node) {
          return { ...node, children: node.children ?? [] };
        }
        throw new Error("Unexpected null node after filtering.");
      });
  }

  return recurse(treeData);
}

/**
 * Traverses the tree to find a node by its ID and execute a callback
 * @param nodes Tree nodes to search
 * @param nodeId ID of the node to find
 * @param callback Callback function to execute on the found node
 * @returns True if the node was found and callback executed, false otherwise
 */
export function traverseTree(
  nodes: TreeNode[],
  nodeId: string,
  callback: (node: TreeNode) => void
): boolean {
  for (const node of nodes) {
    if (node.id === nodeId) {
      callback(node);
      return true;
    }
    if (node.children && node.children.length > 0) {
      if (traverseTree(node.children, nodeId, callback)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Removes nodes with specified IDs from the tree and returns them
 */
export function removeNodesById(
  tree: TreeNode[],
  idsToRemove: string[]
): { updatedTree: TreeNode[]; removedNodes: TreeNode[] } {
  const removedNodes: TreeNode[] = [];

  function removeNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.filter((node) => {
      // If this is a target node, collect it and remove it
      if (idsToRemove.includes(node.id)) {
        removedNodes.push(JSON.parse(JSON.stringify(node)));
        return false;
      }

      // Process children recursively
      if (node.children?.length) {
        node.children = removeNodes(node.children);
      }

      return true;
    });
  }

  const updatedTree = removeNodes(JSON.parse(JSON.stringify(tree)));
  return { updatedTree, removedNodes };
}

/**
 * Finds a node and its parent in the tree by ID
 * @param nodes Tree nodes to search
 * @param id ID of the node to find
 * @returns Object containing the found node, its parent, and index in parent's children array
 */
export function findNodeWithParent(
  nodes: TreeNode[],
  id: string
): { node: TreeNode | null; parent: TreeNode | null; index: number } {
  function search(
    currentNodes: TreeNode[],
    parentNode: TreeNode | null
  ): { node: TreeNode | null; parent: TreeNode | null; index: number } {
    for (let i = 0; i < currentNodes.length; i++) {
      const currentNode = currentNodes[i];

      // If this is the target node, return it along with its parent
      if (currentNode.id === id) {
        return {
          node: currentNode,
          parent: parentNode,
          index: i,
        };
      }

      // Search children if they exist
      if (currentNode.children && currentNode.children.length > 0) {
        const result = search(currentNode.children, currentNode);
        if (result.node) {
          return result;
        }
      }
    }

    // Not found in this branch
    return { node: null, parent: null, index: -1 };
  }

  return search(nodes, null);
}

/**
 * Inserts nodes at the specified location in the tree
 */
export function insertNodes(
  tree: TreeNode[],
  nodesToInsert: TreeNode[],
  parentId: string | null,
  targetIndex: number
): TreeNode[] {
  const updatedTree = JSON.parse(JSON.stringify(tree));

  // Insert at root level if no parent specified
  if (parentId === null) {
    updatedTree.splice(targetIndex, 0, ...nodesToInsert);
    return updatedTree;
  }

  // Otherwise find parent and insert
  const { node: parentNode } = findNodeWithParent(updatedTree, parentId);

  if (parentNode) {
    // Initialize children array if it doesn't exist
    if (!parentNode.children) parentNode.children = [];
    // Insert the nodes
    parentNode.children.splice(targetIndex, 0, ...nodesToInsert);
  }

  return updatedTree;
}

/**
 * Removes nodes with specified IDs from the tree
 */
export function deleteNodesById(
  tree: TreeNode[],
  idsToDelete: string[]
): TreeNode[] {
  const treeData = JSON.parse(JSON.stringify(tree));
  const idsSet = new Set(idsToDelete);

  function removeNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.filter((node) => {
      // Remove this node if its ID is in the delete set
      if (idsSet.has(node.id)) {
        return false;
      }

      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children = removeNodes(node.children);
      }

      return true;
    });
  }

  return removeNodes(treeData);
}

/**
 * Creates a new folder node with the given properties
 */
export function createFolderNode(name: string = "New Node"): TreeNode {
  return {
    id: `folder-${Date.now()}`,
    name,
    type: "folder",
    labels: [],
    children: [],
  };
}

/**
 * Adds a node as a child of the specified parent node
 */
export function addNodeToParent(
  tree: TreeNode[],
  node: TreeNode,
  parentId: string | null
): { tree: TreeNode[]; success: boolean } {
  const newTree = JSON.parse(JSON.stringify(tree));

  // If no parent specified, add to root
  if (!parentId) {
    return { tree: [node, ...newTree], success: true };
  }

  const { node: parentNode } = findNodeWithParent(newTree, parentId);

  if (parentNode) {
    if (!parentNode.children) {
      parentNode.children = [];
    }

    parentNode.children = [node, ...parentNode.children];
    return { tree: newTree, success: true };
  }

  return { tree: newTree, success: false };
}

/**
 * Finds the path from root to a specified node
 * @returns Array of items representing the path (excluding the target node itself)
 */
export function findPathToNode(
  tree: TreeNode[],
  nodeId: string
): { id: string; name: string }[] {
  const result: { id: string; name: string }[] = [];

  function findPath(
    nodes: TreeNode[],
    targetId: string,
    currentPath: { id: string; name: string }[] = []
  ): boolean {
    for (const currentNode of nodes) {
      const pathItem = {
        id: currentNode.id,
        name: currentNode.name,
      };

      // If this is the node we're looking for, we found the path
      if (currentNode.id === targetId) {
        result.push(...currentPath);
        result.push(pathItem);
        return true;
      }

      // If this node has children, search them
      if (currentNode.children && currentNode.children.length > 0) {
        currentPath.push(pathItem);

        // Recursively search children
        const found = findPath(currentNode.children, targetId, currentPath);

        if (found) {
          return true;
        }

        // If not found in this branch, remove this node from path and continue with siblings
        currentPath.pop();
      }
    }

    return false;
  }

  findPath(tree, nodeId);
  return result;
}

/**
 * Finds a node by ID in the tree structure
 * @param nodes Tree nodes to search
 * @param id ID of the node to find
 * @returns The found node or null if not found
 */
export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  // Use findNodeWithParent and just return the node part
  const { node } = findNodeWithParent(nodes, id);
  return node;
}
