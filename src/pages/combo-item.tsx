import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
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
} from "@mui/icons-material";
import { atomEnableLog, atomLogData } from "@/services/states";
import { BaseEmpty, BasePage } from "@/components/base";
import LogItem from "@/components/log/log-item";
import useFetch from "use-http";
import OrderList from "@/components/order/order-list";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import { LoadingButton } from "@mui/lab";
import { enumPrice, getPriceType } from "@/components/combo/basic-card";
import { get } from "lodash-es";
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

const ComboItem = () => {
  const { t } = useTranslation();
  let { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, response } = useFetch(
    `api/v1/user/plan/fetch?id=${id}`,
    {},
    []
  ); // onMount

  const { post, loading: saveLoading } = useFetch("/api/v1/user/order/save");

  const currentPriceType = getPriceType(data || {});
  //   const { data: payData, loading: payLoading } = useFetch(
  //     `api/v1/user/order/data?trade_no=${id}`,
  //     {},
  //     []
  //   ); // onMount

  const handleSave = async () => {
    post({
      period: currentPriceType,
      // data?.month_price ? "month_price" : "year_price",
      plan_id: id,
    }).then((res) => {
      if (res) {
        navigate(`/order/${res}`);
      }
    });
  };

  console.log(currentPriceType, "a");
  return (
    <BasePage title={t("Logs")} contentStyle={{ height: "calc(100% - 20px)" }}>
      <WarpBox>
        {loading ? (
          Array.from({ length: 20 }).map((it, idx) => {
            return <Skeleton height={60} key={idx} animation="wave" />;
          })
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <CardWarp>
                  <div className="card-title">{data.name}</div>

                  <div
                    className="card-inner"
                    dangerouslySetInnerHTML={{ __html: data.content || "NULL" }}
                  ></div>
                </CardWarp>
                <CardWarp mt="10px">
                  <div className="card-title">付款周期</div>

                  <Box
                    borderRadius={"5px"}
                    border="2px solid rgb(27, 94, 169)"
                    justifyContent="space-between"
                    padding="20px 10px"
                    color="rgb(181, 174, 162)"
                    display="flex"
                    className="card-inner"
                  >
                    <span> {get(enumPrice, currentPriceType)}</span>
                    <span>¥{(data?.[currentPriceType] / 100).toFixed(2)}</span>
                  </Box>
                </CardWarp>
              </Grid>
              <Grid item xs={4}>
                <CardPayWarp lineHeight={"28px"}>
                  <Box fontWeight={"500"} color="rgb(225, 221, 212)">
                    订单总额
                  </Box>
                  <Box justifyContent={"space-between"} display={"flex"}>
                    <Box>
                      {data.name} x {get(enumPrice, currentPriceType)}
                    </Box>
                    <Box>¥{(data?.[currentPriceType] / 100).toFixed(2)}</Box>
                  </Box>
                  <Box margin="10px 0">
                    <Divider />
                  </Box>
                  <Box>总计</Box>
                  <Box lineHeight={"40px"} fontSize="26px" fontWeight="bold">
                    ¥{(data?.[currentPriceType] / 100).toFixed(2)}
                  </Box>
                  <Box margin="10px 0">
                    <LoadingButton
                      loading={saveLoading}
                      color="warning"
                      variant="contained"
                      fullWidth
                      onClick={handleSave}
                    >
                      下单
                    </LoadingButton>
                  </Box>
                </CardPayWarp>
              </Grid>
            </Grid>
          </>
        )}

        {/* <OrderList dataList={data} /> */}
      </WarpBox>
    </BasePage>
  );
};

export default ComboItem;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgba(16 18 27 / 40%)",
  border: "1px solid var(--theme-bg-color)",
  margin: "10px",
  borderRadius: "14px",
  height: "100%",
  overflow: "hidden",
  boxSizing: "border-box",
  padding: "10px",
  paddingTop: "10px",
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
    backgroundColor: "rgb(36, 37, 37)",
    boxShadow:
      "rgba(50, 52, 52, 0.5) 0px 1px 3px, rgba(50, 52, 52, 0.5) 0px 1px 2px",
  },
  "& .title": {
    backgroundColor: "rgb(39, 40, 39)",
    padding: "20px",
    color: "rgba(229, 224, 216, 0.85)",
  },
  "& .data": {
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

const CardWarp = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "#242525",
  paddingBottom: "20px",
  borderRadius: "5px",
  //   padding: "10px",
  "& .card-title": {
    color: "rgba(229, 224, 216, 0.85)",
    lineHeight: "35px",
    padding: "10px",
  },
  ul: {
    margin: "0",
    listStyle: "inside",
    padding: "10px",
    paddingTop: "0",
    lineHeight: "24px",

    color: "rgb(155, 145, 131)",
    "& font[color='black']": {
      color: "#e5e0d8",
    },
    "& font[color='blue']": {
      color: "#457fe5",
    },
  },
}));

const CardPayWarp = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgb(53, 56, 61)",
  paddingBottom: "20px",
  borderRadius: "5px",
  padding: "20px",
}));
