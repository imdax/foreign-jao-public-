// src/Components/CourseTab.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  DollarSign,
  Target,
  Heart,
  MapPin,
  Globe,
  Percent,
  Calendar,
  Users,
  BookOpen,
  ClipboardList,
  Award,
} from "lucide-react";

/* --- Reusable UI pieces --- */
const InfoCard = ({ title, subtitle, children, id }) => (
  <section
    id={id}
    className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200/80 scroll-mt-28"
  >
    <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>

    {/* Divider under subtitle (matches screenshot) */}
    <div className="mt-4 border-t border-gray-200" />

    {/* add some top padding so content sits nicely under the line */}
    <div className="mt-6">{children}</div>
  </section>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-gray-500 text-xs md:text-sm">{label}</p>
      <p className="text-gray-800 font-semibold text-sm md:text-base">
        {value}
      </p>
    </div>
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-block text-xs md:text-sm px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
    {children}
  </span>
);

const Tag = ({ children }) => (
  <span className="inline-block text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 mr-2 mb-2">
    {children}
  </span>
);

/* --- Main component: supports props from parent or local state --- */
export default function CourseTab(props) {
  const {
    courses: propCourses,
    activeCourseIndex: propActiveIndex,
    setActiveCourseIndex: propSetIndex,
  } = props || {};

  const [localCourses] = useState([
    {
      name: "Stanford Medical Science College",
      overview: {
        fees: "$74,029",
        satRange: "1470-1570",
        acceptanceRate: "4%",
        location: "123, ABC Road, USA",
        website: "www.stanford.com",
        actRange: "34-36",
      },
      costAndScholarship: {
        inStateCost: "$74,029",
        outStateCost: "$74,029",
        inStateTuitionFee: "$74,029",
        roomAndBoard: "$17,029",
        averageTotalAidAwarded: "$5,029",
        graduateAwardedLoan: "5%",
      },
      application: [
        "Accepts Common Application",
        "SAT/ACT",
        "Class Rank",
        "TOEFL",
      ],
      academics: {
        studentFacultyRatio: "5:1",
        academicCalendar: "Quarter",
        popularCourses: ["Art", "STEM", "Sociology", "Business"],
      },
      students: {
        fullTimeEnrollment: "7,600",
        admissionPolicy: "Co-ed",
        internationalStudents: "15",
        retentionRate: "99",
      },
    },
  ]);

  // Use parent-provided courses if defined, otherwise fallback
  const courses = propCourses !== undefined ? propCourses : localCourses;

  // Active course index (prop-controlled if parent provides handlers)
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex =
    typeof propActiveIndex === "number" ? propActiveIndex : internalActiveIndex;
  const setActiveIndex =
    typeof propSetIndex === "function" ? propSetIndex : setInternalActiveIndex;

  // If parent passed explicit empty array, show message
  if (Array.isArray(propCourses) && propCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="p-6 bg-white rounded-xl border">
          <h3 className="text-lg font-semibold mb-2">No courses available</h3>
          <p className="text-gray-500">
            This college doesn't have any courses listed yet.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!Array.isArray(courses)) return;
    if (activeIndex >= courses.length && courses.length > 0) {
      setActiveIndex(0);
    }
  }, [courses, activeIndex, setActiveIndex]);

  const activeCourse = courses?.[activeIndex] ?? null;

  // Section keys
  const sectionKeys = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "cost", label: "Cost & Scholarships" },
      { id: "application", label: "Application" },
      { id: "academics", label: "Academics" },
      { id: "students", label: "Students" },
      { id: "similar", label: "Similar Colleges" },
    ],
    []
  );

  // Refs for each section
  const sectionRefs = useRef({});
  sectionKeys.forEach((s) => {
    if (!sectionRefs.current[s.id])
      sectionRefs.current[s.id] = React.createRef();
  });

  // active section id used for highlight
  const [activeSection, setActiveSection] = useState(sectionKeys[0].id);

  useEffect(() => {
    // IntersectionObserver configuration:
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length === 0) return;

      const chosen = intersecting.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      )[0];
      const id = chosen.target.getAttribute("id");
      if (id) setActiveSection(id);
    }, observerOptions);

    // observe sections
    Object.values(sectionRefs.current).forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [sectionKeys]);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id]?.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  // -----------------------------------------
  // Tab underline indicator logic
  // -----------------------------------------
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef([]); // will hold refs to each tab button

  // ensure tabRefs length matches courses
  tabRefs.current = courses.map(
    (_, i) => tabRefs.current[i] || React.createRef()
  );

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const measureIndicator = () => {
    const container = tabsContainerRef.current;
    const activeTab = tabRefs.current[activeIndex]?.current;
    if (!container || !activeTab) {
      setIndicator({ left: 0, width: 0, visible: false });
      return;
    }
    const cRect = container.getBoundingClientRect();
    const tRect = activeTab.getBoundingClientRect();
    // left relative to container
    const left = tRect.left - cRect.left;
    const width = tRect.width;
    setIndicator({ left, width, visible: true });
  };

  // measure on mount, on activeIndex change and on resize
  useLayoutEffect(() => {
    measureIndicator();
    // also re-measure after fonts/images load / layout shifts by scheduling a small timeout
    const t = setTimeout(measureIndicator, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, courses.length]);

  useEffect(() => {
    const onResize = () => measureIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to read nested values safely and format display
  const getOverviewValue = (field) => {
    if (!activeCourse) return "-";
    const ov = activeCourse.overview ?? {};
    switch (field) {
      case "fees": {
        const feeVal =
          ov.fees ??
          ov.fee ??
          activeCourse.costAndScholarship?.inStateCost ??
          "-";
        if (typeof feeVal === "number") return `$${feeVal.toLocaleString()}`;
        return feeVal ?? "-";
      }
      case "satRange":
        return ov.satRange ?? activeCourse.satRange ?? "-";
      case "acceptanceRate":
        if (ov.acceptanceRate !== undefined) return `${ov.acceptanceRate}%`;
        if (activeCourse.acceptanceRate !== undefined)
          return `${activeCourse.acceptanceRate}%`;
        return "-";
      case "location":
        return ov.location ?? activeCourse.location ?? "-";
      case "website":
        return ov.website ?? activeCourse.website ?? "-";
      case "actRange":
        return ov.actRange ?? activeCourse.actRange ?? "-";
      default:
        return "-";
    }
  };

  const cost =
    activeCourse?.costAndScholarship ??
    activeCourse?.cost_and_scholarship ??
    activeCourse?.costAndScholarship ??
    {};

  return (
    <div className="bg-gray-50 pb-8">
      {/* Top course tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-gray-200">
          {/* tabs container is relative so we can position the indicator */}
          <div
            ref={tabsContainerRef}
            className="relative flex gap-6 overflow-x-auto py-3 items-center"
            role="tablist"
          >
            {courses.map((c, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={c._id || c.id || c.name || idx}
                  ref={tabRefs.current[idx]}
                  onClick={() => setActiveIndex(idx)}
                  role="tab"
                  aria-selected={isActive}
                  className={`whitespace-nowrap px-1 pb-2 text-sm font-medium transition-all -mb-[1px] ${
                    isActive
                      ? "text-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {c.name || `Course ${idx + 1}`}
                </button>
              );
            })}

            {/* indicator bar positioned absolutely; bottom overlaps border */}
            {indicator.visible && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  height: 3,
                  background: "#7c3aed", // purple-600
                  left: indicator.left,
                  width: indicator.width,
                  bottom: -1, // overlap the container border slightly
                  borderRadius: 3,
                  transition: "left 180ms ease, width 180ms ease",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar: sticky on md+ screens */}
        <nav className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-200 md:sticky md:top-18 self-start">
          <ul className="space-y-2">
            {sectionKeys.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-purple-50 text-purple-700 border-l-4 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{s.label}</span>
                    {isActive}
                    {/* // <span className="text-xs text-purple-600 ml-2">●</span> */}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Overview */}
          <div ref={sectionRefs.current["overview"]}>
            <InfoCard
              id="overview"
              title="Overview"
              subtitle={`View all the basic details of ${
                activeCourse?.name ?? "this course"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem
                  icon={DollarSign}
                  label="Total Tuition Fees"
                  value={getOverviewValue("fees")}
                />
                <InfoItem
                  icon={Target}
                  label="SAT Range"
                  value={getOverviewValue("satRange")}
                />
                <InfoItem
                  icon={Heart}
                  label="Acceptance Rate"
                  value={getOverviewValue("acceptanceRate")}
                />
                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={getOverviewValue("location")}
                />
                <InfoItem
                  icon={Globe}
                  label="Website"
                  value={getOverviewValue("website")}
                />
                <InfoItem
                  icon={Target}
                  label="ACT Range"
                  value={getOverviewValue("actRange")}
                />
              </div>
            </InfoCard>
          </div>

          {/* Cost & Scholarships */}
          <div ref={sectionRefs.current["cost"]}>
            <InfoCard
              id="cost"
              title="Cost & Scholarships"
              subtitle="View all the financial details of the college"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem
                  icon={DollarSign}
                  label="In State Cost"
                  value={cost.inStateCost ?? cost.in_state_cost ?? "-"}
                />
                <InfoItem
                  icon={DollarSign}
                  label="Out of state cost"
                  value={cost.outStateCost ?? cost.out_state_cost ?? "-"}
                />
                <InfoItem
                  icon={DollarSign}
                  label="In State Tuition Fees"
                  value={
                    cost.inStateTuitionFee ?? cost.in_state_tuition_fee ?? "-"
                  }
                />
                <InfoItem
                  icon={ClipboardList}
                  label="Room & Board"
                  value={cost.roomAndBoard ?? cost.room_and_board ?? "-"}
                />
                <InfoItem
                  icon={DollarSign}
                  label="Average Total Aid Awarded"
                  value={
                    cost.averageTotalAidAwarded ??
                    cost.average_total_aid_awarded ??
                    "-"
                  }
                />
                <InfoItem
                  icon={Percent}
                  label="Graduate Awarded Loans"
                  value={
                    cost.graduateAwardedLoan ??
                    cost.graduate_awarded_loan ??
                    "-"
                  }
                />
              </div>
            </InfoCard>
          </div>

          {/* Application */}
          <div ref={sectionRefs.current["application"]}>
            <InfoCard
              id="application"
              title="Application"
              subtitle="View all the details required to file application"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Common application flags
                </p>
                <div className="flex flex-wrap">
                  {(activeCourse?.application ?? []).length > 0 ? (
                    (activeCourse.application || []).map((a, i) => (
                      <Badge key={i}>{a}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No application details provided.
                    </p>
                  )}
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Academics */}
          <div ref={sectionRefs.current["academics"]}>
            <InfoCard
              id="academics"
              title="Academics"
              subtitle="View all the academic details"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem
                    icon={BookOpen}
                    label="Student Faculty Ratio"
                    value={
                      activeCourse?.academics?.studentFacultyRatio ??
                      activeCourse?.academics?.student_faculty_ratio ??
                      "-"
                    }
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Academic Calendar"
                    value={
                      activeCourse?.academics?.academicCalendar ??
                      activeCourse?.academics?.academic_calendar ??
                      "-"
                    }
                  />
                </div>

                <div>
                  <p className="text-gray-500 text-sm mb-3">
                    Most Popular Courses
                  </p>
                  <div className="flex flex-wrap">
                    {(
                      (activeCourse?.academics?.popularCourses ??
                        activeCourse?.academics?.popular_courses) ||
                      []
                    ).length > 0 ? (
                      (
                        activeCourse.academics?.popularCourses ||
                        activeCourse.academics?.popular_courses ||
                        []
                      ).map((t, i) => <Tag key={i}>{t}</Tag>)
                    ) : (
                      <p className="text-gray-500">
                        No popular courses listed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Students */}
          <div ref={sectionRefs.current["students"]}>
            <InfoCard
              id="students"
              title="Students"
              subtitle="View all the student related details"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoItem
                  icon={Users}
                  label="Full-time enrollment"
                  value={
                    activeCourse?.students?.fullTimeEnrollment ??
                    activeCourse?.students?.full_time_enrollment ??
                    "-"
                  }
                />
                <InfoItem
                  icon={ClipboardList}
                  label="Admission Policy"
                  value={
                    activeCourse?.students?.admissionPolicy ??
                    activeCourse?.students?.admission_policy ??
                    "-"
                  }
                />
                <InfoItem
                  icon={Globe}
                  label="International Students"
                  value={
                    activeCourse?.students?.internationalStudents ??
                    activeCourse?.students?.international_students ??
                    "-"
                  }
                />
                <InfoItem
                  icon={Award}
                  label="Retention Rate"
                  value={
                    activeCourse?.students?.retentionRate ??
                    activeCourse?.students?.retention_rate ??
                    "-"
                  }
                />
              </div>
            </InfoCard>
          </div>

          {/* Similar Colleges */}
          <div ref={sectionRefs.current["similar"]}>
            <InfoCard
              id="similar"
              title="Similar Colleges"
              subtitle="Other colleges you may like"
            >
              <div>
                <p className="text-gray-500">
                  Nearby/similar colleges will appear here (if available).
                </p>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// small helper to expose sectionKeys inside same file (used above)
const sectionKeys = [
  { id: "overview", label: "Overview" },
  { id: "cost", label: "Cost & Scholarships" },
  { id: "application", label: "Application" },
  { id: "academics", label: "Academics" },
  { id: "students", label: "Students" },
  { id: "similar", label: "Similar Colleges" },
];
