// import useSWR from "swr";
// import snarkdown from "snarkdown";
// import { useMemo } from "react";
// import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  Stack,
  alpha,
  styled,
} from "@mui/material";
// import { relaunch } from "@tauri-apps/api/process";
// import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
// import { atomUpdateState } from "@/services/states";
// import { Notice } from "@/components/base";
// import { r } from "@tauri-apps/api/event-30ea0228";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import IconSvg from "@/assets/image/VIP.svg";
import { useRenderList } from "./use-render-list";
import { useLockFn } from "ahooks";
import {
  deleteConnection,
  getConnections,
  getProxyDelay,
  providerHealthCheck,
  updateProxy,
} from "@/services/api";
import { useVerge } from "@/hooks/use-verge";
import { useProfiles } from "@/hooks/use-profiles";
import UsIcon from "@/assets/image/Flag_of_the_United_States.svg";
import HkIcon from "@/assets/image/Flag_of_Hong_Kong.svg";
import AutoIcon from "@/assets/image/backup.svg";
import delayManager from "@/services/delay";
import { ProxyHead } from "./proxy-head";
import { NetworkCheckRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { getIcon } from "@/pages/proxies";
const APP_YAML_FILE_NAME = "yijianlian";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: string;
}

const TypeDialog = styled(Dialog)(({ theme }) => {
  return {
    "& .MuiPaper-root": {
      backgroundColor: "#171925",
      color: theme.palette.common.white,
    },
    "& .MuiDialogTitle-root": {
      borderBottom: "1px solid #2d3140",
    },
    // #2d3140
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  };
});

const TypeList = styled(List)(({ theme }) => ({
  "& .MuiListItem-root": {
    borderBottom: "1px solid #2d3140",
  },
}));

const ProxyDialog = (props: Props) => {
  const { open, onClose, mode } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState([1]);
  const { verge } = useVerge();
  const { current, patchCurrent } = useProfiles();

  const [statusMap, setStatusMap] = useState<any>({});

  const [checkLoading, setCheckLoading] = useState(false);
  const { renderList, onProxies, onHeadState } = useRenderList(mode!);

  const currentProxies =
    mode === "rule"
      ? renderList?.find((i) => i.key === APP_YAML_FILE_NAME)
      : renderList?.find((i) => i.key === "head-GLOBAL");

  const handleChangeProxy = useLockFn(
    async (group: IProxyGroupItem, proxy: IProxyItem) => {
      if (group.type !== "Selector" && group.type !== "Fallback") return;

      const { name, now } = group;
      await updateProxy(name, proxy.name);
      onProxies();

      // 断开连接
      if (verge?.auto_close_connection) {
        getConnections().then(({ connections }) => {
          connections.forEach((conn) => {
            if (conn.chains.includes(now!)) {
              deleteConnection(conn.id);
            }
          });
        });
      }

      // 保存到selected中
      if (!current) return;
      if (!current.selected) current.selected = [];

      const index = current.selected.findIndex(
        (item) => item.name === group.name
      );

      if (index < 0) {
        current.selected.push({ name, now: proxy.name });
      } else {
        current.selected[index] = { name, now: proxy.name };
      }
      await patchCurrent({ selected: current.selected });
    }
  );

  //
  // 测全部延迟
  const handleCheckAll = useLockFn(async () => {
    if (!currentProxies?.group?.all?.length) {
      return;
    }
    setCheckLoading(true);
    const res: any = currentProxies?.group?.all.map(async (item) => {
      const status = await getProxyDelay(item.name).catch((err) => {
        // console.log(err, "eerr");
        return {
          name: item.name,
          delay: 5000,
        };
      });

      return {
        name: item.name,
        ...status,
      };
    });

    const pr = await Promise.allSettled(res);

    const result = Object.fromEntries(
      pr?.map((item: any) => {
        return [item.value.name, Math.round(item.value.delay / 4)];
      })
    );
    setStatusMap(result);
    setCheckLoading(false);
  });

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <TypeDialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent={"flex-start"}>
          <Box marginRight={"20px"}> 选择节点</Box>
          <LoadingButton
            loading={checkLoading}
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleCheckAll()}
          >
            <NetworkCheckRounded />
            测试连通性
          </LoadingButton>
        </Box>
        {/* <ProxyHead
          // sx={{ pl: indent ? 4.5 : 2.5, pr: 3, mt: indent ? 1 : 0.5, mb: 1 }}
          groupName={APP_YAML_FILE_NAME}
          headState={{
            filterText: "",
            open: true,
            showType: false,
            sortType: 0,
            testUrl: "",
            textState: null,
          }}
          onLocation={() => {}}
          onCheckDelay={() => handleCheckAll(APP_YAML_FILE_NAME)}
          onHeadState={(p) => {}}
        /> */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TypeList
          dense
          //   sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {currentProxies?.group?.all?.map((value) => {
            return (
              <ListItem
                onClick={() => handleChangeProxy(currentProxies?.group, value!)}
                key={value.name}
                secondaryAction={
                  <Radio
                    checked={value.name === currentProxies?.group.now}
                    edge="start"
                  ></Radio>
                }
                // disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      sx={{ width: 32, height: 20 }}
                      src={getIcon(value?.name as string)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2}>
                        <Box width={"200px"}> {value.name}</Box>
                        {statusMap?.[value.name] && (
                          <TypeBox
                            color={
                              statusMap?.[value.name] > 500
                                ? "error.main"
                                : statusMap?.[value.name] < 100
                                ? "success.main"
                                : "text.secondary"
                            }
                            bgcolor={
                              statusMap?.[value.name] > 3000
                                ? "#d32f2f"
                                : "#2db7f5"
                            }
                          >
                            {statusMap?.[value.name] > 1e5
                              ? "Error"
                              : statusMap?.[value.name] > 3000
                              ? "连接超时"
                              : `${statusMap?.[value.name]}ms`}
                          </TypeBox>
                        )}
                        {/*   {value.udp && (
                          <TypeBox bgcolor={"#87d068"} component="span">
                            UDP
                          </TypeBox>
                        )} */}
                      </Stack>
                    }
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </TypeList>
      </DialogContent>
    </TypeDialog>
  );
};

export default ProxyDialog;

const TypeBox = styled(Box)(({ theme: { palette, typography } }) => ({
  // border: "1px solid #ccc",
  // borderColor: alpha(palette.text.secondary, 0.36),
  color: alpha(palette.text.secondary, 1),
  borderRadius: 4,
  fontSize: 10,
  fontFamily: typography.fontFamily,
  marginRight: "4px",
  padding: "0 4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // lineHeight: 1.25,
}));
