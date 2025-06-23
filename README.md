# mirscript README

这是一个最先用于传奇脚本编辑器的文案高亮提示插件

### 运行打包发布
```
yarn install
vcscode F5 运行
ctrl+shift+p 重新加载高亮配置
vsce package
```

## Features

目前只是匹配规则的文案来显示不同的颜色


## Extension Settings

只需要在rules.json中添加你的高亮文字规则，即可

## Known Issues

你可以到下面路径去查看源码
[github源码](https://github.com/babulin/MirScript.git)

## Release Notes

我可能不会更新我的扩展

### 1.0.0

直接安装，配置rules.json,并且ctrl+shift+p 使用 "重新加载高亮配置" 命令来重载

### 1.0.2
```
在.vscode 下rules.json添加以下配置
{
  "rules": [
    {
      "text": ["黄金麻花"], //匹配文字
      "regex":["#CHILD\\s+\\d+/\\d+\\s+RANDOM"],//正则表达式
      "color": "#FF0000", //颜色
      "border": "2px solid #FF0000", //边框
      "fontStyle": "", //文字类型
      "backgroundColor": "#FFFFFF", //背景颜色
      "fontWeight":"bold" //文字粗细
      "borderRadius":"5px", //圆角
    }
  ]
}
```
## For more information


* [github源码](https://github.com/babulin/MirScript.git)

**Enjoy!**
