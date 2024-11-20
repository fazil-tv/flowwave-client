import { ReactNode } from "react";
import { TabsDemo } from "./_components/tabs";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="">
      <TabsDemo />
     {children}
    </main>
  );
}
