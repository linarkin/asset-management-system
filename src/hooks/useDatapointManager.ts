import { useState, useEffect, useCallback } from "react";
import { useTreeOperations } from "./useTreeManager";
import type { DatapointInput } from "../types/types";

interface UseDatapointManagerProps {
  parentId: string;
  datapoints: DatapointInput[];
  onUpdateDatapoints: (datapoints: DatapointInput[]) => void;
}

export function useDatapointManager({
  parentId,
  datapoints,
  onUpdateDatapoints,
}: UseDatapointManagerProps) {
  const [isAddingDatapoint, setIsAddingDatapoint] = useState(false);
  const [localDatapoints, setLocalDatapoints] = useState<DatapointInput[]>([]);
  const { handleManageDatapoints, treeRef } = useTreeOperations();

  useEffect(() => {
    setLocalDatapoints(datapoints);
  }, [datapoints]);

  const handleAddDatapointClick = () => {
    setIsAddingDatapoint(true);
  };

  const handleAddDatapoint = useCallback(
    (name: string) => {
      const newDatapoint = {
        id: `datapoint-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name,
      };

      const updatedDatapoints = [...localDatapoints, newDatapoint];
      setLocalDatapoints(updatedDatapoints);
      handleManageDatapoints(parentId, newDatapoint);

      onUpdateDatapoints(updatedDatapoints);

      if (treeRef.current) {
        const assetNode = treeRef.current.get(parentId);
        if (assetNode && !assetNode.isOpen) {
          setTimeout(() => {
            assetNode.open();
          }, 50);
        }
      }

      setIsAddingDatapoint(false);
    },
    [
      localDatapoints,
      handleManageDatapoints,
      parentId,
      onUpdateDatapoints,
      treeRef,
    ]
  );

  const handleCancelAddDatapoint = () => {
    setIsAddingDatapoint(false);
  };

  const handleRemoveDatapoint = useCallback(
    (id: string) => {
      const updatedDatapoints = localDatapoints.filter((dp) => dp.id !== id);
      setLocalDatapoints(updatedDatapoints);
      handleManageDatapoints(parentId, updatedDatapoints);
      onUpdateDatapoints(updatedDatapoints);
    },
    [localDatapoints, handleManageDatapoints, parentId, onUpdateDatapoints]
  );

  const handleEditDatapoint = useCallback(
    (id: string, newName: string) => {
      const updatedDatapoints = localDatapoints.map((dp) =>
        dp.id === id ? { ...dp, name: newName } : dp
      );
      setLocalDatapoints(updatedDatapoints);
      handleManageDatapoints(parentId, { id, name: newName });
      onUpdateDatapoints(updatedDatapoints);
    },
    [localDatapoints, handleManageDatapoints, parentId, onUpdateDatapoints]
  );

  const [newDatapointName, setNewDatapointName] = useState("");
  const [datapointError, setDatapointError] = useState("");

  const handleDatapointNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setNewDatapointName(val);
    if (val.trim() === "") {
      setDatapointError("Datapoint name cannot be empty");
    } else if (
      localDatapoints.some(
        (dp) => dp.name.toLowerCase() === val.trim().toLowerCase()
      )
    ) {
      setDatapointError("Datapoint name must be unique");
    } else {
      setDatapointError("");
    }
  };

  const confirmAddDatapoint = () => {
    if (newDatapointName.trim() === "" || datapointError) {
      if (!newDatapointName.trim())
        setDatapointError("Datapoint name cannot be empty");
      return;
    }
    handleAddDatapoint(newDatapointName.trim());
    setNewDatapointName("");
    setDatapointError("");
  };

  return {
    isAddingDatapoint,
    localDatapoints,
    handleAddDatapointClick,
    handleAddDatapoint,
    handleCancelAddDatapoint,
    handleRemoveDatapoint,
    handleEditDatapoint,
    newDatapointName,
    datapointError,
    handleDatapointNameChange,
    confirmAddDatapoint,
  };
}
