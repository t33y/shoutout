import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className=" fixed left-0 top-24 py-4 dark:text-white sm:px-2">
      <ul className="flex h-screen flex-col items-start gap-2 whitespace-nowrap ">
        <li>
          <Link href="/">
            <IconHoverEffect>
              <span className=" flex items-center gap-4">
                <VscHome className=" h-8 w-8" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <span className=" flex items-center gap-4">
                  <VscAccount className=" h-8 w-8" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        <li>
          {user == null ? (
            <button
              onClick={() => {
                void signIn();
              }}
            >
              <IconHoverEffect>
                <span className=" flex items-center gap-4">
                  <VscSignIn className=" h-8 w-8 fill-green-700" />
                  <span className="hidden text-lg text-green-700 md:inline">
                    Log in
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          ) : (
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <span className=" flex items-center gap-4">
                  <VscSignOut className=" h-8 w-8  fill-red-700" />
                  <span className="hidden text-lg text-red-700 md:inline">
                    Log out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
