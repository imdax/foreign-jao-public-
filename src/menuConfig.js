// src/menuConfig.js
import Dashboard from "./Pages/Dashboard";
import Colleges from "./Pages/Collegedetails";
import Courses from "./Pages/Courses";
import CourseDetails from "./Pages/CourseDetails";
import ExploreCollege from "./Pages/ExploreCollege";
import LiveSessions from "./Pages/LiveSessionPage";
import LiveSessionDetails from "./Pages/LiveSessionDetailsPage";
import Students from "./Pages/ProfilePage";
import TaskListing from "./Pages/TaskListing";
import Tests from "./Pages/TestSummaryPage";
import AssetPage from "./Pages/AssetPage";
import MyCollegeApplication from "./Pages/MyCollegeApplication";

export const menuItems = [
  {
    name: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "College Finder",
    icon: "college-finder",
    path: "/colleges",
    component: ExploreCollege,
  },
  {
    name: "Assets",
    icon: "assests",
    path: "/assets",
    component: AssetPage,
  },
  {
    name: "Courses",
    icon: "courses",
    path: "/courses", // ✅ lowercase
    component: Courses,
  },
  {
    name: "Live Sessions",
    icon: "live-sessions",
    path: "/live-sessions",
    component: LiveSessions,
  },
  {
    name: "Students Profile",
    icon: "students",
    path: "/students",
    component: Students,
  },
  {
    name: "Tests & Papers",
    icon: "test-papers",
    path: "/test-summary",
    component: Tests,
  },
  {
    name: "My Applications",
    icon: "test-papers",
    path: "/my-applications",
    component: MyCollegeApplication,
  },
];
