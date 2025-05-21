# Solution overview

### Considered solutions

#### ❌ Write everything from scratch

Very expensive, hard to maintain, unless its core feature of business and flexibility is critical.

#### ⚠️ Ant Design x Tree

Very strong option, but I saw that you don't use the Ant Design library, so I wanted to not pull a huge dependency in this case. And flexibility for given requirements was questionable.

#### ⚠️ Material Design x Tree View

A preferable solution, but a sortable feature is not for free. If I had a chance, I'd vote to consider it before doing anything on our own to save time and money.

#### ✅ Selected approach - [React Arborist](https://github.com/brimdata/react-arborist)

Pros:

- Actively maintained
- Has almost all required features and leaves some room for flexibility
- Controlled mode is good to sync the Tree view with the Details overview panel

Cons:

- Uncontrolled mode is great and easy to implement, but it doesn't fit the requirements
- Controlled mode is somewhat development-intensive

### Architecture

- Architecture revolves around [React Arborist](https://github.com/brimdata/react-arborist)

- Data model:

  - Every tree element implements the [`TreeNode`](./src/types/types.ts) interface:  
    `{ id, name, type: "folder" | "asset" | "datapoint", labels: Label[], children?: TreeNode[] }`
  - The detailed overview data model is pretty straightforward:
    - `[DatapointInput]` (`{ id: string; name: string }`)
    - `[Label]` (`{ key: string; value: string }`)
    - Breadcrumbs: a path array of `{ id: string; name: string }`

- State Persistence
  - The entire tree and the current selection are persisted to `localStorage`

> This structure gives us an **extensible** and **scalable** tree UI with full CRUD, drag-and-drop, search, inline editing, and label management with state persistence.

## Assumptions

- Code quality and maintainability come first, as there were no performance requirements
- UI crispness was not a priority; the thought-through and working solution is more important

# Further work

### Accessibility

- **Keyboard Navigation**  
  Ensure full tree navigation via arrow keys, Home/End, and expand/collapse with Space/Enter.

- **UI/UX optimization**  
  Improve styling and UI/UX.

### Performance Considerations

- **Debounced Search**  
  Consider adding debounce for the search input to avoid expensive filter operations on every keystroke.

- **Lazy Loading**  
  Plan to support on-demand loading of node children from a backend for large datasets.

### Testing Strategy

- **Component Testing**
  - Use React Testing Library to assert rendering, interactions (expand/collapse, drag-drop), and edge cases.
- **End-to-End**
  - Integrate Cypress to cover common workflows: creating folders/assets, editing labels, and persistence.
