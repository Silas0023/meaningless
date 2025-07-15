import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  styled,
  TextField,
} from "@mui/material";
import { Virtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import {
  PlayCircleOutlineRounded,
  PauseCircleOutlineRounded,
  Close,
} from "@mui/icons-material";
import { atomEnableLog, atomLogData } from "@/services/states";
import { BaseEmpty, BasePage, Notice } from "@/components/base";
import LogItem from "@/components/log/log-item";
import useFetch, { CachePolicies } from "use-http";
import OrderList from "@/components/order/order-list";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import { LoadingButton } from "@mui/lab";
import { openWebUrl } from "@/services/cmds";
import OrderDialog from "@/components/order/order-dialog";
import { toast } from "react-toastify";
import { useMount, useScroll } from "ahooks";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import SendIcon from "@mui/icons-material/Send";
// function isValidURL(url: string): boolean {
//   const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
//   return urlPattern.test(url);
// }
// // import styled from "@emotion/styled";
// const statusMap: any = {
//   0: "等待付款",
//   1: "开通中",
//   2: "已取消",
//   3: "已完成",
//   4: "已折抵",
// };

// const statusIcon: any = {
//   0: MonetizationOnRoundedIcon,
//   1: TimerRoundedIcon,
//   2: CancelRoundedIcon,
//   3: VerifiedRoundedIcon,
//   4: VerifiedRoundedIcon,
// };

const TicketItem = (props: any) => {
  const { t } = useTranslation();
  let { id } = useParams();

  const ref = useRef<any>(null);
  const [messageLength, setMessageLength] = useState(0);

  const [inputValue, setInputValue] = useState<string>("");
  const [currentTimer, setTimer] = useState(0);

  const location = useNavigate();
  // /api/v1/user/ticket/fetch?id=18
  const { data } = useFetch(
    `/api/v1/user/ticket/fetch?id=${id}`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
      onNewData: (cData, newData) => {
        setMessageLength(newData?.data?.message?.length);
        return newData;
      },
    },
    [currentTimer]
  ); // onMount

  useEffect(() => {
    if (ref?.current instanceof Element) {
      ref?.current?.scrollTo({
        behavior: "smooth",
        top: ref?.current?.scrollHeight,
      });
    }
  }, [messageLength]);

  const { post } = useFetch("/api/v1/user/ticket/reply", {
    cachePolicy: CachePolicies.NO_CACHE,
  });
  useEffect(() => {
    let timer = setInterval(() => {
      setTimer(Date.now());
    }, 6000);
    return () => clearInterval(timer);
  });

  const handleSend = () => {
    if (!inputValue.trim()) {
      return false;
    }
    post({
      id,
      message: inputValue,
    }).then((res) => {
      if (!!res) {
        setInputValue("");
        setTimer(Date.now());
      }
    });
  };

  const handleInputChange = (e: any) => {
    setInputValue(e?.target?.value);
  };

  const handelBack = () => {
    location("/ticket");
  };

  return (
    <BasePage title={t("Logs")} contentStyle={{ height: "calc(100% - 20px)" }}>
      <WarpBox>
        <CssBaseline />
        <HideOnScroll>
          <AppBar position="absolute" component="nav">
            <Toolbar>
              <Typography flexGrow="1" variant="h6" component="div">
                {data?.subject}
              </Typography>
              <Button
                onClick={handelBack}
                size="small"
                color="info"
                variant="contained"
              >
                返回
              </Button>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
        {/* 56px */}
        <Box
          ref={ref}
          height={"calc(100% - 99px)"}
          padding={"20px"}
          style={{ overflow: "auto" }}
        >
          {data?.message?.map?.((it: any) => {
            return (
              <Box
                key={it.id}
                display={"flex"}
                flexDirection={"column"}
                alignItems={it.is_me ? "flex-end" : "flex-start"}
              >
                <Typography
                  color={"rgb(99, 115, 129)"}
                  fontWeight="400"
                  fontSize="12px"
                  margin={"10px 0px"}
                >
                  {dayjs(it.created_at * 1000).format("YYYY/MM/DD HH:mm")}
                </Typography>
                <Box
                  bgcolor={
                    it.is_me
                      ? "rgba(145, 158, 171, 0.12)"
                      : "rgb(200, 250, 214)"
                  }
                  padding={"12px"}
                  borderRadius={"8px"}
                >
                  <Typography
                    fontSize={"14px"}
                    fontWeight={"400"}
                    color={it.is_me ? "#fff" : "rgb(33, 43, 54)"}
                  >
                    {it.message}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
        <InputBox>
          <InputBase
            onKeyDown={(e) => {
              // /handleSend
              if (e.keyCode === 13) {
                handleSend();
              }
            }}
            value={inputValue}
            onChange={handleInputChange}
            fullWidth
            placeholder="请输入问题..."
          />
          <IconButton onClick={handleSend} color="inherit">
            <SendIcon fontSize="inherit" />
          </IconButton>
        </InputBox>

        {/* <WarpBox>ticket item</WarpBox> */}
        {/* , */}
        {/* <OrderDialog
        status={orderStatus.data}
        loading={cancelLoading}
        open={dialogVis}
        onClose={handleCancel}
      /> */}
      </WarpBox>
    </BasePage>
  );
};

export default TicketItem;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgb(33, 43, 54)",
  // padding: "10px",
  border: "1px solid var(--theme-bg-color)",
  margin: "10px",
  borderRadius: "14px",
  overflow: "hidden",
  height: "100%",
  padding: "20px 0px",
  position: "relative",
  paddingTop: "0px",
  "& .MuiAppBar-root": {
    borderRadius: "14px 14px 0 0",
  },
  "& .top-status": {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "500",
    lineHeight: "35px",
    "& .status-name": {
      fontSize: "24px",
      color: "rgba(229, 224, 216, 0.85)",
    },
  },
  "& .icon-status": {
    fontSize: "60px",
  },
  "& .block": {
    marginTop: "20px",
    borderRadius: "5px",
    backgroundColor: "rgb(36, 37, 37)",
    boxShadow:
      "rgba(50, 52, 52, 0.5) 0px 1px 3px, rgba(50, 52, 52, 0.5) 0px 1px 2px",
  },
  "& .title": {
    backgroundColor: "rgb(39, 40, 39)",
    padding: "20px",
    color: "rgba(229, 224, 216, 0.85)",
  },
  "& .detail": {
    lineHeight: "35px",
    paddingBottom: "20px",
    paddingRight: "20px",
    paddingLeft: "20px",
    fontWeight: "500",
    li: {
      display: "flex",
      "& span": {
        width: "30%",
      },
      //   justifyContent: "space-",
    },
  },
}));

const CardPayWarp = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgb(53, 56, 61)",
  paddingBottom: "20px",
  borderRadius: "5px",
  padding: "20px",
}));

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const InputBox = styled(Box)(({ theme: { palette, typography } }) => ({
  fontWeight: "400",
  color: "rgb(255, 255, 255)",
  boxSizing: "border-box",
  position: "relative",
  cursor: "text",
  paddingLeft: "28px",
  paddingRight: "8px",
  height: "56px",
  flexShrink: 0,
  borderTop: "1px solid rgba(145, 158, 171, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
