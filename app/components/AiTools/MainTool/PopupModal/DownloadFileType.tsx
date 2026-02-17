"use client";
import React, { useContext } from "react";
import { SiLatex } from "react-icons/si";
import { HiOutlineLockClosed } from "react-icons/hi";
import { EditorContext, TitleContext } from "../MainToolLayout";

// Helper function to convert HTML to LaTeX
const htmlToLaTeX = (html: string): string => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  let latex = "";

  const processNode = (node: Node, inTable = false): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || "";
      // Escape LaTeX special characters
      text = text
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/{/g, "\\{")
        .replace(/}/g, "\\}")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\^/g, "\\textasciicircum{}")
        .replace(/_/g, "\\_")
        .replace(/~/g, "\\textasciitilde{}");
      return text;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    // Skip processing table children if we're already processing a table
    if (inTable && (tagName === "tr" || tagName === "td" || tagName === "th")) {
      return "";
    }

    let content = "";

    // Process child nodes (pass inTable flag for table elements)
    const isTable = tagName === "table";
    Array.from(element.childNodes).forEach((child) => {
      content += processNode(child, isTable || inTable);
    });

    switch (tagName) {
      case "h1":
        return `\\section{${content}}\n\n`;
      case "h2":
        return `\\subsection{${content}}\n\n`;
      case "h3":
        return `\\subsubsection{${content}}\n\n`;
      case "p":
        return content ? `${content}\n\n` : "\n";
      case "strong":
      case "b":
        return `\\textbf{${content}}`;
      case "em":
      case "i":
        return `\\textit{${content}}`;
      case "u":
        return `\\underline{${content}}`;
      case "code":
        return `\\texttt{${content}}`;
      case "ul":
        return `\\begin{itemize}\n${content}\\end{itemize}\n\n`;
      case "ol":
        return `\\begin{enumerate}\n${content}\\end{enumerate}\n\n`;
      case "li":
        return `\\item ${content}\n`;
      case "table":
        // Extract table structure
        const rows: string[] = [];
        const tableRows = element.querySelectorAll("tr");
        tableRows.forEach((row) => {
          const cells = row.querySelectorAll("td, th");
          const rowContent = Array.from(cells)
            .map((cell) => {
              let cellContent = "";
              Array.from(cell.childNodes).forEach((child) => {
                cellContent += processNode(child);
              });
              return cellContent.trim();
            })
            .join(" & ");
          if (rowContent) {
            rows.push(rowContent);
          }
        });
        if (rows.length === 0) {
          return "";
        }
        const numCols = tableRows[0]?.querySelectorAll("td, th").length || 1;
        const colSpec = "l".repeat(numCols);
        return `\\begin{table}[h]\n\\centering\n\\begin{tabular}{${colSpec}}\n${rows.join(
          " \\\\\n"
        )} \\\\\n\\end{tabular}\n\\end{table}\n\n`;
      case "tr":
        return content ? `${content}\n` : "";
      case "td":
      case "th":
        return content;
      case "br":
        return " \\\\\n";
      default:
        return content;
    }
  };

  Array.from(tempDiv.childNodes).forEach((node) => {
    latex += processNode(node);
  });

  // Clean up extra ampersands and newlines in tables
  latex = latex.replace(/& \n/g, "\n").replace(/& $/gm, "");

  return latex.trim();
};

// Helper function to create a Word document from HTML
const htmlToDocx = async (html: string, title: string): Promise<Blob> => {
  // Create a proper HTML document structure for Word
  const wordHTML = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
    }
    h1 { font-size: 18pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
    h2 { font-size: 16pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
    h3 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
    p { margin-top: 6pt; margin-bottom: 6pt; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f8f9fa; font-weight: bold; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  // Convert HTML to a blob
  const blob = new Blob(
    [
      "\ufeff", // UTF-8 BOM for Word compatibility
      wordHTML,
    ],
    { type: "application/msword" }
  );

  return blob;
};

const DownloadFileType: React.FC = () => {
  const { editor } = useContext(EditorContext);
  const { title } = useContext(TitleContext);

  const handleDownloadLaTeX = () => {
    if (!editor) {
      alert("Editor not available");
      return;
    }

    const html = editor.getHTML();
    const latex = htmlToLaTeX(html);
    const fileName = `${title || "document"}.tex`;

    const blob = new Blob([latex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = async () => {
    if (!editor) {
      alert("Editor not available");
      return;
    }

    const html = editor.getHTML();
    const fileName = `${title || "document"}.doc`;

    try {
      const blob = await htmlToDocx(html, title || "Document");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating Word document:", error);
      alert("Failed to create Word document");
    }
  };

  return (
    <div className="w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-2 z-[9999] relative">
      <button
        type="button"
        onClick={handleDownloadLaTeX}
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <SiLatex className="text-gray-800" />
        <span>LaTeX (.tex)</span>
      </button>
      <button
        type="button"
        onClick={handleDownloadWord}
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        {/* <SiMicrosoftword className="text-[#2b579a]" /> */}
        <span>Word (.docx)</span>
      </button>
      <div
        aria-disabled
        className="w-full px-3 py-2 text-left text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed"
      >
        <HiOutlineLockClosed />
        <span>Copy to clipboard</span>
      </div>
    </div>
  );
};

export default DownloadFileType;
