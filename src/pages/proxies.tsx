import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorageState, useLockFn } from "ahooks";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Switch,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import {
  closeAllConnections,
  getClashConfig,
  updateConfigs,
} from "@/services/api";
import { openWebUrl } from "@/services/cmds";
import { useVerge } from "@/hooks/use-verge";
import { BasePage, Notice } from "@/components/base";
import { ProxyGroups } from "@/components/proxy/proxy-groups";
import { useRenderList } from "@/components/proxy/use-render-list";
import ProxyDialog from "@/components/proxy/proxy-dialog";
import { useRecoilValue } from "recoil";
import { currentUserInfo, atomLoadingCache } from "@/services/states";
import useFetch from "use-http";
import { useProfiles } from "@/hooks/use-profiles";

import {
  getProfiles,
  patchClashConfig,
  importProfile,
  enhanceProfiles,
  getRuntimeLogs,
  deleteProfile,
  updateProfile,
} from "@/services/cmds";
import dayjs from "dayjs";
import bgSvg from "@/assets/image/1024.png";
import { hot } from "./data";
import LayoutTraffic from "@/components/layout/layout-traffic";
import { useNavigate } from "react-router-dom";

import UsIcon from "@/assets/image/Flag_of_the_United_States.svg";
import HkIcon from "@/assets/image/Flag_of_Hong_Kong.svg";
import Australia from "@/assets/image/australia.svg";
import AutoIcon from "@/assets/image/backup.svg";
import { toast } from "react-toastify";
import { SettingItem } from "@/components/setting/mods/setting-comp";
import { GuardState } from "@/components/setting/mods/guard-state";
import HelpIcon from "@mui/icons-material/Help";
import Brazil from "@/assets/image/brazil.svg";
import Enlgend from "@/assets/image/Englend.svg";
import Turkey from "@/assets/image/Turkey.svg";
import jp from "@/assets/image/jp.svg";
import Germany from "@/assets/image/Germany.svg";
import ruidian from "@/assets/image/ruidian.svg";
import yindu from "@/assets/image/yindu.svg";
import agenting from "@/assets/image/agenting.svg";
import xinjiapo from "@/assets/image/xinjiapo.svg";
import hanguo from "@/assets/image/hanguo.png";
import bolan from "@/assets/image/bolan.svg";
import malai from "@/assets/image/malai.svg";
import taiguo from "@/assets/image/taiguo.svg";
import yuenan from "@/assets/image/yuenan.svg";
import xibanya from "@/assets/image/xibanya.svg";
import yidali from "@/assets/image/yidali.svg";
import wukelan from "@/assets/image/wukelan.svg";
import jianada from "@/assets/image/jianada.svg";
import eluosi from "@/assets/image/eluosi.svg";
import faguo from "@/assets/image/faguo.svg";
import zhongguo from "@/assets/image/china.png";
import helan from "@/assets/image/helan.svg";
import jieke from "@/assets/image/jieke.svg";
import yinni from "@/assets/image/yinni.svg";
// faguo
// yuenan

export const getIcon = (name: string) => {
  if (name?.includes("美国")) {
    return UsIcon;
  } else if (name?.includes("香港")) {
    return HkIcon;
  } else if (name?.includes("澳大利亚")) {
    return Australia;
  } else if (name?.includes("巴西")) {
    return Brazil;
  } else if (name?.includes("英国")) {
    return Enlgend;
  } else if (name?.includes("土耳其")) {
    return Turkey;
  } else if (name?.includes("日本")) {
    return jp;
  } else if (name?.includes("德国")) {
    return Germany;
  } else if (name?.includes("瑞典")) {
    return ruidian;
  } else if (name?.includes("印度")) {
    return yindu;
  } else if (name?.includes("阿根廷")) {
    return agenting;
  } else if (name?.includes("新加坡")) {
    return xinjiapo;
  } else if (name?.includes("韩国")) {
    return hanguo;
  } else if (name?.includes("波兰")) {
    return bolan;
    // malai
  } else if (name?.includes("马来")) {
    return malai;
  } else if (name?.includes("泰国")) {
    return taiguo;
  } else if (name?.includes("越南")) {
    return yuenan;
  } else if (name?.includes("西班牙")) {
    return xibanya;
  } else if (name?.includes("意大利")) {
    return yidali;
  } else if (name?.includes("乌克兰")) {
    return wukelan;
  } else if (name?.includes("加拿大")) {
    return jianada;
  } else if (name?.includes("俄罗斯")) {
    return eluosi;
  } else if (name?.includes("法国")) {
    return faguo;
  } else if (name?.includes("中国")) {
    return zhongguo;
  } else if (name?.includes("荷兰")) {
    return helan;
  } else if (name?.includes("捷克")) {
    return jieke;
  } else if (name?.includes("印尼")) {
    return yinni;
  } else {
    return AutoIcon;
  }
  // zhongguo
  // xibanya
  // switch (name) {
  //   case name?.includes('美国'): {
  //     return UsIcon
  //   }

  //   case '香港': {
  //     return HkIcon
  //   }

  //   default: {
  //     return AutoIcon
  //   }
  // }
  // return currentProxies?.group.now?.includes("美国")
  //   ? UsIcon
  //   : currentProxies?.group.now?.includes("香港")
  //     ? HkIcon
  //     : AutoIcon
};

const APP_YAML_FILE_NAME = "yijianlian";
const ProxyPage = () => {
  const navigate = useNavigate();

  const [dialogState, setDialog] = useState(false);
  const { t } = useTranslation();

  const [token, setToken] = useLocalStorageState<string | undefined>(
    "Authorization"
  );
  const { data, loading, response } = useFetch(
    "/api/v1/user/getSubscribe",
    {},
    []
  );

  // const [info, setInfo] = useRecoilValue(currentUserInfo);
  // console.log(info, setInfo, "info, setInfo");
  const { data: clashConfig, mutate: mutateClash } = useSWR(
    "getClashConfig",
    getClashConfig
  );
  const { verge, mutateVerge, patchVerge } = useVerge();
  const [dialogOpen, setDialogOpen] = useState(false);

  const modeList = useMemo(() => {
    if (verge?.clash_core === "clash-meta") {
      return ["rule", "global", "direct"];
    }
    return ["rule", "global"];
  }, [verge?.clash_core]);

  const curMode = clashConfig?.mode.toLowerCase();

  const onChangeMode = useLockFn(async (mode: string) => {
    // 断开连接
    if (mode !== curMode && verge?.auto_close_connection) {
      closeAllConnections();
    }
    // console.log(mode,'modemode')
    await updateConfigs({ mode });
    await patchClashConfig({ mode });
    mutateClash();
  });

  useEffect(() => {
    if (curMode !== "global") {
      onChangeMode("rule");
    }
    // console.log(curMode,'curModecurMode')
    // rule

    // mode
    // if (!['rule', 'global'].includes(curMode as string)) {
    //   onChangeMode("rule");
    // }
  }, [curMode]);

  // useEffect(() => {
  //   if (curMode && !modeList.includes(curMode)) {
  //     onChangeMode("rule");
  //   }
  // }, [curMode]);

  useEffect(() => {
    // console.log(data, "data");
    if (data && data.expired_at) {
      const expiredDay = dayjs(dayjs()).diff(
        dayjs(data.expired_at * 1000),
        "day"
      );
      // console.log(expiredDay, "expiredDay");
      if (expiredDay > -3) {
        setDialog(true);
      }
    }
  }, [data]);
  // console.log(userInfo, "curMode");

  const {
    profiles = {},
    activateSelected,
    patchProfiles,
    mutateProfiles,
  } = useProfiles();

  const onChangeData = (patch: Partial<IVergeConfig>) => {
    mutateVerge({ ...verge, ...patch }, false);
  };

  const { enable_system_proxy, enable_auto_launch } = verge;
  // const { mode } = props;
  // enable_system_proxy

  const { renderList, onProxies, onHeadState } = useRenderList(curMode!);

  const currentProxies =
    curMode === "rule"
      ? renderList?.find((i) => i.key === APP_YAML_FILE_NAME)
      : renderList?.find((i) => i.key === "head-GLOBAL");

  const handleLogout = () => {
    setToken("");
    handleToggleProxy(false);
    window.location.reload();
  };

  // console.log(currentProxies?.group?.all, "currentProxies");

  const handleConnect = () => {
    if (!enable_system_proxy && !currentProxies?.group?.all.length) {
      return toast.error("没有节点可供连接，请检查订阅套餐！", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    handleToggleProxy(!enable_system_proxy);
  };
  const handleToggleProxy = (status: boolean) => {
    onChangeData({ enable_system_proxy: status });
    patchVerge({ enable_system_proxy: status });
  };
  const onSwitchFormat = (_e: any, value: boolean) => value;
  const onError = (err: any) => {
    Notice.error(err?.message || err.toString());
  };

  return (
    <BasePage
      contentStyle={{ height: "100%" }}
      title={t("Proxy Groups")}
      header={
        <ButtonGroup size="small">
          {modeList.map((mode) => (
            <Button
              key={mode}
              variant={mode === curMode ? "contained" : "outlined"}
              onClick={() => onChangeMode(mode)}
              sx={{ textTransform: "capitalize" }}
            >
              {t(mode)}
            </Button>
          ))}
        </ButtonGroup>
      }
    >
      <Paper
        sx={{
          backgroundColor: "rgba(0,0,0,0)",
          borderRadius: 1,
          // ,
          height: "100%",
          boxSizing: "border-box",
          // border:'1px solid rgba(113 119 144 / 25%)',
          py: 1,
        }}
      >
        <div className="connect-inner">
          <div className="left-1">
            <div className="loading-icon">
              <div
                style={{
                  visibility: !enable_system_proxy ? "visible" : "hidden",
                }}
                className="icon"
              />
              <Box
                color={enable_system_proxy ? "#f50" : "white"}
                onClick={handleConnect}
                className="circle-warp"
              >
                {enable_system_proxy ? "已连接" : "请连接"}
              </Box>
            </div>
            <div className="connect-detail">
              <div
                onClick={() => {
                  handleToggleProxy(false);
                }}
                style={{
                  visibility: enable_system_proxy ? "visible" : "hidden",
                }}
                className="danger-btn-my"
              >
                断开连接
              </div>

              <div
                onClick={setDialogOpen.bind(null, true)}
                className="detail-warp-byconnect"
              >
                <div className="act-connect">
                  <span className="connect-name">
                    {currentProxies?.group?.all?.length ? (
                      <>
                        <span>
                          <Avatar
                            variant="square"
                            sx={{ width: 32, height: 20 }}
                            src={getIcon(currentProxies?.group.now as string)}
                          />
                        </span>
                        <span className="name-text">
                          <Box>{currentProxies?.group.now}</Box>
                        </span>
                      </>
                    ) : (
                      <Box textAlign="center">没有可选择节点</Box>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <WarpBox>
            <div className="user-info">
              {loading ? (
                <>loading...</>
              ) : (
                <>
                  <Box
                    style={{
                      width: "100%",
                    }}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <Box className="current-plan">{data?.plan?.name}</Box>

                    <Box fontWeight={"bold"}>
                      <SettingItem label={t("Auto Launch")}>
                        <Tooltip title="建议启用开机自启，否则程序异常退出会导致浏览器无法访问网络！">
                          <HelpIcon />
                        </Tooltip>
                        <GuardState
                          value={enable_auto_launch ?? false}
                          valueProps="checked"
                          onCatch={onError}
                          onFormat={onSwitchFormat}
                          onChange={
                            (e) => {
                              onChangeData({ enable_auto_launch: e });
                            }
                            //
                          }
                          onGuard={(e) => patchVerge({ enable_auto_launch: e })}
                        >
                          <Switch color="warning" edge="end" />
                        </GuardState>
                      </SettingItem>
                    </Box>
                  </Box>

                  <div className="user-profile">{/* 账户余额：100¥ */}</div>
                  <div className="profile-detail">
                    <div>
                      {data?.email
                        ?.replace("@phone.com", "")
                        .replace("@phoneSms.com", "")}
                    </div>
                    {dayjs().isAfter(dayjs(data?.expired_at * 1000)) ? (
                      <Box color={"red"}>套餐已过期</Box>
                    ) : (
                      <div>
                        有效期至：
                        {dayjs(data?.expired_at * 1000).format(
                          "YYYY年MM月DD日 HH:mm:ss"
                        )}
                      </div>
                    )}

                    {/* {mm < 1 ? <div className='bad'>已过期</div> : <div className='day'>
                                            有效期至：  {dayjs(props.subInfo.expired_at * 1000).format('YYYY年MM月DD日 HH:mm:ss')} */}

                    {/* </div>} */}
                    <div className="user-btn-warp">
                      <div
                        onClick={() => {
                          navigate("/combo");
                        }}
                        className="btn"
                      >
                        购买套餐
                      </div>
                      <div onClick={handleLogout} className="danger-btn-my">
                        退出登录
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div style={{ marginTop: 10 }} className="app-list">
              <div className="speed-title">热门推荐应用</div>
              <div className="speed-bottom">
                {hot?.map((item) => {
                  return (
                    <div className="app-detail-item" key={item.name}>
                      <div
                        style={{
                          backgroundImage: `url(${item.img})`,
                          backgroundColor: item.bgColor,
                          backgroundSize: item.bgSize || "80% 80%",
                          width: 40,
                          height: 40,
                          backgroundRepeat: "no-repeat",
                          borderRadius: 10,
                          backgroundPosition: "center",
                        }}
                        onClick={() => {
                          openWebUrl(item.url);
                        }}
                        className="app-item"
                        key={item.name}
                      ></div>

                      <Box fontSize={12}>{item.name}</Box>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              style={{ marginTop: 10, height: "calc(100vh - 593px)" }}
              className="app-list app-status-warp"
            >
              <div className="speed-title">实时流量速率</div>
              <div className="speed-bottom">
                <LayoutTraffic useAge={data} />
              </div>
            </div>
          </WarpBox>
        </div>
        {/* <ProxyGroups  mode={'rule'}/> */}
        <ProxyDialog
          mode={curMode!}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
        {/* dialogState, setDialog */}
        <Dialog
          open={dialogState}
          // onClose={() => setDialog(false)}
        >
          <DialogTitle id="customized-dialog-title">提示</DialogTitle>
          <DialogContent dividers>
            <Alert severity="warning">
              <AlertTitle>
                尊敬的用户
                {data?.email
                  ?.replace("@phone.com", "")
                  .replace("@phoneSms.com", "")}
                您好：{" "}
              </AlertTitle>
              您的套餐时长不足，为不影响你使用产品，请尽快续订套餐！
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={setDialog.bind(null, false)}
              variant="contained"
              color="info"
            >
              再想想
            </Button>
            <Button
              onClick={() => {
                navigate("/combo");
              }}
              variant={"contained"}
              color="warning"
            >
              {/* onClick={handleClose} */}
              立即选购
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </BasePage>
  );
};

export default ProxyPage;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  width: "35%",
  marginRight: "10px",
  // display: "flex",
  // flexDirection: "column",
  "& .user-info": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "end",
    height: "223px",
  },
  "& .app-list": {
    fontWeight: 500,
    flex: 1,
    "& .speed-bottom": {
      display: "flex",
      height: "80px",
      justifyContent: "space-around",
      alignItems: "center",
      textAlign: "center",
    },
    "& .app-detail-item": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      /* align-content: center; */
      alignItems: "center",
      // textAlign: "center",
    },
  },
  "& .current-plan": {
    borderRadius: "10px",
    border: " 1px solid #C75DEB",
    backgroundColor: "#3a3375",
    padding: "4px 0px",
    width: "80px",
    textAlign: "center",
  },
  "& .user-profile": {
    width: "60px",
    height: "60px",
    backgroundImage: `url(${bgSvg})`,
    backgroundSize: "100%",
    borderRadius: "10px",
    margin: "10px auto 10px auto",
  },
  "& .profile-detail": {
    fontWeight: 500,
    textAlign: "center",
    width: "100%",
    "&>div": {
      marginBottom: "10px",
    },
  },
  "& .user-btn-warp": {
    "& div": {
      transition: " all 0.2s ease-in-out",

      display: "inline-block",
      borderRadius: "100px",
      padding: " 6px 20px",
      /* font-weight: 700; */
      background: "#ff4d4f",
      appearance: "none",
      fontSize: "14px",
      cursor: "pointer",
      color: " var(--theme-color)",
    },
    "& .btn": {
      marginRight: "10px",
      background: "#06e5b4",
    },
  },
  // bgSvg
  // background: "rgba(16 18 27 / 40%)",
  // // padding: "10px",
  // border: "1px solid var(--theme-bg-color)",
  // margin: "10px",
  // borderRadius: "14px",
  // overflow: "hidden",
}));
