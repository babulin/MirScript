/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const path = __importStar(__webpack_require__(2));
const fs = __importStar(__webpack_require__(3));
function activate(context) {
    console.log("文本高亮扩展已激活");
    let decorationTypes = {};
    let config = { rules: [] };
    // 加载配置文件
    const loadConfiguration = () => {
        const configPath = path.join(context.extensionPath, "config", "rules.json");
        try {
            const rawData = fs.readFileSync(configPath, "utf-8");
            const loadedConfig = JSON.parse(rawData);
            // 验证配置
            if (Array.isArray(loadedConfig.rules)) {
                config = loadedConfig;
                console.log("高亮配置已加载:", config);
                // 清除旧的装饰器
                Object.values(decorationTypes).forEach((decoration) => decoration.dispose());
                decorationTypes = {};
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
                });
            }
            else {
                throw new Error("配置格式无效: rules 必须是数组");
            }
        }
        catch (error) {
            console.error("加载高亮配置失败:", error);
            vscode.window.showErrorMessage(`加载高亮配置失败: ${error instanceof Error ? error.message : String(error)}`);
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
                const decorations = [];
                const regex = new RegExp(escapeRegExp(ruleText), "g");
                let match;
                while ((match = regex.exec(text))) {
                    const startPos = editor.document.positionAt(match.index);
                    const endPos = editor.document.positionAt(match.index + match[0].length);
                    decorations.push({
                        range: new vscode.Range(startPos, endPos),
                        hoverMessage: `高亮文本: ${ruleText}`
                    });
                }
                if (decorationTypes[ruleText]) {
                    editor.setDecorations(decorationTypes[ruleText], decorations);
                }
            });
        });
    };
    // 更新所有可见编辑器
    const updateAllEditors = () => {
        vscode.window.visibleTextEditors.forEach((editor) => {
            updateDecorations();
        });
    };
    // 转义正则特殊字符
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };
    // 初始化
    loadConfiguration();
    // 监听配置变化
    const configPath = path.join(context.extensionPath, "config", "rules.json");
    const watcher = vscode.workspace.createFileSystemWatcher(configPath);
    watcher.onDidChange(() => {
        loadConfiguration();
        updateAllEditors();
    });
    // 注册命令
    const reloadCommand = vscode.commands.registerCommand("textHighlighter.reloadConfig", () => {
        loadConfiguration();
        vscode.window.showInformationMessage("高亮配置已重新加载");
        updateAllEditors();
    });
    // 事件监听
    context.subscriptions.push(watcher, reloadCommand, vscode.window.onDidChangeActiveTextEditor(updateDecorations), vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            updateDecorations();
        }
    }));
    // 初始更新
    updateAllEditors();
}
function deactivate() {
    // 清理工作在装饰器存储中已经处理
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map