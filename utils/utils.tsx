import Icon from "../components/Icon";

const filterStoriesByTitle = (stories: any[], searchQuery: string) => {
  if (!searchQuery.trim()) return stories;

  const query = searchQuery.toLowerCase().trim();
  return (
    stories?.filter((story) => story.title?.toLowerCase().includes(query)) || []
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const getCategoryColour = (category: string) => {
  const lowerCaseCat = category.toLowerCase();
  if (lowerCaseCat === "adventure") {
    return "#0731EC";
  } else if (lowerCaseCat === "mystery") {
    return "#07A92A";
  } else if (lowerCaseCat === "honesty" || lowerCaseCat === "fantasy") {
    return "#EC0794";
  } else if (lowerCaseCat === "folk tales" || lowerCaseCat === "bedtime") {
    return "#EC4007";
  } else return "black";
};

const getNotificationIcon = (
  category: "security" | "achievement" | "limit"
) => {
  if (category === "security") {
    return <Icon name="ShieldAlert" color="#866EFF" />;
  } else if (category === "achievement") {
    return <Icon name="Star" color="#ECC607" />;
  } else if (category === "limit") {
    return <Icon name="Clock" color="#07CAEC" />;
  } else return <Icon name="Info" color="#EC4007" />;
};

export {
  filterStoriesByTitle,
  getGreeting,
  getCategoryColour,
  getNotificationIcon,
};
