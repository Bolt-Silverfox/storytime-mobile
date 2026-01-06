import { Pressable, Text, View } from "react-native";
import Icon, { IconName } from "../Icon";
import colours from "../../colours";
import { ValidParentControlsRoutes } from "../../types";

type PropTypes = {
  group: {
    groupName: string;
    routes: {
      route: ValidParentControlsRoutes;
      name: string;
      iconName: IconName;
    }[];
  };
  openModal: (route: ValidParentControlsRoutes) => void;
};

const ParentControlRouteGroup = ({ group, openModal }: PropTypes) => {
  return (
    <View
      key={group.groupName}
      className="flex border flex-col bg-white rounded-3xl p-4 border-border-lighter"
    >
      <Text className="text-[18px] capitalize font-[abeezee] my-3">
        {group.groupName}
      </Text>
      {group.routes.map((route, index) => {
        const isLastItem = index === group.routes.length - 1;
        const borderStyles = isLastItem ? "" : "border-b border-b-black/10";
        return (
          <Pressable
            key={route.name}
            className={`${borderStyles} flex py-4 flex-row items-center gap-x-10`}
            onPress={() => openModal(route.route)}
          >
            <Icon name={route.iconName} color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              {route.name}
            </Text>
            <Icon name={"ChevronRight"} color="black" />
          </Pressable>
        );
      })}
    </View>
  );
};

export default ParentControlRouteGroup;
