"use client";
import { PiTextAaBold } from "react-icons/pi";
import { FaUndo, FaRedo } from "react-icons/fa";
import { MdFormatQuote } from "react-icons/md";
import { MdOutlineImage } from "react-icons/md";
import { MdOutlineSmartDisplay } from "react-icons/md";
import { MdOutlineFunctions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useContext, useState, useEffect, useRef } from "react";
import { WordCountContext, EditorContext } from "./MainToolLayout";
import { CiViewTable } from "react-icons/ci";

const FooterBar = () => {
  const { wordCount } = useContext(WordCountContext);
  const { editor } = useContext(EditorContext);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const tablePickerRef = useRef<HTMLDivElement>(null);

  // Update undo/redo button states
  useEffect(() => {
    if (!editor) {
      setCanUndo(false);
      setCanRedo(false);
      return;
    }

    const updateUndoRedoState = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    updateUndoRedoState();
    editor.on("update", updateUndoRedoState);
    editor.on("selectionUpdate", updateUndoRedoState);

    return () => {
      editor.off("update", updateUndoRedoState);
      editor.off("selectionUpdate", updateUndoRedoState);
    };
  }, [editor]);

  // Close table picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tablePickerRef.current &&
        !tablePickerRef.current.contains(event.target as Node)
      ) {
        setShowTablePicker(false);
        setHoveredCell(null);
      }
    };

    if (showTablePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTablePicker]);

  const handleInsertTable = (rows: number, cols: number) => {
    if (!editor) {
      console.error("Editor not available");
      return;
    }

    try {
      // Ensure editor is focused
      editor.chain().focus().run();

      // Check if insertTable command is available
      if (!editor.can().insertTable({ rows, cols, withHeaderRow: true })) {
        console.error("Cannot insert table at current position");
        // Try to insert a paragraph first, then the table
        editor
          .chain()
          .focus()
          .insertContent("<p></p>")
          .insertTable({
            rows: rows,
            cols: cols,
            withHeaderRow: true,
          })
          .run();
      } else {
        // Use TipTap's built-in insertTable command
        const result = editor
          .chain()
          .focus()
          .insertTable({
            rows: rows,
            cols: cols,
            withHeaderRow: true,
          })
          .run();

        if (!result) {
          console.error("Failed to insert table. Command returned false.");
          // Fallback: try without withHeaderRow
          const fallbackResult = editor
            .chain()
            .focus()
            .insertTable({
              rows: rows,
              cols: cols,
            })
            .run();

          if (!fallbackResult) {
            console.error("All table insertion methods failed");
          }
        }
      }
    } catch (error) {
      console.error("Error inserting table:", error);
    }

    setShowTablePicker(false);
    setHoveredCell(null);
  };
  return (
    <div className="flex justify-between items-center px-2 py-1 border-t border-gray-300 bg-white w-full mt-8 text-black">
      {/* Center buttons */}
      <div className="flex items-center gap-2 mx-auto">
        <button className="text-gray-700 text-lg hover:text-blue-600">
          <PiTextAaBold />
        </button>

        <span className="border-l h-5 border-gray-300"></span>

        <button className="text-sm text-gray-800 font-normal">T</button>

        <select className="text-sm border-none bg-transparent focus:outline-none cursor-pointer">
          <option>Text</option>
          <option>Heading</option>
          <option>Title</option>
        </select>

        <span className="border-l h-5 border-gray-300"></span>

        <button title="insert image" className="text-gray-600 hover:text-black">
          <MdOutlineImage className="text-lg" />
        </button>
        {/* <button className="text-gray-600 hover:text-black">
          <MdOutlineSmartDisplay className="text-lg" />
        </button> */}
        {/* <button className="text-gray-600 hover:text-black">
          <MdOutlineFunctions className="text-lg" />
        </button> */}
        {/* <button className="text-gray-600 hover:text-black">
          <RxCross2 className="text-lg" />
        </button> */}
        <div className="relative" ref={tablePickerRef}>
          <button
            className="text-gray-600 hover:text-black"
            onClick={() => setShowTablePicker(!showTablePicker)}
            title="Insert table"
          >
            <CiViewTable />
          </button>

          {showTablePicker && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 min-w-[200px]">
              <div className="text-xs text-gray-700 mb-3 text-center font-medium">
                {hoveredCell
                  ? `${hoveredCell.row + 1} × ${hoveredCell.col + 1} table`
                  : "Select table size"}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, index) => {
                  const row = Math.floor(index / 8);
                  const col = index % 8;
                  const isHovered =
                    hoveredCell &&
                    row <= hoveredCell.row &&
                    col <= hoveredCell.col;

                  return (
                    <div
                      key={index}
                      className={`w-4 h-4 border border-gray-300 cursor-pointer transition-all duration-150 ${
                        isHovered
                          ? "bg-blue-500 border-blue-600 shadow-sm"
                          : "bg-gray-100 hover:bg-gray-300"
                      }`}
                      onMouseEnter={() => setHoveredCell({ row, col })}
                      onClick={() => handleInsertTable(row + 1, col + 1)}
                      title={`${row + 1} rows × ${col + 1} columns`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span className="border-l h-5 border-gray-300"></span>

        <button
          className={`text-gray-600 hover:text-black ${
            !canUndo ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (editor && canUndo) {
              editor.chain().focus().undo().run();
            }
          }}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <FaUndo />
        </button>
        <button
          className={`text-gray-600 hover:text-black ${
            !canRedo ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (editor && canRedo) {
              editor.chain().focus().redo().run();
            }
          }}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <FaRedo />
        </button>
      </div>

      {/* Right side stats */}
      <div className="flex items-center text-sm text-gray-600 gap-4">
        <span>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
};

export default FooterBar;
