import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";

const ParentsTopRecommendationsScreen = () => {
  return (
    <GroupedStoriesContainer
      params={{ isMostLiked: true }}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762826/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__5_1_b0bhz1.jpg",
      }}
      description="Top recommendations"
      title="Most liked stories from other users"
    />
  );
};

export default ParentsTopRecommendationsScreen;
