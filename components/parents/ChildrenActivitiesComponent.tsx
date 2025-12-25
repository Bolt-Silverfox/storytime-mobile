import { ImageBackground, Pressable, Text, View } from "react-native";
import Icon from "../Icon";

const ChildrenActivitiesComponent = () => {
  const dummyData = [
    {
      text: "Know the challenge your kids have completed",
      buttonText: "Track challenges",
      image: require("../../assets/images/rainbow.jpg"),
      bgColor: "#4807EC",
      id: "1",
    },
    {
      text: "Keep track of the stories your kids are listening to",
      buttonText: "Track stories",
      image: require("../../assets/images/sunrise.jpg"),
      bgColor: "#EC4007",
      id: "2",
    },
  ];
  return (
    <View className="flex flex-col gap-y-4 border-b-border-light border-b pb-8">
      <Text className="font-[abeezee] text-base text-black">
        Children activities
      </Text>
      <View className="flex flex-row gap-x-3">
        {dummyData.map((item) => (
          <ImageBackground
            key={item.id}
            source={item.image}
            resizeMode="cover"
            className="flex-1 flex-col justify-end rounded-xl overflow-hidden p-1.5 h-[300px]"
          >
            <View
              style={{ backgroundColor: item.bgColor }}
              className="py-3 flex flex-col gap-y-3 w-full rounded-xl px-2"
            >
              <Text className="w-full text-wrap font-[abeezee] text-base leading-5 text-white">
                {item.text}
              </Text>
              <Pressable className="flex py-2 bg-white rounded-full px-4 flex-row justify-between items-center">
                <Text className="font-[abeezee] text-xs">
                  {item.buttonText}
                </Text>
                <Icon name="ArrowRight" size={16} />
              </Pressable>
            </View>
          </ImageBackground>
        ))}
      </View>
    </View>
  );
};

export default ChildrenActivitiesComponent;
