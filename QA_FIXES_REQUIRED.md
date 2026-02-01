# QA Review - Required Fixes

## Status Key

- ✅ **FIXED** - Issue has been resolved
- ❌ **PENDING** - Issue still needs to be fixed
- ⚠️ **CRITICAL** - High priority issue

---

## Previously Reported Issues

### 1. ✅ FIXED - Add error handling to `handlePreview` in `AvailableVoices.tsx`

**File:** `components/AvailableVoices.tsx`
**Lines:** 40-46

Error handling has been added with try/catch block.

---

### 2. ✅ FIXED - Disable `useTextToAudio` when no voice is selected

**File:** `components/StoryAudioPlayer.tsx`
**Line:** 24

The `enabled` option has been added: `enabled: !!selectedVoice`

---

### 3. ✅ FIXED - Remove `setSelectedVoice` from useEffect dependencies

**File:** `components/AvailableVoices.tsx`
**Line:** 29

State setters from props are stable and shouldn't be in dependencies:

```tsx
// Current (incorrect):
}, [selectedVoice, data, setSelectedVoice]);

// Should be:
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedVoice, data]);
```

---

### 4. ✅ FIXED - Use `null` instead of empty string for uninitialized voice state

**File:** `components/StoryComponent.tsx`
**Line:** 29

Using `null` is more semantically correct for "no selection yet":

```tsx
// Current:
const [selectedVoice, setSelectedVoice] = useState("");

// Should be:
const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
```

Then update `AvailableVoices.tsx` props type accordingly.

---

## NEW Issues Found

### 5. ✅ FIXED - Test button in production code

**File:** `screens/parents/home/ChildStoryDetails.tsx`
**Lines:** 193-197

There is a debug/test button that should NOT be in production code:

```tsx
<CustomButton
  onPress={() => setStoryMode("interactive")}
  text="Override premium (TEST ONLY)"
  bgColor="#4807EC"
/>
```

**Fix:** Remove this button entirely or wrap it in a `__DEV__` check:

```tsx
{
  __DEV__ && (
    <CustomButton
      onPress={() => setStoryMode("interactive")}
      text="Override premium (TEST ONLY)"
      bgColor="#4807EC"
    />
  );
}
```

---

### 6. ✅ FIXED - Incorrect array initialization causes quiz results to fail

**File:** `components/StoryContentContainer.tsx`
**Lines:** 44-46

The quiz results array is initialized incorrectly:

```tsx
// Current (WRONG - creates empty array):
const [quizResults, setQuizResults] = useState<Array<boolean | null>>(
  new Array().fill(story.questions.length)
);

// Should be (creates array of correct length filled with null):
const [quizResults, setQuizResults] = useState<Array<boolean | null>>(
  new Array(story.questions.length).fill(null)
);
```

`new Array().fill(x)` creates an empty array. You need `new Array(length).fill(value)`.

---

### 7. ✅ FIXED - Typo in state variable name

**Files:**

- `components/AvailableVoices.tsx` Line 21
- `components/StoryContentContainer.tsx` Line 41

The state variable is misspelled as `isSubsriptionModalOpen` (missing 'c'):

```tsx
// Current (typo):
const [isSubsriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

// Should be:
const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
```

Note: The setter function is spelled correctly, only the state variable has the typo.

---

### 8. ✅ FIXED - Missing player cleanup on unmount

**File:** `components/StoryAudioPlayer.tsx`
**Lines:** 29-32

The useEffect pauses the player when voice changes but doesn't clean up when the component unmounts, and is missing the `player` dependency:

```tsx
// Current:
useEffect(() => {
  player.pause();
  setIsPlaying(false);
}, [selectedVoice]);

// Should be:
useEffect(() => {
  player.pause();
  setIsPlaying(false);

  return () => {
    player.pause(); // Cleanup on unmount
  };
}, [selectedVoice, player]);
```

---

### 9. ✅ FIXED - Potential crash when categories array is empty

**File:** `screens/parents/home/ChildStoryDetails.tsx`
**Line:** 100

Accessing `data.categories[0].name` without checking if categories exist will crash:

```tsx
// Current (unsafe):
{
  data.categories[0].name;
}

// Should be (safe):
{
  data.categories[0]?.name ?? "Uncategorized";
}
```

---

### 10. ✅ FIXED - Missing return value in catch block

**File:** `hooks/tanstack/mutationHooks/useTextToAudio.ts`
**Lines:** 33-35

The catch block shows an alert but doesn't return anything, which can cause undefined behavior:

```tsx
// Current:
} catch (err) {
  Alert.alert("Failed to generate audio", getErrorMessage(err));
}

// Should be:
} catch (err) {
  Alert.alert("Failed to generate audio", getErrorMessage(err));
  return { data: null };
}
```

---

### 11. ✅ FIXED (Low) - Unnecessary extra braces in function

**File:** `hooks/tanstack/mutationHooks/useToggleFavourites.ts`
**Line:** 78

The `deleteFromFavourites` function has unnecessary extra opening brace:

```tsx
// Current:
const deleteFromFavourites = async (storyId: string) => {
  {  // <-- unnecessary brace
    try {
      ...
    }
  }  // <-- unnecessary brace
};

// Should be:
const deleteFromFavourites = async (storyId: string) => {
  try {
    ...
  }
};
```

---

## NEW Issues Found (Round 2)

### 12. ✅ FIXED - Hook called conditionally (Rules of Hooks violation)

**File:** `components/modals/storyModals/EndOfStoryMessage.tsx`
**Lines:** 20-21

The `useNavigation` hook is called AFTER an early return, violating React's Rules of Hooks:

```tsx
// Current (WRONG - hook called after conditional return):
if (!isOpen) return null;
const navigator = useNavigation<ProtectedRoutesNavigationProp>();

// Should be (hooks before any conditional returns):
const navigator = useNavigation<ProtectedRoutesNavigationProp>();
if (!isOpen) return null;
```

This can cause inconsistent hook calls between renders and may crash the app.

---

### 13. ✅ FIXED - Console.log left in production code

**File:** `screens/parents/ParentsLibraryScreen.tsx`
**Line:** 40

Debug console.log should be removed from production code:

```tsx
// Current (should be removed):
console.log("SHOW TOAST", title);
```

---

### 14. ✅ FIXED - Typo in type definition

**File:** `types.ts`
**Line:** 182

The property name has a typo - `imae` should be `image`:

```tsx
// Current (typo):
themes: {
  ...
  imae: string | null;  // <-- should be 'image'
  ...
}[];
```

---

### 15. ✅ FIXED - Redundant nested View with duplicate key

**File:** `components/modals/storyModals/StoryQuiz.tsx`
**Lines:** 66-67

There's an unnecessary outer View wrapper with a duplicate key:

```tsx
// Current (redundant outer View with duplicate key):
<View className="flex flex-col gap-y-4" key={option}>
  <Pressable
    key={option}  // <-- duplicate key
    ...
  >

// Should be (remove outer View or move styles to Pressable):
<Pressable
  key={option}
  className="flex-row items-center gap-x-5 py-1 px-4 rounded-2xl"
  ...
>
```

---

### 16. ✅ FIXED - StoryItem missing null check for categories

**File:** `components/parents/StoryItem.tsx`
**Lines:** 88-91

Accessing `story.categories[0].name` without checking if categories array exists could crash:

```tsx
// Current (unsafe):
{
  story.categories[0].name.length > 15
    ? story.categories[0].name.split("").slice(0, 14).join("") + "..."
    : story.categories[0].name;
}

// Should be (safe + more efficient):
{
  story.categories?.[0]?.name
    ? story.categories[0].name.length > 15
      ? story.categories[0].name.slice(0, 14) + "..."
      : story.categories[0].name
    : "Uncategorized";
}
```

Also note: Using `.split("").slice(0, 14).join("")` is inefficient - use `.slice(0, 14)` directly on the string.

---

### 17. ✅ FIXED - SubscriptionModal Subscribe button has empty onPress

**File:** `components/modals/SubscriptionModal.tsx`
**Line:** 112

The Subscribe button has an empty `onPress` handler that does nothing:

```tsx
// Current (no-op):
<CustomButton
  ariaLabel="Subscribe button"
  text="Subscribe"
  onPress={() => {}} // <-- empty handler
  disabled={!selectedPlan}
/>
```

This needs to be connected to actual subscription logic.

---

### 18. ✅ FIXED - Unused `id` parameter in useSetStoryProgress

**File:** `hooks/tanstack/mutationHooks/UseSetStoryProgress.ts`
**Lines:** 9, 13

The `id` parameter is defined but never used:

```tsx
// Current (unused parameter):
const useSetStoryProgress = ({
  storyId,
  onSuccess,
  id,  // <-- never used
}: {
  storyId: string;
  onSuccess?: () => void;
  id?: string;  // <-- never used
}) => {
```

Either remove it or use it.

---

### 19. ✅ FIXED - FavouriteStoryItem has misplaced onPress handler

**File:** `components/FavouriteStoryItem.tsx`
**Lines:** 42-48

The `onPress` is on the FontAwesome icon inside a Pressable, but the Pressable itself has no handler, making touch targets inconsistent:

```tsx
// Current (confusing touch targets):
<Pressable className="size-11 self-end bg-black/5 flex justify-center items-center rounded-full">
  <FontAwesome
    onPress={() => setActiveStory(story)}  // <-- onPress on icon, not Pressable
    name="heart"
    size={24}
    color="red"
  />
</Pressable>

// Should be (onPress on Pressable):
<Pressable
  onPress={() => setActiveStory(story)}
  className="size-11 self-end bg-black/5 flex justify-center items-center rounded-full"
>
  <FontAwesome
    name="heart"
    size={24}
    color="red"
  />
</Pressable>
```

---

### 20. ✅ FIXED - SelectReadingVoiceModal displays voice ID instead of name

**File:** `components/modals/SelectReadingVoiceModal.tsx`
**Lines:** 38-39

The selected voice display shows the voice ID (which is a UUID) instead of the voice name:

```tsx
// Current (shows UUID):
<Text className="font-[quilka] text-2xl text-black">
  {selectedVoice}  // <-- This is the voice ID, not the name
</Text>
```

This needs to look up the voice name from the available voices data.

---

### 21. ✅ FIXED - CustomButton transparent variant ignores disabled prop

**File:** `components/UI/CustomButton.tsx`
**Lines:** 24-33

When `transparent` is true, the disabled prop is not applied:

```tsx
// Current (disabled not handled for transparent variant):
if (transparent) {
  return (
    <Pressable
      aria-labelledby={ariaLabel}
      onPress={onPress}
      // Missing: disabled={disabled}
      className="flex h-[46px] w-full flex-row items-center justify-center rounded-full border"
    >
      ...
    </Pressable>
  );
}
```

---

### 22. ✅ FIXED (Low) - StoryQuiz doesn't reset state when reopened

**File:** `components/modals/storyModals/StoryQuiz.tsx`
**Lines:** 18-22

When the quiz closes and reopens, the local state (activeTab, selectedOption, results) is not reset, which could show stale data:

```tsx
// When quiz reopens, these keep old values:
const [activeTab, setActiveTab] = useState(0);
const [selectedOption, setSelectedOption] = useState<number | null>(null);
const [results, setResults] = useState<Array<boolean | null>>(
  new Array(questions.length).fill(null)
);
```

Consider adding a useEffect to reset state when `isOpen` changes from false to true.

---

### 23. ✅ FIXED - Test button wrapped in **DEV** check in ChildStoryDetails

**File:** `screens/parents/home/ChildStoryDetails.tsx`
**Lines:** 193-197

Upon re-checking, the test button is still in the codebase:

```tsx
<CustomButton
  onPress={() => setStoryMode("interactive")}
  text="Override premium (TEST ONLY)"
  bgColor="#4807EC"
/>
```

This was marked as fixed but the button is still present in the code. Needs to be removed or wrapped in `__DEV__` check.

---

## Priority Order

### Critical (Fix Immediately)

1. **⚠️ CRITICAL:** Fix #12 (Rules of Hooks violation - EndOfStoryMessage)
2. **⚠️ CRITICAL:** Fix #23 (Test button still in production - ChildStoryDetails)

### High Priority

3. **High:** Fix #16 (Categories null check - StoryItem potential crash)

### Medium Priority

4. **Medium:** Fix #13 (Remove console.log)
5. **Medium:** Fix #14 (Type definition typo)
6. **Medium:** Fix #17 (Empty Subscribe button handler)
7. **Medium:** Fix #19 (FavouriteStoryItem touch targets)
8. **Medium:** Fix #20 (Voice ID vs name display)
9. **Medium:** Fix #21 (CustomButton disabled for transparent)

### Low Priority

10. **Low:** Fix #15 (Redundant nested View)
11. **Low:** Fix #18 (Unused parameter)
12. **Low:** Fix #22 (StoryQuiz state reset)

---

## React Native Best Practices Violations (Round 3)

### 24. ⚠️ HIGH - Using react-native Image instead of expo-image

**Files:** Multiple files (21+ occurrences)

- `components/parents/StoryItem.tsx`
- `components/FavouriteStoryItem.tsx`
- `components/AvailableVoices.tsx`
- `components/modals/SubscriptionModal.tsx`
- `screens/parents/ParentsLibraryScreen.tsx`
- And many more...

**Issue:** The app uses `Image` from `react-native` instead of `expo-image`. According to React Native best practices, `expo-image` provides:

- Memory-efficient caching
- Blurhash placeholders
- Progressive loading
- Better performance in lists

```tsx
// Current (inefficient):
import { Image } from "react-native";

// Should be:
import { Image } from "expo-image";
```

---

### 25. ⚠️ HIGH - ScrollView with .map() instead of FlatList/FlashList

**Files:**

- `components/StoryCarousel.tsx` (Lines 14-32)
- `components/GroupedStoriesContainer.tsx` (Lines 89-116)
- `screens/parents/ParentsLibraryScreen.tsx` (Lines 66-133)
- `screens/parents/ParentsFavouritesScreen.tsx` (Lines 167-174)

**Issue:** Using `ScrollView` with `.map()` renders ALL items at once, even if only a few are visible. This wastes memory and causes slower initial mount times. Use `FlatList` or `FlashList` for virtualized rendering.

```tsx
// Current (renders all items at once):
<ScrollView>
  {stories.map((story) => (
    <StoryItem key={story.id} story={story} />
  ))}
</ScrollView>

// Should be (only renders visible items):
<FlatList
  data={stories}
  renderItem={({ item }) => <StoryItem story={item} />}
  keyExtractor={(item) => item.id}
/>
```

---

### 26. ✅ FIXED - TouchableOpacity used instead of Pressable

**Files:**

- `components/MenuItem.tsx` (Lines 6, 74, 101)
- `components/Avatar.tsx` (Lines 9, 55, 84)
- `components/ErrorComponent.tsx` (Lines 1, 17, 22)

**Issue:** `TouchableOpacity` is a legacy component. React Native recommends using `Pressable` for all touch interactions as it provides a more flexible API.

```tsx
// Current (legacy):
import { TouchableOpacity } from "react-native";
<TouchableOpacity onPress={onPress}>

// Should be:
import { Pressable } from "react-native";
<Pressable onPress={onPress}>
```

---

### 27. ❌ PENDING - Inline callbacks in list items break memoization

**File:** `components/StoryCarousel.tsx`
**Lines:** 23-28

**Issue:** Creating inline functions in renderItem/map creates new function references on every render, breaking memoization:

```tsx
// Current (new function on every render):
{stories.map((story, index) => (
  <StoryItem
    onNavigate={() => {
      navigator.navigate("stories", {...});  // <-- inline callback
    }}
    story={story}
  />
))}

// Should be (stable callback with ID):
// Either hoist callback to parent and pass storyId, or use useCallback
```

Same issue in `components/GroupedStoriesContainer.tsx` (Lines 105-110).

---

### 28. ✅ FIXED - Invalid color format in ActivityIndicator

**File:** `components/GroupedStoriesContainer.tsx`
**Line:** 76

**Issue:** Missing `#` prefix in hex color:

```tsx
// Current (invalid):
<ActivityIndicator size="large" color="EC4007" />

// Should be:
<ActivityIndicator size="large" color="#EC4007" />
```

---

### 29. ❌ PENDING - Missing contentInsetAdjustmentBehavior on ScrollViews

**Files:** Multiple ScrollView usages

**Issue:** For proper safe area handling on iOS, ScrollViews should use `contentInsetAdjustmentBehavior="automatic"` instead of wrapping in SafeAreaView or manual padding:

```tsx
// Current (common pattern):
<SafeAreaView>
  <ScrollView>...</ScrollView>
</SafeAreaView>

// Better (native safe area handling):
<ScrollView contentInsetAdjustmentBehavior="automatic">
  ...
</ScrollView>
```

---

### 30. ❌ PENDING (Low) - Inline style objects in components

**Files:** Multiple files (50+ occurrences)

**Issue:** Inline style objects like `style={{ marginTop: 16 }}` create new objects on every render. While this is often unavoidable for dynamic styles, static styles should use `StyleSheet.create()` or be hoisted to module scope.

Common occurrences in:

- `screens/auth/LoginScreen.tsx`
- `screens/auth/SignupScreen.tsx`
- `components/modals/SuccessModal.tsx`

---

## Updated Priority Order

### High Priority (Performance) - Still Pending

1. **High:** Fix #24 (Use expo-image instead of react-native Image)
2. **High:** Fix #25 (Use FlatList/FlashList instead of ScrollView with map)

### Medium Priority - Still Pending

3. **Medium:** Fix #27 (Inline callbacks in list items)

### Low Priority - Still Pending

4. **Low:** Fix #29 (contentInsetAdjustmentBehavior)
5. **Low:** Fix #30 (Inline style objects)

### All Other Issues - FIXED

All critical, high (crash-related), and medium priority issues have been resolved.

---

## Summary

| Status         | Count  |
| -------------- | ------ |
| ✅ Fixed       | 25     |
| ⚠️ High (Perf) | 2      |
| ❌ Pending     | 3      |
| **Total**      | **30** |

### Recently Fixed Issues (This Session)

- #12: Hook called conditionally in EndOfStoryMessage.tsx
- #13: Console.log removed from ParentsLibraryScreen.tsx
- #14: Typo in types.ts (imae -> image)
- #15: Redundant nested View in StoryQuiz.tsx
- #16: StoryItem null check for categories
- #17: SubscriptionModal Subscribe button handler
- #18: Unused id parameter in UseSetStoryProgress.ts
- #19: FavouriteStoryItem onPress handler placement
- #20: SelectReadingVoiceModal voice name display
- #21: CustomButton transparent variant disabled prop
- #22: StoryQuiz state reset on reopen
- #23: Test button wrapped in **DEV** check
- #26: TouchableOpacity replaced with Pressable
- #28: Invalid color format in ActivityIndicator
