/**
 * z-index scale. Large gaps between steps are intentional — they leave room
 * to insert a new layer between two existing ones later without a
 * renumbering exercise, which is the failure mode ad hoc z-index values
 * (`z-index: 9999`) always eventually hit.
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600
} as const;

export type ZIndexToken = keyof typeof zIndex;
