import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";

const ParentsTopPicksScreen = () => {
  return (
    <GroupedStoriesContainer
      params={{ isMostLiked: true }}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__4_1_wx1rwq.jpg",
      }}
      description="These are the top picks for today"
      title="Top picks from us"
    />
  );
};

export default ParentsTopPicksScreen;
