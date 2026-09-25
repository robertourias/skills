import type { ComponentProps, ElementType } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type WithNode<T extends ElementType> = ComponentProps<T> & { node?: unknown };

// react-markdown injeta a prop `node`; ela não pode ir para o DOM.
function heading(Tag: "h2" | "h3" | "h4") {
  return function Heading({ node, ...props }: WithNode<"h2">) {
    void node;
    return <Tag {...props} />;
  };
}

function Anchor({ node, href, ...props }: WithNode<"a">) {
  void node;
  const external = href?.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}

// A página já tem um <h1> (o título da skill): os headings do SKILL.md descem um nível.
const components: Components = {
  h1: heading("h2"),
  h2: heading("h3"),
  h3: heading("h4"),
  a: Anchor,
};

export function SkillMarkdown({ children }: { children: string }) {
  return (
    <div className="prose-skill">
      {/* sanitize antes do highlight: o HTML do highlight é gerado por nós, o do markdown não. */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, [rehypeHighlight, { detect: false }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
