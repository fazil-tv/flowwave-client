"use client";

import { useRouter, usePathname, useParams } from "next/navigation";

export function Tabs() {
  const router = useRouter();
  const pathname = usePathname();


  const tabs = [
    { title: "Peoples", value: "peoples", path: `/people/people` },
    { title: "Teams", value: "teams", path: `/people/teams` },
  ];



  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex space-x-4 py-10">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.path)}
          className={`px-4 py-2 rounded-lg ${
            pathname === tab.path ? " text-white border-b-4 border-purple-700 rounded-none !mx-3 !px-5 " : "text-white  !mx-3 !px-5"
          }`}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}
