"use client";

import {
  Document as DocxDocument,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { jsPDF } from "jspdf";

export function sanitizeFilename(name: string): string {
  const base = (name || "document").trim() || "document";
  return base.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").slice(0, 160);
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Convert editor HTML to LaTeX body (article preamble added in caller if needed). */
export function htmlToLaTeX(html: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const processNode = (node: Node, inTable = false): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || "";
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

    if (
      inTable &&
      (tagName === "tr" || tagName === "td" || tagName === "th")
    ) {
      return "";
    }

    const isTable = tagName === "table";
    let content = "";
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
      case "table": {
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
        if (rows.length === 0) return "";
        const numCols =
          tableRows[0]?.querySelectorAll("td, th").length || 1;
        const colSpec = "l".repeat(numCols);
        return `\\begin{table}[h]\n\\centering\n\\begin{tabular}{${colSpec}}\n${rows.join(
          " \\\\\n",
        )} \\\\\n\\end{tabular}\\end{table}\n\n`;
      }
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

  let latex = "";
  Array.from(tempDiv.childNodes).forEach((node) => {
    latex += processNode(node);
  });

  latex = latex.replace(/& \n/g, "\n").replace(/& $/gm, "");
  return latex.trim();
}

/** Escape plain document title for use inside \\title{...}. */
export function escapePlainTextForLaTeX(text: string): string {
  return (text || "")
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
}

export function buildFullLaTeXDocument(body: string, title: string): string {
  const safeTitle = escapePlainTextForLaTeX(
    (title || "Untitled").trim() || "Untitled",
  );
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\title{${safeTitle}}
\\begin{document}
\\maketitle
${body}
\\end{document}
`;
}

function htmlToDocxParagraphs(html: string): Paragraph[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const out: Paragraph[] = [];

  type BlockHeading =
    | typeof HeadingLevel.HEADING_1
    | typeof HeadingLevel.HEADING_2
    | typeof HeadingLevel.HEADING_3;

  const addBlock = (text: string, heading?: BlockHeading) => {
    const t = text.replace(/\s+/g, " ").trim();
    if (!t) return;
    const children = [new TextRun({ text: t })];
    if (heading !== undefined) {
      out.push(
        new Paragraph({
          heading,
          spacing: { after: 200 },
          children,
        }),
      );
    } else {
      out.push(
        new Paragraph({
          spacing: { after: 200 },
          children,
        }),
      );
    }
  };

  const walk = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === "h1") {
      addBlock(el.textContent || "", HeadingLevel.HEADING_1);
      return;
    }
    if (tag === "h2") {
      addBlock(el.textContent || "", HeadingLevel.HEADING_2);
      return;
    }
    if (tag === "h3") {
      addBlock(el.textContent || "", HeadingLevel.HEADING_3);
      return;
    }
    if (tag === "p") {
      addBlock(el.textContent || "");
      return;
    }
    if (tag === "li") {
      addBlock(`• ${el.textContent || ""}`);
      return;
    }
    if (tag === "tr") {
      const cells = Array.from(el.querySelectorAll("td, th"))
        .map((c) => c.textContent?.trim())
        .filter(Boolean)
        .join(" \t ");
      if (cells) addBlock(cells);
      return;
    }

    const containerTags = [
      "div",
      "article",
      "body",
      "ul",
      "ol",
      "table",
      "thead",
      "tbody",
      "colgroup",
      "section",
      "blockquote",
    ];
    if (containerTags.includes(tag)) {
      el.childNodes.forEach(walk);
    }
  };

  Array.from(div.childNodes).forEach(walk);

  const plainFallback = div.textContent?.trim();
  if (out.length === 0 && plainFallback) {
    addBlock(plainFallback);
  }

  return out;
}

export async function buildDocxBlob(
  html: string,
  documentTitle: string,
): Promise<Blob> {
  const displayTitle = (documentTitle || "").trim() || "Document";

  const bodyParagraphs = htmlToDocxParagraphs(html);
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 360 },
      children: [new TextRun({ text: displayTitle })],
    }),
    ...(bodyParagraphs.length > 0
      ? bodyParagraphs
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: "(No body content yet — type in the editor first.)",
                italics: true,
              }),
            ],
          }),
        ]),
  ];

  const doc = new DocxDocument({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function savePdfFromHtml(html: string, baseName: string) {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "0";
  wrapper.style.top = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.style.zIndex = "-1";
  wrapper.style.width = "900px";
  wrapper.style.maxWidth = "100%";
  wrapper.style.padding = "24px 28px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.background = "#ffffff";
  wrapper.style.fontFamily = "Georgia, 'Times New Roman', serif";
  wrapper.style.fontSize = "12pt";
  wrapper.style.lineHeight = "1.55";
  wrapper.style.color = "#111827";
  wrapper.innerHTML = html;

  document.body.appendChild(wrapper);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const safe = sanitizeFilename(baseName);

  await new Promise<void>((resolve, reject) => {
    try {
      const worker = pdf.html(wrapper, {
        callback: (doc) => {
          try {
            doc.save(`${safe}.pdf`);
            wrapper.remove();
            resolve();
          } catch (e) {
            wrapper.remove();
            reject(e);
          }
        },
        x: 14,
        y: 14,
        width: 182,
        windowWidth: 900,
        autoPaging: "text",
        html2canvas: {
          scale: 0.72,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        },
      });
      if (worker && typeof (worker as Promise<void>).then === "function") {
        (worker as Promise<void>).catch((e) => {
          wrapper.remove();
          reject(e);
        });
      }
    } catch (e) {
      wrapper.remove();
      reject(e);
    }
  });
}
