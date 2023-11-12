import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import ThemeSwitch from "./ThemeSwitch";

function Header() {
  const path = usePathname();
  const session = useSession();
  const user = session.data?.user;

  const handleTitleClick = () => {
    if (!user) void signIn();
  };

  return (
    <div className="relative h-28 w-full">
      <div className="fixed left-0 right-0 top-0 z-20">
        <nav className="w-full bg-[#464e56] px-14 pb-2 pt-4 text-gray-50 ">
          <ul className=" flex gap-10 text-xs">
            <li className="relative">
              <Link href="/">
                Home
                {!path.includes("profiles") && (
                  <motion.div
                    layoutId="pointer"
                    className=" absolute -bottom-[8px] h-2 w-full border-x-[16px] border-b-[8px] border-x-[#464e56]   border-b-[#26b0b1]"
                  ></motion.div>
                )}
              </Link>
            </li>
            <li className="relative">
              {user && (
                <Link href={`/profiles/${user.id}`}>
                  Profile
                  {path.includes("profiles") && (
                    <motion.div
                      layoutId="pointer"
                      className=" absolute -bottom-[8px] h-2 w-full border-x-[20px] border-b-[8px] border-x-[#464e56]  border-b-[#26b0b1]"
                    ></motion.div>
                  )}
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <div
          className="vi-[#1373aa] flex h-16  items-center bg-gradient-to-r from-[#26b0b1] from-[60%] to-[#0034a3] pl-12 sm:pl-40
        "
        >
          <h1
            onClick={handleTitleClick}
            className=" cursor-pointer text-xl font-extrabold text-gray-50 sm:text-2xl"
          >
            Shout Out
          </h1>
          <div className=" my-auto flex flex-grow items-end justify-end pr-12 ">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
