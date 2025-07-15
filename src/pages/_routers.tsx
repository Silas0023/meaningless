import LogsPage from "./logs";
import ProxiesPage from "./proxies";
import ProfilesPage from "./profiles";
import SettingsPage from "./settings";
import ConnectionsPage from "./connections";
import RulesPage from "./rules";
import Combo from "./combo";
import OrderPage from "./order";
import AppPage from "./app-store";
import SharePage from "./share";
import TicketPage from "./ticket";
import UserPage from "./user";

import RocketIcon from "@mui/icons-material/Rocket";
import AppsIcon from "@mui/icons-material/Apps";
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewListIcon from "@mui/icons-material/ViewList";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
export const routers = [
  {
    label: "Label-Proxies",
    link: "/",
    ele: ProxiesPage,
    icon: <RocketIcon />,
  },
  // {
  //   label: "Label-Profiles",
  //   link: "/profile",
  //   ele: ProfilesPage,
  // },
  // {
  //   label: "Label-Connections",
  //   link: "/connections",
  //   ele: ConnectionsPage,
  // },
  // {
  //   label: "Label-Rules",
  //   link: "/rules",
  //   ele: RulesPage,
  // },
  // {
  //   label: "Label-Logs",
  //   link: "/logs",
  //   ele: LogsPage,
  // },
  // {
  //   label: "Label-Settings",
  //   link: "/settings",
  //   ele: SettingsPage,
  // },
  {
    label: "Label-App",
    link: "/app",
    ele: AppPage,
    icon: <AppsIcon />,
  },
  {
    label: "Label-Combo",
    link: "/combo",
    ele: Combo,
    icon: <InventoryIcon />,
  },

  {
    label: "Label-Order",
    link: "/order",
    ele: OrderPage,
    icon: <ViewListIcon />,
    // children: [
    //   {
    //     label: "order-item",
    //     link: "/order/:id",
    //     element: OrderItem,
    //     // loader: eventLoader,
    //   },
    // ],
  },
  {
    label: "Label-Share",
    link: "/shares",
    ele: SharePage,
    icon: <ScreenShareIcon />,
  },

  {
    label: "Label-Ticket",
    link: "/ticket",
    ele: TicketPage,
    icon: <ChatIcon />,
  },
  // {
  //   label: "Label-User",
  //   link: "/user",
  //   ele: UserPage,
  // },
];
