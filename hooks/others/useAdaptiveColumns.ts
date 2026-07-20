import { useWindowDimensions } from "react-native";

const MIN_CARD_WIDTH = 170;
const MIN_COLUMNS = 2;
const MAX_COLUMNS = 4;
const HORIZONTAL_PADDING = 32; // px-4 = 16px × 2
const COLUMN_GAP = 12; // gap-x-3 = 12px

export default function useAdaptiveColumns(): number {
  const { width } = useWindowDimensions();
  const availableWidth = width - HORIZONTAL_PADDING;
  const columns = Math.floor(
    (availableWidth + COLUMN_GAP) / (MIN_CARD_WIDTH + COLUMN_GAP)
  );
  return Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, columns));
}
