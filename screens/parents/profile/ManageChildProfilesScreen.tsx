import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import ChildrenEmptyState from "../../../components/emptyState/ChildrenEmptyState";
import ErrorComponent from "../../../components/ErrorComponent";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/uI/CustomButton";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import { ParentsNavigatorProp } from "../../../Navigation/parents/ParentsNavigator";

const ManageChildProfilesScreen = () => {
  const parentNavigator = useNavigation<ParentsNavigatorProp>();
  const { data, isPending, error, refetch } = useGetUserKids();

  if (isPending)
    return <LoadingOverlay visible={isPending} label="Loading..." />;

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="flex min-h-full  flex-col gap-y-12"
    >
      <PageTitle
        title="Manage Child Profiles"
        goBack={() =>
          parentNavigator.navigate("profile", { screen: "indexPage" })
        }
      />
      {data.length ? (
        <View className="flex flex-col gap-y-4 mx-4 mb-5 flex-1 sm:mx-auto max-w-screen-md sm:w-full">
          <View className="flex-1 flex-col gap-4 sm:gap-10">
            {data.map((kid) => (
              <View
                key={kid.id}
                className="flex  px-3 bg-white  py-3.5 rounded-2xl items-center flex-row gap-x-2.5"
              >
                <Image
                  source={require("../../../assets/placeholder-pfp.png")}
                  className="size-[60px]"
                />
                <View className="flex flex-1 flex-col gap-y-2.5">
                  <Text className="font-[quilka] text-xl capitalize">
                    {kid.name}
                  </Text>
                  <Text className="text-sm font-[abeezee]">
                    Age {kid.ageRange} Years
                  </Text>
                </View>
                <View className="flex flex-row gap-x-3">
                  <Pressable
                    onPress={() =>
                      parentNavigator.navigate("profile", {
                        screen: "editChildProfile",
                        params: {
                          ageRange: kid.ageRange,
                          name: kid.name,
                          imageUrl: kid.avatar,
                          id: kid.id,
                        },
                      })
                    }
                  >
                    <Icon name="Pen" />
                  </Pressable>
                  <Icon name="EllipsisVertical" />
                </View>
              </View>
            ))}
          </View>
          <CustomButton
            text="Add Child"
            onPress={() =>
              parentNavigator.navigate("profile", { screen: "addChild" })
            }
          />
        </View>
      ) : (
        <ChildrenEmptyState
          navigate={() =>
            parentNavigator.navigate("profile", { screen: "addChild" })
          }
        />
      )}
    </ScrollView>
  );
};

export default ManageChildProfilesScreen;
