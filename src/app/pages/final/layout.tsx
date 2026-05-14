"use client"
import { RecoilRoot } from "recoil";

export default function resultLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return(
        <RecoilRoot>
            {children}
        </RecoilRoot>
    );
  }