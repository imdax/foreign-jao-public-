import React from "react";

const Announcements = () => {
  const announcements = [
    {
      name: "Lana Steiner",
      time: "21 days ago",
      linkText: "Posted as announcements",
      text: "This is going to be the placeholder for the announcement which will be posted by the instructor of the course. This is going to be the placeholder for the announcement which will be posted by the instructor of the courseThis is going to be the placeholder for the announcement which will be posted by the instructor of the courseThis is going to be the placeholder for the announcement which will be posted by the instructor of the course",
    },
    {
      name: "Lana Steiner",
      time: "21 days ago",
      linkText: "Posted as announcements",
      text: "This is going to be the placeholder for the announcement which will be posted by the instructor of the course. This is going to be the placeholder for the announcement which will be posted by the instructor of the courseThis is going to be the placeholder for the announcement which will be posted by the instructor of the courseThis is going to be the placeholder for the announcement which will be posted by the instructor of the course",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6 ml-70 mt-3 mr-4">
      {/* Header */}
      <h2 className="text-lg font-semibold">Announcements</h2>
      <p className="text-sm text-gray-500 mb-4">
        View all the announcements which has been announced by the instructor
      </p>
      <hr className="mb-4 border-gray-200" />

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((item, index) => (
          <div key={index} className="flex gap-4">
            {/* Avatar */}
            <img
              src="/assets/profile.png" // ✅ Direct path
              alt={item.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Content */}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {item.name}{" "}
                <span className="text-xs text-gray-500">{item.time}</span>
              </p>
              <a
                href="#"
                className="text-sm text-purple-600 font-medium block mt-1"
              >
                {item.linkText}
              </a>
              <p className="text-sm text-gray-600 mt-1">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
