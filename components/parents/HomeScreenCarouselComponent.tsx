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
