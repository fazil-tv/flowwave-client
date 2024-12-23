"use client";

import { useRouter, usePathname, useParams } from "next/navigation";

export function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const tabs = [

    { title: "Dashboard", value: "Dashboard", path: `/projects/${id}/dashboard` },
    { title: "Projects", value: "Projects", path: `/projects/${id}/project` },
    { title: "Tasks", value: "tasks", path: `/projects/${id}/tasks` },
    { title: "Members", value: "Members", path: `/projects/${id}/members` },

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
