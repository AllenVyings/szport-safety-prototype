import re

with open('responsibility.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace .page-view CSS rules with flex-based versions
content = content.replace(
    '.page-view { display:none; }\n    .page-view.active { display:block; }',
    '.page-view { display:none; flex:1; min-height:0; flex-direction:column; }\n    .page-view.active { display:flex; }'
)

# 2. Add split-layout CSS before </style>
split_layout_css = """    body { padding: 20px 20px 0; background: var(--bg-page); height: 100vh; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box; }
    .page-card { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
    .page-card .split-layout { flex: 1; min-height: 0; margin-top: 0; }
    .st-tree-panel { width: 260px; min-width: 260px; display: flex; flex-direction: column; padding: 16px; border-right: 1px solid var(--border-divider); min-height: 0; }
    .st-tree-title { font-size: var(--font-size-14); font-weight: 600; margin-bottom: 10px; }
    .st-tree-search { margin-bottom: 8px; }
    .st-tree-body { flex: 1; min-height: 0; overflow-y: auto; }
    .st-node { padding: 6px 10px; border-radius: var(--radius-sm); font-size: var(--font-size-13); cursor: pointer; margin-bottom: 2px; }
    .st-node:hover { background: var(--bg-hover); }
    .st-node.active { background: var(--primary-light); color: var(--primary); font-weight: 500; }
    .st-node.indent { padding-left: 22px; }
    .st-main { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 16px 20px 20px; overflow: hidden; overflow-y: auto; }
    .st-main-head { flex-shrink: 0; margin-bottom: 12px; font-size: var(--font-size-16); font-weight: 600; }
    .st-main-head span { font-size: var(--font-size-13); font-weight: 400; color: var(--text-secondary); margin-left: 8px; }
"""

content = content.replace('</style>', split_layout_css + '</style>')

# 3. Remove u-bg-page-px20 from body tag
content = content.replace('<body class="u-bg-page-px20">', '<body>')

# 4. Restructure view-list: wrap content in split-layout with left tree panel
# Find the view-list opening and its content, then restructure

old_view_list_start = '''  <div id="view-list" class="page-view active">
  <!-- 统计概览 -->'''

new_view_list_start = '''  <div id="view-list" class="page-view active">
  <div class="card page-card">
    <div class="split-layout">
      <aside class="split-left st-tree-panel">
        <div class="st-tree-title">单位组织树</div>
        <input type="text" class="form-input st-tree-search" placeholder="搜索单位" id="treeSearch">
        <div class="st-tree-body" id="unitTree">
          <div class="st-node active" data-unit="group" data-action="selectUnit" data-param="group">深圳港集团</div>
          <div class="st-node indent" data-unit="west" data-action="selectUnit" data-param="west">西部港区公司</div>
          <div class="st-node indent" data-unit="east" data-action="selectUnit" data-param="east">东部港区公司</div>
          <div class="st-node indent" data-unit="container" data-action="selectUnit" data-param="container">集装箱码头公司</div>
          <div class="st-node indent" data-unit="bulk" data-action="selectUnit" data-param="bulk">散货码头公司</div>
          <div class="st-node indent" data-unit="port" data-action="selectUnit" data-param="port">港航建设公司</div>
          <div class="st-node indent" data-unit="logistics" data-action="selectUnit" data-param="logistics">物流运输公司</div>
          <div class="st-node indent" data-unit="warehouse" data-action="selectUnit" data-param="warehouse">仓储服务公司</div>
        </div>
      </aside>
      <div class="split-right st-main">
        <div class="st-main-head">安全生产责任书<span id="currentUnitLabel">（深圳港集团）</span></div>
  <!-- 统计概览 -->'''

content = content.replace(old_view_list_start, new_view_list_start)

# 5. Close the new wrappers before </div><!-- /view-list -->
# The original closing: </div><!-- /view-list -->
# The content before it ends with the closing of the card and the padding div
# We need to add </div> for st-main, </div> for split-layout, </div> for card page-card
# before the existing </div><!-- /view-list -->

# Find the exact closing sequence. The original structure ends like:
#     </div>  (closing the padding div)
#   </div>    (closing the card)
#   </div>    (closing view-list)
# We need to insert closures for st-main, split-layout, page-card

old_view_list_end = '  </div><!-- /view-list -->'
new_view_list_end = '      </div><!-- /st-main -->\n    </div><!-- /split-layout -->\n  </div><!-- /page-card -->\n  </div><!-- /view-list -->'

content = content.replace(old_view_list_end, new_view_list_end)

# 6. Add tree node click JavaScript before the closing </script>
tree_js = """
    // 左树节点点击
    document.addEventListener('click', function(e) {
      var node = e.target.closest('[data-action="selectUnit"]');
      if (!node) return;
      document.querySelectorAll('.st-node').forEach(function(n) { n.classList.remove('active'); });
      node.classList.add('active');
      var unitName = node.textContent.trim();
      var label = document.getElementById('currentUnitLabel');
      if (label) label.textContent = '（' + unitName + '）';
    });
"""

content = content.replace('  </script>', tree_js + '  </script>')

with open('responsibility.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
