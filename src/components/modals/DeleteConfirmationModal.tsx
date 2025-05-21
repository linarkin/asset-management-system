import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import type { NodeType } from "../../types/types";

interface DeleteConfirmationModalProps {
  open: boolean;
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  nodeName,
  nodeType,
  onConfirm,
  onCancel,
}) => {
  const getWarningMessage = () => {
    switch (nodeType) {
      case "folder":
        return "This will delete the folder and all its contents, including any assets and datapoints inside.";
      case "asset":
        return "This will delete the asset and all its datapoints.";
      case "datapoint":
        return "This will delete the datapoint.";
      default:
        return "This will delete the selected item.";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
    >
      <DialogTitle
        id="delete-confirmation-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <WarningIcon color="warning" />
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-confirmation-dialog-description">
          Are you sure you want to delete <strong>{nodeName}</strong>?
          <br />
          {getWarningMessage()}
          <br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
