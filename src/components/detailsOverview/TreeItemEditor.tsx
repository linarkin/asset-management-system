import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface NameEditorProps {
  name: string;
  onRename?: (newName: string) => void;
  readOnly?: boolean;
}

const NameEditor: React.FC<NameEditorProps> = ({
  name,
  onRename,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleEditClick = () => {
    setNewName(name);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onRename && newName.trim() !== "") {
      onRename(newName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(name);
  };

  if (isEditing) {
    return (
      <Box display="flex" alignItems="center" flexGrow={1}>
        <TextField
          size="small"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
          fullWidth
          sx={{ mx: 1 }}
        />
        <Button
          size="small"
          onClick={handleSave}
          variant="contained"
          sx={{ mr: 1 }}
        >
          Save
        </Button>
        <Button size="small" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="h6" component={"h2"} sx={{ ml: 1 }}>
        {name}
      </Typography>
      {!readOnly && onRename && (
        <IconButton size="small" onClick={handleEditClick} sx={{ ml: 1 }}>
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default NameEditor;
