"use client";
import React, { useState } from "react";
import ActionButtons from "./ActionButtons";

interface EssayOutlinerFormProps {
  isSubmitting: boolean;
  onSubmit: (data: {
    topic: string;
    essay_level: string;
    essay_type: string;
  }) => void;
}

const EssayOutlinerForm: React.FC<EssayOutlinerFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [essayTitle, setEssayTitle] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("high school");
  const [essayType, setEssayType] = useState("argumentative");

  const handleClearInputs = () => {
    setEssayTitle("");
    setSchoolLevel("High School");
    setEssayType("Argumentative");
  };

  const handleGenerate = () => {
    const formData = {
      topic: essayTitle,
      essay_level: schoolLevel,
      essay_type: essayType,
    };
    onSubmit(formData);
  };

  return (
    <div className=" h-full border-r border-gray-200  flex flex-col justify-between">
      <h2 className="bg-white text-lg font-semibold text-gray-800 py-4 px-4 mb-4 border-b">
        Essay Outliner
      </h2>
      <div className=" border-gray-200 px-2 md:px-8">
        {/* Essay Title */}
        <div className="mb-4">
          <label
            htmlFor="essayTitle"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Essay title:
          </label>
          <input
            type="text"
            id="essayTitle"
            value={essayTitle}
            onChange={(e) => setEssayTitle(e.target.value)}
            placeholder="ex: Rock Music Superiority"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* School Level Dropdown */}
        <div className="mb-4">
          <select
            id="schoolLevel"
            value={schoolLevel}
            onChange={(e) => setSchoolLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 "
          >
            <option value="high school">High School</option>
            <option value="college">College</option>
            <option value="post graduate">Post Graduate</option>
          </select>
        </div>

        {/* Essay Type Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="essayType"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Essay type:
          </label>
          <select
            id="essayType"
            value={essayType}
            onChange={(e) => setEssayType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="application">Application</option>
            <option value="scholarship">Scholarship</option>
            <option value="descriptive">Descriptive</option>
            <option value="narrative">Narrative</option>
            <option value="argumentative">Argumentative</option>
            <option value="analytical">Analytical</option>
            <option value="persuasive">Persuasive</option>
            <option value="expository">Expository</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 bg-white">
        <ActionButtons
          onClear={handleClearInputs}
          onSubmit={handleGenerate}
          submitButtonText="Generate"
          isSubmitting={isSubmitting}
          isDisabled={!essayTitle.trim()}
        />
      </div>
    </div>
  );
};

export default EssayOutlinerForm;
