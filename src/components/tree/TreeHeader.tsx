import React from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "../../pages/HomePage.module.css";

interface TreeHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateFolder: () => void;
  createDisabled?: boolean;
}

const TreeHeader: React.FC<TreeHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCreateFolder,
  createDisabled = false,
}) => {
  const handleClear = () => {
    onSearchChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Box className={styles.treeSectionHeader}>
      <Typography variant="subtitle2">Folder Structure</Typography>
      <Box display="flex" alignItems="center">
        <TextField
          placeholder="Search..."
          size="small"
          value={searchQuery}
          onChange={onSearchChange}
          sx={{ mr: 1 }}
          InputProps={{
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />
        <Tooltip title="Create new node">
          <IconButton
            color="primary"
            onClick={onCreateFolder}
            size="small"
            disabled={createDisabled}
          >
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TreeHeader;
