import { ReactNode } from "react";
import ErrorComponent from "../ErrorComponent";
import { getUserFacingError } from "../../utils/errorMessages";
import StoryCarouselSkeleton from "../skeletons/StoryCarouselSkeleton";

type PropTypes = {
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  children: ReactNode;
  /** When true, prefer showing children (cached data) over the error screen. */
  hasData?: boolean;
};
const HomeScreenCarouselComponent = ({
  isPending,
  error,
  refetch,
  children,
  hasData,
}: PropTypes) => {
  if (isPending) return <StoryCarouselSkeleton />;
  if (error && !hasData)
    return (
      <ErrorComponent refetch={refetch} message={getUserFacingError(error)} />
    );
  return children;
};

export default HomeScreenCarouselComponent;
