import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import ChildrenEmptyState from "../../../components/emptyState/ChildrenEmptyState";
import ErrorComponent from "../../../components/ErrorComponent";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import { KidProfile } from "../../../types";

const ManageChildProfilesScreen = () => {
  const parentNavigator = useNavigation<ParentsNavigatorProp>();
  const { data, isPending, error, refetch } = useGetUserKids();
  const [selectedKid, setSelectedKid] = useState<string | null>(null);

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
              <ChildItem
                kid={kid}
                key={kid.id}
                selectedKid={selectedKid}
                setSelectedKid={setSelectedKid}
              />
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

const ChildItem = ({
  kid,
  selectedKid,
  setSelectedKid,
}: {
  kid: KidProfile;
  selectedKid: string | null;
  setSelectedKid: Dispatch<SetStateAction<string | null>>;
}) => {
  const parentNavigator = useNavigation<ParentsNavigatorProp>();

  const toggleShowKid = (id: string) => {
    console.log("kid id", id);
    if (selectedKid === id) {
      setSelectedKid(null);
      return;
    }
    setSelectedKid(id);
  };

  return (
    <View className="flex  px-3 bg-white  py-3.5 rounded-2xl items-center flex-row gap-x-2.5">
      <Image
        source={require("../../../assets/placeholder-pfp.png")}
        className="size-[60px]"
      />
      <View className="flex flex-1 flex-col gap-y-2.5">
        <Text className="font-[quilka] text-xl capitalize">{kid.name}</Text>
        <Text className="text-sm font-[abeezee]">Age {kid.ageRange} Years</Text>
      </View>
      <View className="flex flex-row gap-x-3  relative">
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
        <Icon name="EllipsisVertical" onPress={() => toggleShowKid(kid.id)} />
        {selectedKid === kid.id ? (
          <View className="absolute bottom-10 z-10 right-0 py-4  bg-bgLight rounded-3xl px-10">
            <Pressable onPress={() => console.log("current kid", selectedKid)}>
              <Text>View kid</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
};
