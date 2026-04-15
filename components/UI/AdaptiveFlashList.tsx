import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";
import useAdaptiveColumns from "../../hooks/others/useAdaptiveColumns";

type FlashListProps<T> = React.ComponentProps<typeof FlashList<T>>;

/**
 * A FlashList wrapper that automatically handles adaptive column layouts.
 * Uses the useAdaptiveColumns hook to determine the optimal number of columns.
 *
 * Uses standard styles for:
 * - Rounded top corners with negative margin
 * - Proper padding and spacing
 * - Column items with flex: 1 for equal width distribution
 *
 * Usage:
 * ```tsx
 * <AdaptiveFlashList
 *   data={stories}
 *   renderItem={({ item }) => <StoryItem story={item} />}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 */
export function AdaptiveFlashList<T>(props: FlashListProps<T>) {
  const numColumns = useAdaptiveColumns();

  return (
    <FlashList
      key={numColumns}
      numColumns={numColumns}
      style={styles.listContainer}
      contentContainerStyle={styles.contentContainer}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: -16,
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "white", // Default white; override via style prop if needed
    paddingTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
});

/**
 * Standard column item style for use with AdaptiveFlashList.
 * Apply this to the wrapper View in your renderItem function.
 *
 * Usage:
 * ```tsx
 * const renderItem = ({ item }) => (
 *   <View style={adaptiveColumnItemStyle}>
 *     <StoryItem story={item} />
 *   </View>
 * );
 * ```
 */
export const adaptiveColumnItemStyle = StyleSheet.create({
  columnItem: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 24,
  },
}).columnItem;
