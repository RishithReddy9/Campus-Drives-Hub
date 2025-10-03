'use client'
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@heroui/button";
import {Tooltip} from "@heroui/tooltip";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@heroui/navbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Session } from "next-auth";
import { useEffect } from "react";

export default function NavbarTop() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const hideAuthButtons = pathname === "/login";
  return (
      <Navbar classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}>
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <Link href={"/"}>
        <p className="font-bold text-inherit">Campus Drives Hub</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem data-active={pathname.startsWith("/drives")}>
          <Link color="foreground" href="/drives">
            Drives
          </Link>
        </NavbarItem>
        <NavbarItem data-active={pathname.startsWith("/resources")}>
          <Link aria-current="page" href="/resources">
            Resources
          </Link>
        </NavbarItem>
        <NavbarItem data-active={pathname.startsWith("/calendar")}>
          <Link color="foreground" href="/calendar">
            <Tooltip content="Placement Calendar" placement="bottom">
              <Calendar size={22} />
            </Tooltip>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {session && session.user.role==='admin' &&
          <NavbarItem data-active={pathname.startsWith("/admin")} className="hidden lg:flex">
            <Link href="/admin">Admin</Link>
          </NavbarItem>
        }
        { !hideAuthButtons && 
            (session ? (
              <NavbarItem>
                <Button color="primary" onPress={() => signOut({ callbackUrl: "/" })} variant="flat">
                  Logout
                </Button>
              </NavbarItem> ) : (
              <NavbarItem>
                <Button color="primary" onPress={() => signIn(undefined, { callbackUrl: "/drives" })}>
                  Login
                </Button>
              </NavbarItem> )
            )
        }
        <NavbarItem>
          <ThemeSwitcher/>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
      
  );
}
