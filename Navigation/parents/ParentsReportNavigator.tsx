import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ReportDetailsScreen from "../../screens/parents/reports/ReportDetailsScreen";
import ReportsSreen from "../../screens/parents/reports/ReportsSreen";

type ParentReportNavigatorParamList = {
  home: undefined;
  reportDetails: undefined;
};

type ParntReportNavigatorProp =
  NativeStackNavigationProp<ParentReportNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentReportNavigatorParamList>();

const ParentReportNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={ReportsSreen} />
      <Stack.Screen name="reportDetails" component={ReportDetailsScreen} />
    </Stack.Navigator>
  );
};

export type { ParntReportNavigatorProp };
export default ParentReportNavigator;
