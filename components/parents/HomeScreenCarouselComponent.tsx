import { ReactNode } from "react";
import ErrorComponent from "../ErrorComponent";
import StoryCarouselSkeleton from "../skeletons/StoryCarouselSkeleton";

type PropTypes = {
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  children: ReactNode;
};
const HomeScreenCarouselComponent = ({
  isPending,
  error,
  refetch,
  children,
}: PropTypes) => {
  if (isPending) return <StoryCarouselSkeleton />;
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return children;
};

export default HomeScreenCarouselComponent;

//    <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 border-b border-b-border-light py-8">
//      {isPending ? (
//        <StoryCarouselSkeleton />
//      ) : error ? (
//        <ErrorComponent refetch={refetch} message={error.message} />
//      ) : (
//        <>
//          <AgeSelectionComponent
//            selectedGroupProp={selectedGroup}
//            setSelectedCallback={setSelectedGroup}
//          />
//          <StoryCarousel stories={data} />
//          <Pressable
//            onPress={() =>
//              navigator.navigate("storiesByAge", { ageGroup: selectedGroup })
//            }
//            className="mx-auto flex h-10 items-center justify-center rounded-full border border-border-light bg-white px-5"
//          >
//            <Text className="font-[abeezee] text-base text-black">
//              See all stories Age {selectedGroup}
//            </Text>
//          </Pressable>
//        </>
//      )}
//    </View>;
