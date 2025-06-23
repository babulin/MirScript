import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { HighlightConfig, HighlightRule } from "./types";

export function activate(context: vscode.ExtensionContext) {
  console.log("文本高亮扩展已激活");

  let decorationTypes: Record<string, vscode.TextEditorDecorationType> = {};
  let decorationRegex: Record<string, vscode.TextEditorDecorationType> = {};
  let userRules: HighlightConfig = { rules: [] };
  let config: HighlightConfig = { rules: [] };
  // 加载配置文件
  const loadConfiguration = () => {
    //本地配置
    const configPath = path.join(context.extensionPath, "config", "rules.json");
    // 获取用户配置路径
    const userConfigPath = path.join(
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "",
      ".vscode",
      "rules.json"
    );

    try {
      // 先尝试读取用户配置

      if (fs.existsSync(userConfigPath)) {
        const userConfig = fs.readFileSync(userConfigPath, "utf-8");
        userRules = JSON.parse(userConfig) as HighlightConfig;
      }

      const rawData = fs.readFileSync(configPath, "utf-8");
      const loadedConfig = JSON.parse(rawData) as HighlightConfig;

      // 验证配置
      if (Array.isArray(loadedConfig.rules)) {
        config = loadedConfig;
        if (Array.isArray(userRules.rules)) {
          config.rules = [...loadedConfig.rules, ...userRules.rules];
        }
        console.log("高亮配置已加载:", config);

        // 清除旧的装饰器
        Object.values(decorationTypes).forEach((decoration) =>
          decoration.dispose()
        );
        decorationTypes = {};

        // 清除旧的装饰器
        Object.values(decorationRegex).forEach((decoration) =>
          decoration.dispose()
        );
        decorationRegex = {};

        // 为每个规则创建装饰器
        config.rules.forEach((rule) => {
          rule.text.forEach((text) => {
            decorationTypes[text] =
              vscode.window.createTextEditorDecorationType({
                color: rule.color,
                backgroundColor: rule.backgroundColor,
                fontWeight: rule.fontWeight,
                fontStyle: rule.fontStyle,
                border: rule.border,
                borderRadius: rule.borderRadius,
                overviewRulerColor: rule.color
              });
          });

          //正则表达式
          if (rule.regex) {
            rule.regex.forEach((text) => {
              decorationRegex[text] =
                vscode.window.createTextEditorDecorationType({
                  color: rule.color,
                  backgroundColor: rule.backgroundColor,
                  fontWeight: rule.fontWeight,
                  fontStyle: rule.fontStyle,
                  border: rule.border,
                  borderRadius: rule.borderRadius,
                  overviewRulerColor: rule.color
                });
            });
          }
        });
      } else {
        throw new Error("配置格式无效: rules 必须是数组");
      }
    } catch (error) {
      console.error("加载高亮配置失败:", error);
      vscode.window.showErrorMessage(
        `加载高亮配置失败: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  // 更新编辑器装饰
  const updateDecorations = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.fileName.endsWith(".txt")) {
      return;
    }

    const text = editor.document.getText();
    config.rules.forEach((rule) => {
      rule.text.forEach((ruleText) => {
        const decorations: vscode.DecorationOptions[] = [];
        const regex = new RegExp(escapeRegExp(ruleText), "g");
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text))) {
          const startPos = editor.document.positionAt(match.index);
          const endPos = editor.document.positionAt(
            match.index + match[0].length
          );

          decorations.push({
            range: new vscode.Range(startPos, endPos),
            hoverMessage: `高亮文本: ${ruleText}`
          });
        }

        if (decorationTypes[ruleText]) {
          editor.setDecorations(decorationTypes[ruleText], decorations);
        }
      });

      // 正则表达式
      if (rule.regex) {
        rule.regex.forEach((ruleText) => {
          const decorations: vscode.DecorationOptions[] = [];
          const regex = new RegExp(ruleText, "g");
          let match: RegExpExecArray | null;

          while ((match = regex.exec(text))) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(
              match.index + match[0].length
            );

            decorations.push({
              range: new vscode.Range(startPos, endPos),
              hoverMessage: `高亮文本: ${ruleText}`
            });
          }

          if (decorationRegex[ruleText]) {
            editor.setDecorations(decorationRegex[ruleText], decorations);
          }
        });
      }
    });
  };

  // 更新所有可见编辑器
  const updateAllEditors = () => {
    vscode.window.visibleTextEditors.forEach((editor) => {
      updateDecorations();
    });
  };

  // 转义正则特殊字符
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // 初始化
  loadConfiguration();

  // 监听配置变化
  const configPath = path.join(context.extensionPath, "config", "rules.json");
  const watcher = vscode.workspace.createFileSystemWatcher(configPath);

  // 监听配置变化
  const userPath = path.join(context.extensionPath, ".vscode", "rules.json");
  const userWatcher = vscode.workspace.createFileSystemWatcher(userPath);

  watcher.onDidChange(() => {
    loadConfiguration();
    updateAllEditors();
  });

  // 注册命令
  const reloadCommand = vscode.commands.registerCommand(
    "textHighlighter.reloadConfig",
    () => {
      loadConfiguration();
      vscode.window.showInformationMessage("高亮配置已重新加载");
      updateAllEditors();
    }
  );

  // 事件监听
  context.subscriptions.push(
    watcher,
    userWatcher,
    reloadCommand,
    vscode.window.onDidChangeActiveTextEditor(updateDecorations),
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === event.document) {
        updateDecorations();
      }
    })
  );

  // 初始更新
  updateAllEditors();
}

export function deactivate() {
  // 清理工作在装饰器存储中已经处理
}
