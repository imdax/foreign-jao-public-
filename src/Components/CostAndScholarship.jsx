import React from "react";
import {
  DollarSign,
  Percent,
  Users,
  Calendar,
  GraduationCap,
  BookUser,
  Globe,
  Award,
} from "lucide-react";

/** Reusable card */
const InfoCard = ({ title, subtitle, children }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200/80">
    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-1">{subtitle}</p>
    {/* ✅ no extra mt here */}
    <div className="mt-6">{children}</div>
  </div>
);

/** Reusable info item */
const InfoItem = ({
  icon: Icon,
  label,
  value,
  iconColorClass = "text-purple-600",
}) => (
  <div className="flex items-start space-x-4">
    <div className={`p-2 bg-purple-100/60 rounded-lg ${iconColorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-semibold text-lg">{value}</p>
    </div>
  </div>
);

/** Tag component */
const Tag = ({ children, color = "purple" }) => {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  const dotClasses = {
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    indigo: "bg-indigo-500",
  };

  const classes = colorClasses[color] || colorClasses.purple;
  const dot = dotClasses[color] || dotClasses.purple;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classes}`}
    >
      <span className={`w-2 h-2 mr-2 rounded-full ${dot}`} />
      {children}
    </span>
  );
};

const CostAndScholarship = ({ college = {} }) => {
  // Financials
  const inStateCost =
    college.inStateCost ||
    college.in_state_cost ||
    college.cost_in_state ||
    college.cost ||
    "$74,029";
  const outStateCost =
    college.outStateCost ||
    college.out_of_state_cost ||
    college.cost_out_state ||
    "$74,029";
  const tuition =
    college.tuition || college.fees || college.inStateTutionFees || "$74,029";
  const roomBoard = college.roomBoard || college.room_and_board || "$17,029";
  const avgAid =
    college.avgAid ||
    college.average_aid ||
    college.average_total_aid ||
    "$5,029";
  const loanPercent =
    college.loanPercent ||
    college.graduateAwardedLoans ||
    (typeof college.loan_percent === "number"
      ? `${college.loan_percent}%`
      : college.loan_percent) ||
    "5%";

  // Application methods
  const applicationMethods = college.applicationMethods ||
    college.application_methods ||
    college.application_options || [
      "Accepts Common Application",
      "SAR/ACT",
      "Class Rank",
      "TOEFL",
    ];

  // Academics
  const studentFaculty =
    college.academics?.studentFacultyRatio ||
    college.studentFacultyRatio ||
    "5:1";
  const academicCalendar =
    college.academics?.calendar ||
    college.academicCalendar ||
    college.calendar ||
    "Quarter";
  const popularCourses = college.academics?.popularCourses ||
    college.popularCourses || [
      "Art",
      "STEM",
      "Sociology",
      "Business",
      "Humanities",
    ];

  // Students
  const fullTimeEnrollment =
    college.students?.fullTimeEnrollment ||
    college.full_time_enrollment ||
    college.enrollment ||
    "7,600";
  const admissionPolicy =
    college.students?.admissionPolicy || college.admission_policy || "Co-ed";
  const internationalPct =
    college.students?.internationalPct ||
    college.international_students ||
    college.internationalPct ||
    "15%";
  const retentionRate =
    college.students?.retentionRate || college.retention_rate || "99%";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cost & Scholarships */}
      <InfoCard
        title="Cost & Scholarships"
        subtitle="View all the financial details of the college"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem
            icon={DollarSign}
            label="In State Cost"
            value={inStateCost}
          />
          <InfoItem
            icon={DollarSign}
            label="Out of State Cost"
            value={outStateCost}
          />
          <InfoItem icon={DollarSign} label="Tuition / Fees" value={tuition} />
          <InfoItem icon={DollarSign} label="Room & Board" value={roomBoard} />
          <InfoItem
            icon={DollarSign}
            label="Average Total Aid Awarded"
            value={avgAid}
          />
          <InfoItem
            icon={Percent}
            label="Graduate Awarded Loans"
            value={loanPercent}
          />
        </div>
      </InfoCard>

      {/* Application */}
      <InfoCard
        title="Application"
        subtitle="View all the details required to file application"
      >
        <div className="flex flex-wrap gap-3">
          {applicationMethods.map((m, i) => (
            <Tag key={i}>{m}</Tag>
          ))}
        </div>
      </InfoCard>

      {/* Academics */}
      <InfoCard title="Academics" subtitle="View all the academic details">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <InfoItem
            icon={Users}
            label="Student Faculty Ratio"
            value={studentFaculty}
          />
          <InfoItem
            icon={Calendar}
            label="Academic Calendar"
            value={academicCalendar}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Most Popular Courses
        </h3>
        <div className="flex flex-wrap gap-3">
          {popularCourses.map((c, idx) => (
            <Tag
              key={idx}
              color={
                idx % 6 === 0
                  ? "purple"
                  : idx % 6 === 1
                  ? "pink"
                  : idx % 6 === 2
                  ? "blue"
                  : idx % 6 === 3
                  ? "green"
                  : idx % 6 === 4
                  ? "indigo"
                  : "yellow"
              }
            >
              {c}
            </Tag>
          ))}
        </div>
      </InfoCard>

      {/* Students */}
      <InfoCard title="Students" subtitle="View all the student metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoItem
            icon={GraduationCap}
            label="Full-time enrollment"
            value={fullTimeEnrollment}
          />
          <InfoItem
            icon={BookUser}
            label="Admission Policy"
            value={admissionPolicy}
          />
          <InfoItem
            icon={Globe}
            label="International Students"
            value={internationalPct}
          />
          <InfoItem icon={Award} label="Retention Rate" value={retentionRate} />
        </div>
      </InfoCard>
    </div>
  );
};

export default CostAndScholarship;
