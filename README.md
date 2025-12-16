# JSON Editor React

A lightweight, interactive React component for viewing and editing JSON data in a beautiful tree structure.

## Features

- Interactive tree view with expand/collapse
- Inline editing with type preservation
- Read-only and edit modes
- Syntax highlighting
- Role-based permissions
- Responsive design
- TypeScript support

## Installation

```bash
npm i @fieldreports/json-editor-react
```

## Usage

```jsx
import JsonTreeEditor from '@fieldreports/json-editor-react';

function App() {
  const data = {
    name: "John Doe",
    age: 30,
    isActive: true,
    address: {
      city: "New York",
      zip: "10001"
    },
    hobbies: ["reading", "coding"]
  };

  const handleSave = (updatedData) => {
    console.log('Data saved:', updatedData);
  };

  return (
    <div style={{ height: '600px' }}>
      <JsonTreeEditor
        initialData={data}
        fileName="user-data.json"
        onSave={handleSave}
        onClose={() => console.log('Editor closed')}
        userRole="Admin"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialData` | `any` | **required** | JSON object to display and edit |
| `fileName` | `string` | `"data.json"` | Display name for the file |
| `onSave` | `(data: any) => void` | `undefined` | Callback when save button is clicked |
| `onClose` | `() => void` | `undefined` | Callback for close button |
| `userRole` | `string` | `"User"` | User role for permissions (only "Admin" can edit) |
| `customUserId` | `string` | `undefined` | Custom user ID for header updates |
| `customUsername` | `string` | `undefined` | Custom username for header updates |

## Features in Detail

### Edit Mode
Only users with `userRole="Admin"` can toggle edit mode. Click the edit icon to enable editing.

### Type Preservation
When editing values, the component maintains the original data type:
- Strings remain strings
- Numbers remain numbers
- Booleans remain booleans
- Arrays and objects can be edited as JSON

### Header Protection
If your data has a `header` object, only the `identifier` field is editable. Other header fields are read-only.

## Styling

The component uses Tailwind CSS classes. Make sure your project has Tailwind CSS configured, or the component will use inline styles as fallback.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Bizframe

## Repository

https://github.com/bizframe/json-editor-react