import { ScrollView, Text, View } from "react-native";
import PageTitle from "../PageTitle";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import { DisclaimerData } from "../../types";

const DisclaimerInformationComponent = ({
  goBack,
  pageTitle,
  data,
}: {
  goBack: () => void;
  pageTitle: string;
  data: DisclaimerData;
}) => {
  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight">
        <PageTitle title={pageTitle} goBack={goBack} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-col gap-y-8"
          className="mx-4 mb-5 pt-5"
        >
          {data.map((item, itemIndex) => (
            <View
              key={`${itemIndex}-${item.title ?? "section"}`}
              className="flex flex-col"
            >
              {item.title && (
                <Text className="font-[abeezee] text-[18px] text-black">
                  {item.index && item.index + "."} {item.title}
                </Text>
              )}
              {item.paragraph?.map((p, paragraphIndex) => {
                if (typeof p === "string")
                  return (
                    <Text
                      key={`paragraph-${paragraphIndex}-${itemIndex}`}
                      className="mt-3 font-[abeezee] text-base text-text"
                    >
                      {p}
                    </Text>
                  );
                return (
                  <Text
                    key={`paragraph-${paragraphIndex}-${itemIndex}`}
                    className={`ml-2 font-[abeezee] text-base text-text ${p.index === 1 && "mt-3"}`}
                  >
                    {p.index}. {p.text}
                  </Text>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default DisclaimerInformationComponent;
