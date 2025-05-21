import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Label } from "../../types/types";

interface LabelEditorProps {
  labels: Label[];
  onSave: (labels: Label[]) => void;
  onCancel: () => void;
  nodeId: string;
}

const LabelEditor: React.FC<LabelEditorProps> = ({
  labels,
  onSave,
  onCancel,
  nodeId,
}) => {
  const [editedLabels, setEditedLabels] = useState<Label[]>([...labels]);
  const [newLabelKey, setNewLabelKey] = useState("");
  const [newLabelValue, setNewLabelValue] = useState("");
  const [labelKeyError, setLabelKeyError] = useState("");

  const prevNodeIdRef = useRef(nodeId);

  useEffect(() => {
    if (prevNodeIdRef.current !== nodeId) {
      onCancel();
    }
    prevNodeIdRef.current = nodeId;
  }, [nodeId, onCancel]);

  const handleSaveLabels = () => {
    onSave(editedLabels);
  };

  const handleAddLabel = () => {
    if (newLabelKey.trim() === "") {
      setLabelKeyError("Key cannot be empty");
      return;
    }
    if (editedLabels.some((label) => label.key === newLabelKey.trim())) {
      setLabelKeyError("Key already exists");
      return;
    }
    const newLabel: Label = {
      key: newLabelKey.trim(),
      value: newLabelValue.trim(),
    };
    setEditedLabels([...editedLabels, newLabel]);
    setNewLabelKey("");
    setNewLabelValue("");
    setLabelKeyError("");
  };
  const handleDeleteLabel = (keyToDelete: string) => {
    setEditedLabels(editedLabels.filter((label) => label.key !== keyToDelete));
  };

  const handleEditLabel = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const updatedLabels = [...editedLabels];

    if (
      field === "key" &&
      newValue.trim() !== updatedLabels[index].key &&
      updatedLabels.some((label) => label.key === newValue.trim())
    ) {
      setLabelKeyError("Key already exists");
      return;
    }
    updatedLabels[index] = {
      ...updatedLabels[index],
      [field]: newValue.trim(),
    };
    setEditedLabels(updatedLabels);
    setLabelKeyError("");
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, mb: 2 }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Edit Labels
      </Typography>

      {editedLabels.length > 0 ? (
        <Stack spacing={2} mb={2}>
          {editedLabels.map((label, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Key"
                size="small"
                value={label.key}
                onChange={(e) => handleEditLabel(index, "key", e.target.value)}
                error={labelKeyError !== "" && label.key === ""}
                helperText={
                  labelKeyError !== "" && label.key === "" ? labelKeyError : ""
                }
                sx={{ flex: 1 }}
              />
              <TextField
                label="Value"
                size="small"
                value={label.value}
                onChange={(e) =>
                  handleEditLabel(index, "value", e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                color="error"
                onClick={() => handleDeleteLabel(label.key)}
                sx={{ alignSelf: "center" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" mb={2}>
          No labels yet. Add one below.
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="New Key"
          size="small"
          value={newLabelKey}
          error={!!labelKeyError}
          helperText={labelKeyError}
          onChange={(e) => {
            setNewLabelKey(e.target.value);
            if (e.target.value.trim() !== "") setLabelKeyError("");
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="New Value"
          size="small"
          value={newLabelValue}
          onChange={(e) => setNewLabelValue(e.target.value)}
          sx={{ flex: 1 }}
        />
        <IconButton
          color="success"
          onClick={handleAddLabel}
          disabled={!newLabelKey.trim()}
          sx={{ alignSelf: "center" }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          startIcon={<CancelIcon />}
          onClick={() => onCancel()}
          size="small"
        >
          Cancel
        </Button>
        <Button
          startIcon={<SaveIcon />}
          onClick={handleSaveLabels}
          variant="contained"
          color="primary"
          size="small"
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default LabelEditor;
