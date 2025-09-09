import React from "react";
import UniversityCardGrid from "./UniversityCardGrid";
const universityData = [
  {
    id: 1,
    name: "Standford University",
    location: "California, USA",
    tuition: 74029,
    satRange: "1470-1570",
    acceptanceRate: 4,
    logo: <PlaceholderLogo bgColor="#B91C1C" />,
  },
  {
    id: 2,
    name: "Harvard University",
    location: "Massachusetts, USA",
    tuition: 78200,
    satRange: "1460-1580",
    acceptanceRate: 5,
    logo: <PlaceholderLogo bgColor="#A51C30" />,
  },
  {
    id: 3,
    name: "MIT",
    location: "Massachusetts, USA",
    tuition: 82730,
    satRange: "1510-1580",
    acceptanceRate: 7,
    logo: <PlaceholderLogo bgColor="#8A8B8C" />,
  },
  {
    id: 4,
    name: "Yale University",
    location: "Connecticut, USA",
    tuition: 84525,
    satRange: "1460-1570",
    acceptanceRate: 6,
    logo: <PlaceholderLogo bgColor="#00356B" />,
  },
];
export default function UniGrid() {
  return (
    <div>
      <UniversityCardGrid data={universityData} />
    </div>
  );
}
