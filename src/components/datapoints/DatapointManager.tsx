import React, { useState } from "react";
import type { DatapointInput } from "../../types/types";
import {
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useDatapointManager } from "../../hooks/useDatapointManager";

const DatapointManager: React.FC<{
  datapoints: DatapointInput[];
  onUpdateDatapoints: (dps: DatapointInput[]) => void;
  title?: string;
  readOnly?: boolean;
  parentId: string;
}> = ({
  datapoints,
  onUpdateDatapoints,
  title = "Datapoints",
  readOnly = false,
  parentId,
}) => {
  const {
    isAddingDatapoint,
    localDatapoints,
    handleAddDatapointClick,
    handleCancelAddDatapoint,
    handleEditDatapoint,
    newDatapointName,
    datapointError,
    handleDatapointNameChange,
    confirmAddDatapoint,
  } = useDatapointManager({ parentId, datapoints, onUpdateDatapoints });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const startEdit = (dp: DatapointInput) => {
    setEditingId(dp.id);
    setDraftName(dp.name);
  };
  const saveEdit = (id: string) => {
    handleEditDatapoint(id, draftName);
    setEditingId(null);
  };
  const cancelEdit = () => setEditingId(null);

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>

      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap" }}>
        {localDatapoints.map((dp) => (
          <Box key={dp.id} sx={{ mr: 1, mb: 1 }}>
            {editingId === dp.id ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  size="small"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  autoFocus
                  sx={{ mr: 1 }}
                />
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => saveEdit(dp.id)}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={cancelEdit}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Chip
                label={dp.name}
                size="small"
                variant="outlined"
                onDelete={
                  readOnly
                    ? undefined
                    : () => (readOnly ? undefined : startEdit(dp))
                }
                deleteIcon={<EditIcon fontSize="small" />}
              />
            )}
          </Box>
        ))}
      </Box>

      {!readOnly && (
        <>
          {isAddingDatapoint ? (
            <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
              <TextField
                label="Datapoint Name"
                size="small"
                value={newDatapointName}
                onChange={handleDatapointNameChange}
                error={!!datapointError}
                helperText={datapointError}
                autoFocus
                sx={{ mr: 1 }}
              />
              <IconButton
                size="small"
                color="success"
                onClick={confirmAddDatapoint}
                disabled={!!datapointError || !newDatapointName.trim()}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleCancelAddDatapoint}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddDatapointClick}
              variant="outlined"
              size="small"
              sx={{ mb: 2, maxWidth: "200px" }}
            >
              Add Datapoint
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default DatapointManager;
