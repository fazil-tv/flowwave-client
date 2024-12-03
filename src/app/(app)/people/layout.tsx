import { ReactNode } from "react";
import { Tabs } from "./_components/tabs";

type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <main className="">
            <Tabs />
            {children}
        </main>
    );
}
