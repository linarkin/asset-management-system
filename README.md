# Application for managing assets

A React & TypeScript-based asset management system to create, organize and track a hierarchy of folders, assets, and datapoints with labeling and search.

You can see a walkthrough video of the application here - https://youtu.be/7nyTPEf5Njs

### Short description

Important points:

- New Node is creatable only in another Node.
- Asset is creatable only in Node.
- Datapoints are connected to Assets and cannot be moved in isolation, only with their parent asset. It's possible to create a datapoint only in Asset.
- All Nodes, Assets and Datapoints have labels, they are shown in the overview pannel.
- User can copy path of selected Item
- User can delete any Item by clicking on a "Bin" icon on hover. After confirming deletion it will be deleted without recovery.

## Architecture

For a high-level overview, data model, and key trade-offs, see [Architecture Overview](./ARCHITECTURE.md).

## Getting Started

### Installation

```bash
# Clone the repo
git clone https://github.com/your-repo/asset-management-system.git
cd asset-management-system

# Install dependencies
yarn
```

### Running the App

```bash
# Run application
yarn dev
```

Open http://localhost:5173 in your browser.

### Building for Production

```bash
yarn build
```
