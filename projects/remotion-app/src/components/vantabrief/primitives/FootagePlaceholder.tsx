import React from "react";
import { PlaceholderFrame, PlaceholderProps, PlaceholderMediaType } from "../../../templates/common/PlaceholderFrame";

export { PlaceholderFrame, type PlaceholderProps, type PlaceholderMediaType };

/**
 * High-Legibility VantaBrief Footage Placeholder primitive.
 * Enforces Phase 6 & Style Bible guidelines:
 * - Centered "FOOTAGE NEEDED" header
 * - Detailed editorial prompt & search terms
 * - Drop-in replacement via user_footage_manifest
 */
export const FootagePlaceholder: React.FC<PlaceholderProps> = (props) => {
  return <PlaceholderFrame {...props} />;
};
