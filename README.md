# 世界杯淘汰赛晋级图

一个纯静态 HTML 页面：可拖拽、可缩放、可点击球队一路晋级到总冠军。已确认的真实赛果会被锁定，不能手动改动。

## 本地运行

```bash
npm test
npm run dev
```

打开 http://localhost:4173

## 赛果同步

页面启动后会自动读取 `data/results.json`，工具栏里的“同步赛果”按钮也会重新拉取这个文件。更新这个 JSON 后，刷新网页或点击同步即可锁定新的确认结果。

当前内置锁定结果：

- M73：加拿大 1-0 南非，加拿大晋级
- M74：巴拉圭 1-1 德国，点球 4-3 晋级，巴拉圭晋级
- M76：巴西 2-1 日本，巴西晋级

如果要改成远程数据源，可以在部署页面前设置：

```html
<script>
  window.BRACKET_RESULTS_URL = 'https://example.com/results.json';
</script>
```

JSON 结构参考 `data/results.json`。

## 发布到云上

### Vercel

1. 把项目推到 GitHub。
2. 在 Vercel 导入仓库，Framework 选 `Other` 或 `Static`。
3. Build Command 留空，Output Directory 留空或填 `.`。
4. 部署后访问 Vercel 分配的域名即可。

### GitHub Pages

1. 把项目推到 GitHub。
2. 进入仓库 `Settings -> Pages`。
3. Source 选 `Deploy from a branch`，分支选 `main`，目录选 `/root`。
4. 保存后等待 Pages 发布完成。
