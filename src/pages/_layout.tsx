import dayjs from "dayjs";
import i18next from "i18next";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR, { SWRConfig, mutate } from "swr";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import {
  alpha,
  Backdrop,
  Box,
  CircularProgress,
  Link,
  List,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { routers } from "./_routers";
import { getAxios } from "@/services/api";
import { useVerge } from "@/hooks/use-verge";
import { ReactComponent as LogoSvg } from "@/assets/image/logo.svg";
import { BaseErrorBoundary, Notice } from "@/components/base";
import LayoutItem from "@/components/layout/layout-item";
import LayoutControl from "@/components/layout/layout-control";
import LayoutTraffic from "@/components/layout/layout-traffic";
import UpdateButton from "@/components/layout/update-button";
import useCustomTheme from "@/components/layout/use-custom-theme";
import getSystem from "@/utils/get-system";
import {
  getProfiles,
  patchClashConfig,
  importProfile,
  enhanceProfiles,
  getRuntimeLogs,
  deleteProfile,
  updateProfile,
  openWebUrl,
  changeClashCore,
} from "@/services/cmds";
import useFetch, { Provider } from "use-http";
import "dayjs/locale/zh-cn";
import { useProfiles } from "@/hooks/use-profiles";
import OrderItem from "./order-item";
import ComboItem from "./combo-item";
import { useLockFn, useMount } from "ahooks";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import TicketItem from "./ticket-item";
import { closeAllConnections } from "@/services/api";

dayjs.extend(relativeTime);

const OS = getSystem();

const Layout = () => {
  const { t } = useTranslation();
  const [spin, setSpin] = useState(true);

  const { data: chainLogs = {}, mutate: mutateLogs } = useSWR(
    "getRuntimeLogs",
    getRuntimeLogs
  );
  const { verge, mutateVerge, patchVerge } = useVerge();
  const onChangeData = (patch: Partial<IVergeConfig>) => {
    mutateVerge({ ...verge, ...patch }, false);
  };

  useEffect(() => {
    if (verge.clash_core === "clash-meta") {
      try {
        closeAllConnections();
        changeClashCore("clash").then(() => {
          mutateVerge();
          setTimeout(() => {
            mutate("getClashConfig");
            mutate("getVersion");
            // checkMode()
          }, 100);
        });

        // Notice.success(`Successfully switch to ${core}`, 1000);
      } catch (err: any) {
        // Notice.error(err?.message || err.toString());
      }
    }
  }, [verge]);
  // clash_core

  const { theme } = useCustomTheme();
  const {
    profiles = {},
    activateSelected,
    patchProfiles,
    mutateProfiles,
  } = useProfiles();

  const { theme_blur, language } = verge || {};

  useMount(() => {
    if (OS === "macos") {
      onChangeData({ enable_system_proxy: false });
      patchVerge({ enable_system_proxy: false });
    }
  });

  const { data, loading, response } = useFetch(
    "/api/v1/user/getSubscribe",
    {},
    []
  );

  // const checkMode = useLockFn(async (mode: string) => {
  //   // 断开连接
  //   if (mode !== curMode && verge?.auto_close_connection) {
  //     closeAllConnections();
  //   }
  //   await updateConfigs({ mode });
  //   await patchClashConfig({ mode });
  //   mutateClash();
  // });
  useEffect(() => {
    if (data) {
      profiles.items?.forEach(async (item) => {
        await deleteProfile(item.uid);
      });
      // const url = `https://subconverter.speedupvpn.com/sub?target=clash&url=https%3A%2F%2F23456787.xyz%2Fvb%2Fclient%2Fsubscribe%3Ftoken%3Dd41d8cd98f00b204e9800998ecf8427e&insert=false&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`
      // https://subconverter.speedupvpn.com/sub?target=clash&url=https%3A%2F%2F23456787.xyz%2Fvb%2Fclient%2Fsubscribe%3Ftoken%3Dd41d8cd98f00b204e9800998ecf8427e&insert=false&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true
      // https://aa18.de/api/v1/client/subscribe?token=68d83c8b4ad5f9950ccce5e9354b3e97&flag=clash
      importProfile(data?.subscribe_url + "&flag=yijianlian")
        // importProfile(url)
        .then(() => {
          getProfiles().then((newProfiles) => {
            mutate("getProfiles", newProfiles);

            const remoteItem = newProfiles.items?.find(
              (e) => e.type === "remote"
            );
            if (!newProfiles.current && remoteItem) {
              const current = remoteItem.uid;
              patchProfiles({ current });
              mutateLogs();
              setTimeout(() => activateSelected(), 2000);
            }
          });
        })
        .finally(() => {
          setSpin(false);
        });
    } else {
      setSpin(false);
    }
  }, [data]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      // macOS有cmd+w
      if (e.key === "Escape" && OS !== "macos") {
        appWindow.close();
      }
    });

    listen("verge://refresh-clash-config", async () => {
      // the clash info may be updated
      await getAxios(true);
      mutate("getProxies");
      mutate("getVersion");
      mutate("getClashConfig");
    });

    // update the verge config
    listen("verge://refresh-verge-config", () => mutate("getVergeConfig"));

    // 设置提示监听
    listen("verge://notice-message", ({ payload }) => {
      const [status, msg] = payload as [string, string];
      switch (status) {
        case "set_config::ok":
          Notice.success("Refresh clash config");
          break;
        case "set_config::error":
          Notice.error(msg);
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (language) {
      dayjs.locale(language === "zh" ? "zh-cn" : language);
      i18next.changeLanguage(language);
    }
  }, [language]);

  return (
    <Paper
      square
      elevation={0}
      className={`${OS} layout`}
      onPointerDown={(e: any) => {
        if (e.target?.dataset?.windrag) appWindow.startDragging();
      }}
      onContextMenu={(e) => {
        // only prevent it on Windows
        e.preventDefault();
      }}
      sx={[
        ({ palette }) => ({
          bgcolor: alpha(palette.background.paper, theme_blur ? 0.8 : 1),
        }),
      ]}
    >
      <div className="layout__left" data-windrag>
        <div className="the-logo" data-windrag>
          {/* 一键连加速器 */}
          {/* <LogoSvg /> */}

          {/* {!(OS === "windows" && WIN_PORTABLE) && (
                <UpdateButton className="the-newbtn" />
              )} */}
        </div>
        <Box
          flex={1}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <List className="the-menu">
            {routers.map((router) => {
              return (
                <LayoutItem key={router.label} to={router.link}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems="center"
                  >
                    {router.icon}

                    <Typography marginLeft={"20px"}>
                      {t(router.label)}
                    </Typography>
                  </Box>
                  {/*  {t(router.label)} */}
                </LayoutItem>
              );
            })}
          </List>
          <a
            style={{
              textDecoration: "none",
            }}
            target="_blank"
            href="mailto:admin@1clickpass.com"
          >
            <Box
              color={"#fff"}
              // onClick={() => openWebUrl("http://vpn.1clickpass.com/")}
              style={{ cursor: "pointer" }}
              display={"flex"}
              justifyContent={"center"}
              alignItems="center"
            >
              <MarkunreadIcon />
              <Box marginLeft={"20px"} fontWeight={"600"}>
                联系我们
              </Box>
            </Box>
          </a>
        </Box>

        <div className="the-traffic" data-windrag>
          {/* <LayoutTraffic /> */}
        </div>
      </div>

      <div className="layout__right" data-windrag>
        {OS === "windows" && (
          <div className="the-bar">
            <LayoutControl />
          </div>
        )}

        <div className="the-content">
          <Routes>
            {routers.map(({ label, link, ele: Ele }) => (
              <Route
                key={label}
                path={link}
                element={
                  <BaseErrorBoundary key={label}>
                    <Ele />
                  </BaseErrorBoundary>
                }
              >
                {/* {children &&
                  children.map((i) => {
                    const ChildEle = i.element;
                    return (
                      <Route
                        key={i.label}
                        path={i.link}
                        element={
                          <BaseErrorBoundary key={i.label}>
                            <ChildEle />
                          </BaseErrorBoundary>
                        }
                      />
                    );
                  })} */}
              </Route>
            ))}
            <Route
              key="order-item"
              path="/order/:id"
              element={
                <BaseErrorBoundary key="order-item">
                  <OrderItem />
                </BaseErrorBoundary>
              }
            />
            <Route
              key="combo-item"
              path="/combo/:id"
              element={
                <BaseErrorBoundary key="combo-item">
                  <ComboItem />
                </BaseErrorBoundary>
              }
            />
            <Route
              key="ticket-item"
              path="/ticket/:id"
              element={
                <BaseErrorBoundary key="ticket-item">
                  <TicketItem />
                </BaseErrorBoundary>
              }
            />
          </Routes>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={spin}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default Layout;
