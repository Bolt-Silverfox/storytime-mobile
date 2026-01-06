import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ReportsSreen from "../screens/parents/reports/ReportsSreen";
import ReportDetailScreen from "../screens/parents/reports/ReportDetailScreen";
import PDFReportPreviewScreen from "../screens/parents/reports/downloadReport";
import { KidStats } from "../hooks/tanstack/queryHooks/useGetReportByKidId";

export type ParentReportNavigatorParamList = {
  home: undefined;
  reportDetails: { childId: string };
  pdfReportPreview: { 
    childId: string; 
    weekRange: string;
    reportData: KidStats;
  };
};

type ParntReportNavigatorProp =
  NativeStackNavigationProp<ParentReportNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentReportNavigatorParamList>();

const ParentReportNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={ReportsSreen} />
      <Stack.Screen name="reportDetails" component={ReportDetailScreen} />
      <Stack.Screen name="pdfReportPreview" component={PDFReportPreviewScreen} />
    </Stack.Navigator>
  );
};

export type { ParntReportNavigatorProp };
export default ParentReportNavigator;
