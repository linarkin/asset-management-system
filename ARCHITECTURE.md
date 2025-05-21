# Architecture Overview

## Approach

Used a React + TypeScript with Vite for fast iteration.  
The UI is driven by a tree component ([react-arborist](https://github.com/brimdata/react-arborist)) to visualize and manipulate a hierarchical structure of folders, assets, and datapoints.  
State is persisted in `localStorage` via a `useLocalStorage` hook, enabling offline support and session restoration.

## Data Model

- **TreeNode**  
  • id: string  
  • name: string  
  • type: "folder" \| "asset" \| "datapoint"  
  • labels: Array<{ key: string; value: string }>  
  • children?: TreeNode[]

The tree is stored as an array of `TreeNode`, with recursion for nested children.

## Key Decisions & Trade-offs

- **react-arborist** ([github.com/brimdata/react-arborist](https://github.com/brimdata/react-arborist))  
  • Provides drag-drop and virtualization out of the box.  
  • Adds one more dependency but avoids custom tree logic.

I would got with MUI X Tree View but it's not free, therefore I chose `react-arborist` as best fitting for this task.

- **Refactoring**
  I run out of time to refactor the code further

## Future Improvements that I would add

### Accessibility

- **Keyboard Navigation**  
  Ensure full tree navigation via arrow keys, Home/End, and expand/collapse with Space/Enter.

- **UI/UX optimization**  
  Since I focused mostely on functionality I would improve styling and UI/UX.

### Performance Considerations

- **Debounced Search**  
  I wpould consider adding debounce for search input to avoid expensive filter operations on every keystroke.

- **Lazy Loading**  
  Plan to support on-demand loading of node children from a backend for very large datasets.

### Testing Strategy

- **Component Testing**
  - Use React Testing Library to assert rendering, interactions (expand/collapse, drag-drop), and edge cases.
- **End-to-End**
  - Integrate Cypress to cover common workflows: creating folders/assets, editing labels, and persistence.
