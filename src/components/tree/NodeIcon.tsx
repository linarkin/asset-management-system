import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";

export type NodeType = "folder" | "asset" | "datapoint";

interface NodeIconProps {
  type: NodeType;
  size?: number;
  color?: string;
}

const NodeIcon: React.FC<NodeIconProps> = ({ type, size = 24 }) => {
  const style = { fontSize: size };
  switch (type) {
    case "folder":
      return <FolderIcon style={{ ...style, color: "#ffc107" }} />;
    case "asset":
      return <DescriptionIcon style={{ ...style, color: "#3f50b5" }} />;
    case "datapoint":
      return (
        <SettingsInputComponentIcon style={{ ...style, color: "#757575" }} />
      );
    default:
      return null;
  }
};

export default NodeIcon;
