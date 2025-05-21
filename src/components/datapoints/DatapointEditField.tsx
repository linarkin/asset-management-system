import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface DatapointEditFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const DatapointEditField: React.FC<DatapointEditFieldProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        size="small"
        value={value}
        onChange={onChange}
        autoFocus
        variant="outlined"
        sx={{ maxWidth: "150px" }}
      />
      <IconButton size="small" onClick={onSave}>
        <CheckIcon fontSize="small" color="success" />
      </IconButton>
      <IconButton size="small" onClick={onCancel}>
        <CloseIcon fontSize="small" color="error" />
      </IconButton>
    </Box>
  );
};

export default DatapointEditField;
