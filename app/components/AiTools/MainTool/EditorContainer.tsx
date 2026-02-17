"use client";
// import TopHeader from "./TopHeader";
import ParagraphEditor from "./ParagraphEditor";
// import FloatingToolbar from "./FloatingToolbar";

interface EditorContainerProps {
  outlineResponse: string[];
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  outlineResponse,
}) => (
  <div className="min-h-screen flex flex-col">
    {/* <TopHeader /> */}
    <div className="flex-1 flex justify-center items-start pt-8">
      <div className="w-full max-w-3xl  p-6 border-none">
        <ParagraphEditor outlineResponse={outlineResponse} />
      </div>
    </div>
    {/* <FloatingToolbar /> */}
  </div>
);

export default EditorContainer;
