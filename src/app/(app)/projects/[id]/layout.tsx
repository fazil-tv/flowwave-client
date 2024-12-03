import { ReactNode } from "react";
import { SideBar } from "./_components/tabs";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="">
      <SideBar />
     {children}
    </main>
  );
}
