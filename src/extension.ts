import * as vscode from 'vscode';

// Lazy load prettier to avoid blocking activation
let prettierModule: typeof import('prettier') | null = null;

async function getPrettier(): Promise<typeof import('prettier')> {
  if (!prettierModule) {
    prettierModule = await import('prettier');
  }
  return prettierModule;
}

export function activate(context: vscode.ExtensionContext) {
  try {
    const formatter = vscode.languages.registerDocumentFormattingEditProvider(
      { language: 'markdown', scheme: 'file' },
      new MarkdownFormattingProvider()
    );

    const rangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: 'markdown', scheme: 'file' },
      new MarkdownFormattingProvider()
    );

    context.subscriptions.push(formatter, rangeFormatter);

    vscode.window.showInformationMessage('md-prettier-format: Activated!');
  } catch (error) {
    vscode.window.showErrorMessage(`md-prettier-format activation failed: ${error}`);
  }
}

class MarkdownFormattingProvider
  implements
    vscode.DocumentFormattingEditProvider,
    vscode.DocumentRangeFormattingEditProvider
{
  async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const config = vscode.workspace.getConfiguration('md-prettier-format');
    if (!config.get('enable', true)) {
      return [];
    }

    try {
      const text = document.getText();
      const formatted = await this.formatText(text, document.uri.fsPath, options);

      if (formatted === text) {
        return [];
      }

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );

      return [vscode.TextEdit.replace(fullRange, formatted)];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      vscode.window.showErrorMessage(`Markdown formatting failed: ${message}`);
      return [];
    }
  }

  async provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const config = vscode.workspace.getConfiguration('md-prettier-format');
    if (!config.get('enable', true)) {
      return [];
    }

    try {
      const text = document.getText(range);
      const formatted = await this.formatText(text, document.uri.fsPath, options);

      if (formatted === text) {
        return [];
      }

      return [vscode.TextEdit.replace(range, formatted)];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      vscode.window.showErrorMessage(`Markdown formatting failed: ${message}`);
      return [];
    }
  }

  private async formatText(
    text: string,
    filePath: string,
    options: vscode.FormattingOptions
  ): Promise<string> {
    const prettier = await getPrettier();
    
    // Try to resolve prettier config from the file's location
    const prettierConfig = await prettier.resolveConfig(filePath);

    const formatted = await prettier.format(text, {
      ...prettierConfig,
      parser: 'markdown',
      tabWidth: options.tabSize,
      useTabs: !options.insertSpaces,
    });

    return formatted;
  }
}

export function deactivate() {}
