"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
// import { getFile } from "@/lib/utils";
// import { useRecoilValue } from "recoil";






const ChevronDownIcon = () => {
  // const file = useRecoilValue(getFile);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-4 w-4 inline-block"
    >
      <path
        fill="currentColor"
        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
      />
    </svg>
  );
};

const Navbar = () => {
  const [dropdownInfo, setDropdownInfo] = useState({
    isDiseaseOpen: false,
    isReadMoreOpen: false,
    isDiseaseFlipped: false,
    isReadMoreFlipped: false,
  });
  const [open, setOpen] = useState(false);

  const handleMouseEnter = (type: string) => {
    setDropdownInfo({
      ...dropdownInfo,
      [`${type}Open`]: true,
      [`${type}Flipped`]: true,
    });
  };

  const handleMouseLeave = (type: string) => {
    setDropdownInfo({
      ...dropdownInfo,
      [`${type}Open`]: false,
      [`${type}Flipped`]: false,
    });
  };

  const handleClick = () => {
    setDropdownInfo({
      isDiseaseOpen: false,
      isReadMoreOpen: false,
      isDiseaseFlipped: false,
      isReadMoreFlipped: false,
    });
    setOpen(!open);
  };

  const { data: session } = useSession();

  return (
    <nav id="top" className="sticky top-0 w-full h-16 md:h-20 mx-auto md:px-12 md:flex md:justify-between md:items-center bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-50 transition-all duration-300">
      <div className="flex justify-between items-center mt-3 md:mt-0">
        <div className="flex items-center mx-2 md:mx-0">
          <Image
            src="/images/Logo.png"
            alt="logo"
            className="cursor-pointer inline h-10 w-12 md:h-12 md:w-12"
            width={48}
            height={40}
          />
          <span className="text-2xl mx-2 md:text-3xl font-extrabold text-slate-800 tracking-tight">Nexus</span>
        </div>
        <span className="md:hidden block mx-4" onClick={() => setOpen(!open)}>
          {open ? <Image
            src="/images/icons8-close.svg"
            alt="menu h-10 cursor-pointer"
            width={30}
            height={25}
          /> : <Image
            src="/images/icons8-menu.svg"
            alt="menu h-10 cursor-pointer"
            width={35}
            height={25}
          />}
        </span>
      </div>
      <ul className={`flex flex-col justify-between items-center gap-6 bg-white md:bg-transparent w-full left-0 z-[-1] absolute md:z-auto md:static md:flex md:w-auto md:flex-row md:items-center md:justify-between md:py-0 py-6 md:pl-0 md:gap-8 md:opacity-100 transition-all ease-in duration-300 shadow-md md:shadow-none ${open ? 'top-[60px] opacity-100' : 'top-[-400px] opacity-0'}`}>
        <li className="text-base font-medium text-slate-600 hover:text-sky-600 transition-colors duration-300 px-2">
          <Link onClick={handleClick} href="/">
            Home
          </Link>
        </li>
        <li className="text-base font-medium text-slate-600 hover:text-sky-600 transition-colors duration-300 px-2 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none">Disease <ChevronDownIcon /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  onClick={handleClick}
                  href={{
                    pathname: "/pages/final/uploadImage",
                    query: { name: "scoliosis" },
                  }}
                >
                  Scoliosis
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={handleClick}
                  href={{
                    pathname: "/pages/final/uploadImage",
                    query: { name: "osteoarthritis" },
                  }}
                >
                  Osteoarthritis
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li className="text-base font-medium text-slate-600 hover:text-sky-600 transition-colors duration-300 px-2 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none">Read More <ChevronDownIcon /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  onClick={handleClick}
                  href={{
                    pathname: "/pages/scoliosis",
                  }}
                >
                  Scoliosis
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={handleClick}
                  href={{
                    pathname: "/pages/osteoarthritis",
                  }}
                >
                  Osteoarthritis
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        {session ? (
          <li className="text-base md:ml-4 px-6 py-2 rounded-full text-white font-medium bg-sky-600 hover:bg-sky-700 hover:shadow-md transition-all duration-300">
            <Link onClick={() => signOut()} href="/">
              Logout
            </Link>
          </li>
        ) : (
          <li className="text-base md:ml-4 px-6 py-2 rounded-full text-white font-medium bg-sky-600 hover:bg-sky-700 hover:shadow-md transition-all duration-300">
            <Link onClick={handleClick} href="/pages/login">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
