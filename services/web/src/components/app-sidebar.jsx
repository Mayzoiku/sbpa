import * as React from "react";
import {
  IconCoin,
  IconCreditCard,
  IconInnerShadowTop,
  IconMessage,
  IconSmartHome,
} from "@tabler/icons-react";
import { NavQuickActions } from "@/components/nav-quick-actions";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import AddWalletForm from "@/components/add-wallet-form";
import AddTransactionForm from "@/components/add-transaction-form";
import { NavLink } from "react-router-dom";

const data = {
  user: {
    name: "Maygrace Zoiku",
    email: "maygracezoiku@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: IconSmartHome,
    },
    {
      title: "AI Chat",
      url: "/dashboard/chat",
      icon: IconMessage,
    },
  ],
  navSecondary: [],
  quickActions: [
    {
      name: "Create New Wallet",
      form: AddWalletForm,
      icon: IconCreditCard,
    },
    {
      name: "Add New Transaction",
      form: AddTransactionForm,
      icon: IconCoin,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <NavLink to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">spba.</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavQuickActions items={data.quickActions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
