import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DatapointManager from "../datapoints/DatapointManager";
import type { DatapointInput } from "../../types/types";

interface AssetCreationSectionProps {
  parentId: string;
  onCreateAsset: (
    parentId: string,
    assetName: string,
    datapoints: DatapointInput[]
  ) => void;
}

interface AssetFormState {
  isCreating: boolean;
  assetName: string;
  nameError: string;
  datapoints: DatapointInput[];
}

const AssetCreationSection: React.FC<AssetCreationSectionProps> = ({
  parentId,
  onCreateAsset,
}) => {
  const [formState, setFormState] = useState<AssetFormState>({
    isCreating: false,
    assetName: "",
    nameError: "",
    datapoints: [],
  });

  const resetForm = () => {
    setFormState({
      isCreating: false,
      assetName: "",
      nameError: "",
      datapoints: [],
    });
  };

  const handleCreateAssetClick = () => {
    setFormState((prev) => ({
      ...prev,
      isCreating: true,
      assetName: "",
      nameError: "",
      datapoints: [],
    }));
  };

  const handleAssetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      assetName: value,
      nameError: value.trim() === "" ? "Asset name cannot be empty" : "",
    }));
  };

  const handleCreateAsset = () => {
    if (formState.assetName.trim() === "") {
      setFormState((prev) => ({
        ...prev,
        nameError: "Asset name cannot be empty",
      }));
      return;
    }

    onCreateAsset(parentId, formState.assetName.trim(), formState.datapoints);
    resetForm();
  };

  const handleManageDatapoints = (updatedDatapoints: DatapointInput[]) => {
    setFormState((prev) => ({
      ...prev,
      datapoints: updatedDatapoints,
    }));
  };

  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Assets
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        {formState.isCreating ? (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              width: "100%",
              bgcolor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Create New Asset
            </Typography>
            <TextField
              label="Asset Name"
              variant="outlined"
              size="small"
              fullWidth
              value={formState.assetName}
              onChange={handleAssetNameChange}
              error={!!formState.nameError}
              helperText={formState.nameError}
              autoFocus
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <DatapointManager
              datapoints={formState.datapoints}
              onUpdateDatapoints={handleManageDatapoints}
              variant="delete"
              parentId={""}
            />

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end">
              <Button onClick={resetForm} size="small" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateAsset}
                variant="contained"
                color="primary"
                size="small"
                disabled={!formState.assetName.trim() || !!formState.nameError}
              >
                Create
              </Button>
            </Box>
          </Paper>
        ) : (
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleCreateAssetClick}
            variant="outlined"
            color="primary"
            size="small"
          >
            Add Asset
          </Button>
        )}
      </Box>
    </>
  );
};

export default AssetCreationSection;
