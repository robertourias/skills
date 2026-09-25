interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  isFile: boolean;
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "", children: new Map(), isFile: false };
  for (const path of paths) {
    const parts = path.split("/");
    let node = root;
    parts.forEach((part, i) => {
      let child = node.children.get(part);
      if (!child) {
        child = { name: part, children: new Map(), isFile: i === parts.length - 1 };
        node.children.set(part, child);
      }
      node = child;
    });
  }
  return root;
}

function sortedChildren(node: TreeNode): TreeNode[] {
  return [...node.children.values()].sort(
    (a, b) => Number(a.isFile) - Number(b.isFile) || a.name.localeCompare(b.name),
  );
}

function Branch({ node }: { node: TreeNode }) {
  return (
    <ul className="space-y-1 border-l border-line pl-3">
      {sortedChildren(node).map((child) => (
        <li key={child.name}>
          <span className="font-mono text-sm">
            {child.name}
            {!child.isFile && "/"}
          </span>
          {!child.isFile && <Branch node={child} />}
        </li>
      ))}
    </ul>
  );
}

export function FileTree({ slug, files }: { slug: string; files: string[] }) {
  const root = buildTree(files);
  return (
    <div>
      <p className="font-mono text-sm text-muted">{slug}/</p>
      <div className="mt-1">
        <Branch node={root} />
      </div>
    </div>
  );
}
