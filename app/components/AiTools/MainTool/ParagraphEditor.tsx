"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  EditorContent,
  useEditor,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import AISuggestion from "./AISuggestion";
import BlockMenu from "./BlockMenu";
import BlockToolbar from "./BlockToolbar";
import ParagraphToolbar from "./ParagraphToolbar";
import axios from "axios";
import { MdOutlineDragIndicator, MdAdd } from "react-icons/md";

// Custom node views by extending built-in nodes
const CustomHeading = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(NodeWithControls);
  },
} as any);

const CustomParagraph = Paragraph.extend({
  addNodeView() {
    return ReactNodeViewRenderer(NodeWithControls);
  },
} as any);

const CustomCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(NodeWithControls);
  },
} as any);

// Custom NodeView for heading and paragraph
const NodeWithControls: React.FC<NodeViewProps> = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const blockRef = React.useRef<HTMLDivElement>(null);

  const getPosition = () => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY + 10,
        left: rect.left + window.scrollX,
      };
    }
    return { top: 0, left: 0 };
  };

  const handlePlusClick = useCallback(() => {
    setMenuPosition(getPosition());
    setShowMenu(true);
  }, []);

  const handleDragClick = useCallback(() => {
    setMenuPosition(getPosition());
    setShowToolbar(true);
  }, []);

  const onDragStart = (event: React.DragEvent) => {
    const pos = props.getPos();
    if (typeof pos === "number") {
      props.editor.commands.setNodeSelection(pos);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleBlockSelect = (option: string) => {
    const startPos = props.getPos();
    if (typeof startPos === "number") {
      const endPos = startPos + (props.node?.nodeSize ?? 1) - 1;
      props.editor.commands.setTextSelection({ from: endPos, to: endPos });
    }
    const chain = props.editor.chain().focus().splitBlock();
    switch (option) {
      case "text":
        chain.setParagraph().run();
        break;
      case "h1":
        chain.setHeading({ level: 1 }).run();
        break;
      case "h2":
        chain.setHeading({ level: 2 }).run();
        break;
      case "h3":
        chain.setHeading({ level: 3 }).run();
        break;
      case "bulletList":
        chain.setParagraph().toggleBulletList().run();
        break;
      case "numberedList":
        chain.setParagraph().toggleOrderedList().run();
        break;
      case "codeBlock":
        chain.toggleCodeBlock().run();
        break;
      case "table":
      case "image":
      default:
        break;
    }
    setShowMenu(false);
  };

  const isActive =
    props.editor?.state?.selection?.from >= (props.getPos?.() ?? 0) &&
    props.editor?.state?.selection?.to <=
      (props.getPos?.() ?? 0) + (props.node?.nodeSize ?? 0);

  return (
    <NodeViewWrapper className="relative group">
      <div
        className={`absolute top-1/2 -left-16 transform -translate-y-1/2 flex items-center space-x-1 transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        ref={blockRef}
        contentEditable={false}
      >
        <button
          type="button"
          onClick={handlePlusClick}
          className="p-1 rounded hover:bg-gray-200"
        >
          <MdAdd size={18} />
        </button>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-200 cursor-grab"
          draggable
          onDragStart={onDragStart}
          onClick={handleDragClick}
        >
          <MdOutlineDragIndicator size={18} />
        </button>
      </div>

      {props.node.type.name === "heading" ? (
        (() => {
          const level = props.node.attrs.level || 1;
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          const fontSize = level === 1 ? "text-[30px]" : "text-[20px] mt-6";
          return (
            <HeadingTag
              className={`prose focus:outline-none flex-1 font-bold ${fontSize}`}
            >
              <NodeViewContent as="div" className="contents" />
            </HeadingTag>
          );
        })()
      ) : props.node.type.name === "paragraph" ? (
        <p className="prose focus:outline-none flex-1 mt-2">
          <NodeViewContent as="div" className="contents" />
        </p>
      ) : props.node.type.name === "codeBlock" ? (
        <pre className="prose focus:outline-none flex-1">
          <code>
            <NodeViewContent as="div" className="contents" />
          </code>
        </pre>
      ) : (
        <div className="flex-1">
          <NodeViewContent className="prose focus:outline-none" />
        </div>
      )}

      {showMenu && (
        <BlockMenu
          position={menuPosition}
          onSelect={handleBlockSelect}
          onClose={() => setShowMenu(false)}
        />
      )}

      {showToolbar && (
        <BlockToolbar
          position={menuPosition}
          onSelect={() => setShowToolbar(false)}
          onClose={() => setShowToolbar(false)}
        />
      )}
    </NodeViewWrapper>
  );
};

// Main ParagraphEditor component
interface ParagraphEditorProps {
  aiApiUrl?: string;
  outlineResponse: string[];
}

const fetchAISuggestion = async (text: string, apiUrl: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await axios.post(
    apiUrl,
    { prompt: text },
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.content as string;
};

const ParagraphEditor: React.FC<ParagraphEditorProps> = ({
  aiApiUrl = `${process.env.NEXT_PUBLIC_NGROX_URL}/tools/paragraph-generator`,
  outlineResponse,
}) => {
  // Generate content from outlineResponse
  const initialContent = useMemo(() => {
    if (!outlineResponse || outlineResponse.length === 0) {
      return "<h1>Main Heading</h1><p></p>";
    }

    let content = "";
    outlineResponse.forEach((item, index) => {
      if (index === 0) {
        // First item is h1
        content += `<h1>${item}</h1><p></p>`;
      } else {
        // All other items are h2
        content += `<h2>${item}</h2><p></p>`;
      }
    });

    return content;
  }, [outlineResponse]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: false,
        codeBlock: false,
      }),
      CustomHeading,
      CustomParagraph,
      CustomCodeBlock,
      Underline,
    ],
    content: initialContent,
    autofocus: false,
    immediatelyRender: false,
  });

  const [aiSuggestion, setAISuggestion] = useState<string>("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionPos, setSuggestionPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPos, setFormatToolbarPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    if (!editor) return;
    const updateSuggestion = async () => {
      const pos = editor.state.selection.from;
      const textBefore = editor.state.doc.textBetween(0, pos, " ");
      if (textBefore.trim().length === 0) {
        setAISuggestion("");
        setShowSuggestion(false);
        return;
      }
      const suggestion = await fetchAISuggestion(textBefore, aiApiUrl);
      setAISuggestion(suggestion);
      console.log(suggestion);
      setShowSuggestion(true);
      const dom = editor.view.domAtPos(pos);
      if (dom.node instanceof HTMLElement) {
        const rect = dom.node.getBoundingClientRect();
        setSuggestionPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };
    editor.on("selectionUpdate", updateSuggestion);
    return () => {
      editor.off("selectionUpdate", updateSuggestion);
    };
  }, [editor, aiApiUrl]);

  useEffect(() => {
    if (!editor) return;
    const handleSelection = () => {
      const { state } = editor;
      const { from, to } = state.selection;
      const hasSelection = from !== to;
      if (!hasSelection) {
        setShowFormatToolbar(false);
        return;
      }
      const sel = window.getSelection?.();
      if (!sel || sel.rangeCount === 0) {
        setShowFormatToolbar(false);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        setFormatToolbarPos({
          top: rect.top + window.scrollY - 8,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
        setShowFormatToolbar(true);
      } else {
        setShowFormatToolbar(false);
      }
    };
    editor.on("selectionUpdate", handleSelection);
    editor.on("transaction", handleSelection);
    return () => {
      editor.off("selectionUpdate", handleSelection);
      editor.off("transaction", handleSelection);
    };
  }, [editor]);

  const handleAccept = useCallback(() => {
    if (editor && aiSuggestion) {
      editor.commands.insertContent(aiSuggestion);
      setAISuggestion("");
      setShowSuggestion(false);
    }
  }, [editor, aiSuggestion]);

  const handleTryAgain = useCallback(async () => {
    if (!editor) return;
    const pos = editor.state.selection.from;
    const textBefore = editor.state.doc.textBetween(0, pos, " ");
    const suggestion = await fetchAISuggestion(textBefore, aiApiUrl);
    setAISuggestion(suggestion);
    setShowSuggestion(true);
  }, [editor, aiApiUrl]);

  return (
    <div className="relative">
      {editor && showFormatToolbar && (
        <div
          className="absolute z-50"
          style={{
            top: formatToolbarPos.top,
            left: formatToolbarPos.left,
            transform: "translate(-50%, -100%)",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ParagraphToolbar
            onSetBlock={(value) => {
              const { from, to } = editor.state.selection;
              const hasSelection = from !== to;
              if (hasSelection) {
                const selText = editor.state.doc.textBetween(from, to, "\n");
                if (!selText) return;
                const toListItems = (text: string) =>
                  text
                    .split(/\n+/)
                    .map((t) => `<li>${t || ""}</li>`)
                    .join("");
                let html = "";
                switch (value) {
                  case "text":
                    html = `<p>${selText}</p>`;
                    break;
                  case "h1":
                    html = `<h1>${selText}</h1>`;
                    break;
                  case "h2":
                    html = `<h2>${selText}</h2>`;
                    break;
                  case "h3":
                    html = `<h3>${selText}</h3>`;
                    break;
                  case "bulletList":
                    html = `<ul>${toListItems(selText)}</ul>`;
                    break;
                  case "numberedList":
                    html = `<ol>${toListItems(selText)}</ol>`;
                    break;
                  case "codeBlock":
                    html = `<pre><code>${selText}</code></pre>`;
                    break;
                  default:
                    break;
                }
                if (html) {
                  editor
                    .chain()
                    .focus()
                    .deleteSelection()
                    .insertContent(html)
                    .run();
                }
              } else {
                const chain = editor.chain().focus();
                switch (value) {
                  case "text":
                    chain.setParagraph().run();
                    break;
                  case "h1":
                    chain.setHeading({ level: 1 }).run();
                    break;
                  case "h2":
                    chain.setHeading({ level: 2 }).run();
                    break;
                  case "h3":
                    chain.setHeading({ level: 3 }).run();
                    break;
                  case "bulletList":
                    chain.toggleBulletList().run();
                    break;
                  case "numberedList":
                    chain.toggleOrderedList().run();
                    break;
                  case "codeBlock":
                    chain.toggleCodeBlock().run();
                    break;
                  default:
                    break;
                }
              }
            }}
            onToggleBold={() => editor.chain().focus().toggleBold().run()}
            onToggleItalic={() => editor.chain().focus().toggleItalic().run()}
            onToggleUnderline={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            onToggleStrike={() => editor.chain().focus().toggleStrike().run()}
            onToggleCode={() => editor.chain().focus().toggleCode().run()}
            onLink={() => {}}
          />
        </div>
      )}
      <EditorContent
        editor={editor}
        className="min-h-[300px] outline-none border-none"
      />
      {showSuggestion && aiSuggestion && (
        <AISuggestion
          suggestion={aiSuggestion}
          position={suggestionPos}
          onAccept={handleAccept}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  );
};

export default ParagraphEditor;
