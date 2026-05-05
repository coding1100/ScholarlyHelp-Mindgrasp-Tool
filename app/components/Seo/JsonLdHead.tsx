"use client";

import { useServerInsertedHTML } from "next/navigation";

interface JsonLdHeadProps {
  id: string;
  json: string;
}

export default function JsonLdHead({ id, json }: JsonLdHeadProps) {
  useServerInsertedHTML(() => (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  ));

  return null;
}
