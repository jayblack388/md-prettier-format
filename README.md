# Markdown Prettier Format

Format Markdown files using Prettier. A lightweight formatter that respects your `.prettierrc` configuration.

## Features

- Format Markdown files on demand or on save
- Respects `.prettierrc` configuration files
- Supports range formatting (format selection)
- Zero configuration needed - works out of the box

## Installation

Search "Markdown Prettier Format" in the Cursor/VS Code Extensions panel.

Or install from [Open VSX](https://open-vsx.org/extension/jayblack388/md-prettier-format).

## Usage

1. Open a Markdown file
2. Format with:
   - **Cmd+Shift+F** (Mac) / **Ctrl+Shift+F** (Windows/Linux) to format the entire document
   - Right-click → "Format Document"
   - Or enable "Format on Save" in settings

## Configuration

### Extension Settings

- `md-prettier-format.enable`: Enable/disable the formatter (default: `true`)

### Prettier Configuration

The extension respects Prettier configuration files (`.prettierrc`, `.prettierrc.json`, etc.). Common options for Markdown:

```json
{
  "proseWrap": "always",
  "printWidth": 80,
  "tabWidth": 2
}
```

## Requirements

- No additional dependencies required (Prettier is bundled)

## License

MIT
