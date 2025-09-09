import React from "react";
import {
  PlayCircle,
  Star,
  Users,
  Clock,
  MapPin,
  Download,
  FileText,
  MoreHorizontal,
  Send,
  ChevronLeft,
} from "lucide-react";

export default function LiveSessionDetails() {
  return (
    <div className="min-h-screen p-8 font-sans text-[#223]">
      <div className="max-w-[1220px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
              <ChevronLeft className="w-5 h-5 text-[#334155]" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">
                Data Structures & Algorithm - Live Session
              </h1>
              <p className="text-sm text-[#5b6470] mt-1 flex items-center gap-2">
                <img
                  src="/assets/US.png"
                  alt="us"
                  className="w-4 h-4 rounded-sm"
                />
                By Professor Aristor, Stanford University
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 bg-white text-sm px-4 py-2 rounded-xl shadow-md">
            <Download className="w-4 h-4 text-[#5b6470]" />
            <span className="text-[#374151]">Download Resource</span>
          </button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src="/assets/course.png"
                  alt="course"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute left-6 bottom-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow">
                    <PlayCircle className="w-7 h-7 text-[#6b46ff]" />
                  </div>
                  <div className="w-[620px] h-3 bg-white bg-opacity-60 rounded-full hidden md:block">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">
                  Deep learning language modal - Machine Learning Course
                </h3>
                <p className="text-sm text-[#6b7280] mb-4">
                  View all the basic details regarding the ongoing course
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-[#eef2ff] shadow-sm flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#faf5ff]">
                      <Star className="w-5 h-5 text-[#7c3aed]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6b7280]">Ratings</div>
                      <div className="font-semibold">4.5/5</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-[#eef2ff] shadow-sm flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#faf5ff]">
                      <Users className="w-5 h-5 text-[#7c3aed]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6b7280]">
                        Enrolled Students
                      </div>
                      <div className="font-semibold">14,500</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-[#eef2ff] shadow-sm flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#faf5ff]">
                      <Clock className="w-5 h-5 text-[#7c3aed]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6b7280]">
                        Course Duration
                      </div>
                      <div className="font-semibold">6 Months</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-[#eef2ff] shadow-sm flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#faf5ff]">
                      <MapPin className="w-5 h-5 text-[#7c3aed]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6b7280]">Location</div>
                      <div className="font-semibold flex items-center gap-2">
                        Stanford University, New jersey{" "}
                        <img
                          src="/assets/US.png"
                          className="w-4 h-4"
                          alt="flag"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Documents Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-2">
                Associated Documents
              </h4>
              <p className="text-sm text-[#6b7280] mb-4">
                View all the documents which are associated with the live
                session
              </p>

              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-4 border-2 border-[#efe7ff] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-[#fff] border border-[#ede9ff]">
                        <FileText className="w-5 h-5 text-[#7c3aed]" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          Weekly Assignment_01
                        </div>
                        <div className="text-xs text-[#9aa0a6]">
                          200 KB - 100% uploaded
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full border border-[#efe7ff] flex items-center justify-center">
                        <MoreHorizontal className="w-4 h-4 text-[#6b7280]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Live Chat */}
          <div style={{ width: 340 }} className="flex flex-col">
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold">Live Chat</h5>
                <button className="text-sm text-[#6b7280]">...</button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mt-78">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <img
                      src="/assets/Avatar.png"
                      className="w-10 h-10 rounded-full"
                      alt="a"
                    />
                    <div>
                      <div className="text-sm font-semibold">
                        Mollie Hall{" "}
                        <span className="text-xs text-[#9aa0a6] font-normal">
                          Today 2:20pm
                        </span>
                      </div>
                      <div className="mt-2 bg-[#f3f4f6] p-3 rounded-2xl text-sm max-w-[220px]">
                        Chat message placeholder...
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bottom-0 bg-white pt-2">
                <div className="flex items-center gap-3">
                  <input
                    className="flex-1 border border-[#e6e9ef] rounded-xl px-4 py-2 text-sm"
                    placeholder="Send a message"
                  />
                  <button className="inline-flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2 rounded-lg">
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Send message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
