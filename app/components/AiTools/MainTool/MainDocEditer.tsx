"use client";

import React, { useRef, useState, useEffect, useContext } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { FiEdit2 } from "react-icons/fi";
import { BsFileEarmarkText } from "react-icons/bs";
// import { SiMicrosoftword } from "react-icons/si";
import { Extension } from "@tiptap/core";
// import PromptModal from "../PopModal/PromptModal";
import { TitleContext, EditorContext } from "./MainToolLayout";
import ParagraphToolbar from "./ParagraphToolbar";
import PromptModal from "../PromptModal";
// import ParagraphToolbar from "../../Paragraph-tool/ParagraphToolbar";

// Custom backspace behavior
const BackspaceBehavior = Extension.create({
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;

        if ($from.parent.content.size === 0 && $from.pos > 1) {
          return editor.commands.deleteNode("paragraph");
        }

        return false;
      },
    };
  },
});

interface MainDocEditorProps {
  onStartWriting: () => void;
  setOutlineResponse: React.Dispatch<React.SetStateAction<string[]>>;
}

const MainDocEditor: React.FC<MainDocEditorProps> = ({
  onStartWriting,
  setOutlineResponse,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { title, setTitle } = useContext(TitleContext);
  const { setEditor: setEditorContext } = useContext(EditorContext);
  const [showStarterOptions, setShowStarterOptions] = useState(true);
  const [isTypingTitle, setIsTypingTitle] = useState(false);
  const [isPromptModalOpen, setPromptModalOpen] = useState(false);
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPos, setFormatToolbarPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ paragraph: false }),
      Paragraph,
      BackspaceBehavior,
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          style: "border-collapse: collapse; width: 100%; margin: 16px 0;",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style:
            "border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f8f9fa; font-weight: 600; min-width: 100px;",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: "border: 1px solid #ddd; padding: 12px; min-width: 100px;",
        },
      }),
    ],
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none focus:ring-0 focus:border-none min-h-[200px] max-w-full px-4 py-2 cursor-text border-none outline-none",
        style: "border: none !important; outline: none !important;",
      },
    },
  });

  // Share editor instance with context for FooterBar table insertion
  useEffect(() => {
    if (editor) {
      setEditorContext(editor);
    }
    return () => {
      setEditorContext(null);
    };
  }, [editor, setEditorContext]);

  // Enter key on title
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsTypingTitle(true);
    if (e.key === "Enter") {
      e.preventDefault();
      setIsTypingTitle(false);
      if (title.trim() !== "") {
        setShowStarterOptions(false);
        if (editor?.isEmpty) {
          editor.commands.setContent("<p></p>");
        }
        editor?.commands.focus("end");
      }
    }
  };

  // Backspace from below paragraph deletes and jumps up
  useEffect(() => {
    if (!editor) return;

    const checkContentEmpty = () => {
      const json = editor.getJSON();
      const hasContent = json.content?.some((node) =>
        node.content?.some(
          (inner: any) =>
            typeof inner.text === "string" && inner.text.trim() !== ""
        )
      );

      if (!title.trim() && !hasContent) {
        setShowStarterOptions(true);
      }
    };

    editor.on("update", checkContentEmpty);

    return () => {
      editor.off("update", checkContentEmpty); // ✅ Clean-up correctly
    };
  }, [editor, title]);

  // Floating toolbar above selection
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

  // Hide starter options and editor content when typing in title
  useEffect(() => {
    if (title.trim() === "") {
      setShowStarterOptions(true);
    } else if (isTypingTitle) {
      setShowStarterOptions(false);
    }
  }, [title, isTypingTitle]);

  const handleDocImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto relative">
      {/* ===== Editable Title ===== */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsTypingTitle(true);
          }}
          onBlur={() => setIsTypingTitle(false)}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled"
          className="text-4xl font-bold focus:outline-none w-full border-none focus:ring-0 bg-transparent placeholder-gray-400"
        />
      </div>

      {/* ===== Starter Options ===== */}
      {!isTypingTitle && showStarterOptions && (
        <div className="mb-6 space-y-4">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => setPromptModalOpen(true)}
          >
            <FiEdit2 size={16} />
            <span>Start with a prompt</span>
          </div>

          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => {
              setShowStarterOptions(false);
              editor?.commands.setContent("<p></p>");
              editor?.commands.focus("end");
            }}
          >
            <BsFileEarmarkText size={16} />
            <span>Press enter to start from scratch</span>
          </div>

          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={handleDocImportClick}
          >
            {/* <SiMicrosoftword size={16} /> */}
            <span>Import from docx file</span>
            <span className="text-blue-500 text-xs bg-blue-100 rounded px-1 ml-1">
              BETA
            </span>
            <input
              type="file"
              accept=".docx"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log("Imported docx file:", file);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ===== Editor Content ===== */}
      {!isTypingTitle && !showStarterOptions && editor && (
        <div className="relative">
          {showFormatToolbar && (
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
                    const selText = editor.state.doc.textBetween(
                      from,
                      to,
                      "\n"
                    );
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
                onToggleItalic={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                onToggleUnderline={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                onToggleStrike={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                onToggleCode={() => editor.chain().focus().toggleCode().run()}
                onLink={() => {}}
              />
            </div>
          )}
          <EditorContent
            editor={editor}
            className="outline-none border-none focus:outline-none focus:ring-0 focus:border-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:focus:border-none"
          />
        </div>
      )}

      {/* ===== Click Below Area ===== */}
      {!isTypingTitle && (
        <div
          className="h-24 cursor-text"
          onClick={() => {
            setShowStarterOptions(false);
            if (editor?.isEmpty) {
              editor.commands.setContent("<p></p>");
            }
            editor?.commands.focus("end");
          }}
        />
      )}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        onStartWriting={onStartWriting}
        setOutlineResponse={setOutlineResponse}
      />
    </div>
  );
};

export default MainDocEditor;
