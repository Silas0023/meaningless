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
import { enumPrice, getPriceType } from "@/components/combo/basic-card";
import { get } from "lodash-es";

function isValidURL(url: string): boolean {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return urlPattern.test(url);
}
// import styled from "@emotion/styled";
const statusMap: any = {
  0: "等待付款",
  1: "开通中",
  2: "已取消",
  3: "已完成",
  4: "已折抵",
};

const statusIcon: any = {
  0: MonetizationOnRoundedIcon,
  1: TimerRoundedIcon,
  2: CancelRoundedIcon,
  3: VerifiedRoundedIcon,
  4: VerifiedRoundedIcon,
};

const OrderItem = () => {
  const { t } = useTranslation();
  let { id } = useParams();

  const [dialogVis, setDialogVis] = useState(false);

  const [payId, setPayId] = useState(-1);

  const location = useNavigate();
  const { data, loading, response } = useFetch(
    `api/v1/user/order/detail?trade_no=${id}`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    },
    []
  ); // onMount

  const { data: payMethods } = useFetch(
    "api/v1/user/order/getPaymentMethod",
    {
      onNewData(currData, newData) {
        setPayId(newData?.data?.[0]?.id);
        return newData;
      },
    },
    []
  );

  const { post, loading: cancelLoading } = useFetch("api/v1/user/order/cancel");

  const { get: getOrderStatus, response: orderStatus } = useFetch(
    `api/v1/user/order/check?trade_no=${id}`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const handleCancel = async () => {
    await post({
      trade_no: id,
    });
    location("/order");
  };

  const {
    post: payOrder,
    loading: payLoading,
    response: payRes,
  } = useFetch("/api/v1/user/order/checkout", {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  useEffect(() => {
    let timer: any;
    if (data && data.status === 0) {
      timer = setInterval(() => {
        getOrderStatus().then((res) => {
          if (res === 3) {
            toast.success("支付成功!", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            window.location.reload();
          }
        });
      }, 3000);
    }
    return () => {
      clearInterval(timer); // 清除定时器以防止内存泄漏
    };
  }, [data]);

  // useEffect(() => {
  //   console.log(orderStatus, "orderStatus");
  // }, [orderStatus]);

  const handlePay = async () => {
    await payOrder({
      trade_no: id,
      method: payId,
    });

    if (isValidURL(payRes.data)) {
      await openWebUrl(payRes.data);
      setDialogVis(true);
    } else if (payRes.data === true) {
      Notice.success("套餐购买完成");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
    }
  };
  const CurrentIcon = statusIcon?.[data?.status] || MonetizationOnRoundedIcon;
  return (
    <BasePage title={t("Logs")} contentStyle={{ height: "calc(100% - 20px)" }}>
      <WarpBox>
        {loading ? (
          Array.from({ length: 20 }).map((it, idx) => {
            return <Skeleton height={60} key={idx} animation="wave" />;
          })
        ) : (
          <>
            {data?.status !== 0 ? (
              <div className="block top-status">
                <div className="icon-status">
                  <CurrentIcon color="red" fontSize={"100px"} />
                </div>
                <div className="status-name">{statusMap?.[data?.status]}</div>
                <div className="status-tip">
                  {data?.status === 2
                    ? "订单由于超时支付已被取消。"
                    : "订单已支付并开通。"}
                </div>
              </div>
            ) : null}
            <Grid container spacing={2}>
              <Grid item xs={data?.status == 0 ? 8 : 12}>
                <div className="block">
                  <div className="title">商品信息</div>
                  <ul className="detail">
                    <li>
                      <span>产品名称：</span> <span>{data?.plan?.name}</span>
                    </li>
                    <li>
                      <span>类型/周期：</span>
                      <span>
                        {get(enumPrice, data?.period)}
                        {/* { === "month_price" ? "月付" : "年付"} */}
                      </span>
                    </li>
                    <li>
                      <span>产品流量：</span>
                      <span>{data?.plan?.transfer_enable} GB</span>
                    </li>
                  </ul>
                </div>

                <div className="block">
                  <Box
                    className="title"
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <span>订单信息</span>
                    {data?.status === 0 && (
                      <LoadingButton
                        onClick={handleCancel}
                        loading={cancelLoading}
                        // onclick={() => handleCancel}
                        size="small"
                        variant="contained"
                        color="error"
                      >
                        关闭订单
                      </LoadingButton>
                    )}
                  </Box>
                  <ul className="detail">
                    <li>
                      <span>订单号：</span> <span>{data?.trade_no}</span>
                    </li>
                    <li>
                      <span>旧订阅折抵金额：</span>
                      <span>{(data?.surplus_amount / 100).toFixed(2)}</span>
                    </li>
                    <li>
                      <span>
                        {data?.balance_amount ? "余额支付：" : "退款金额："}
                      </span>
                      <span>
                        {data?.balance_amount
                          ? (data?.balance_amount / 100)?.toFixed(2)
                          : (data?.refund_amount / 100)?.toFixed(2)}
                        {/* refund_amount */}
                      </span>
                    </li>
                    <li>
                      <span>创建时间：</span>
                      <span>
                        {dayjs(data?.created_at * 1000).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </span>
                    </li>
                  </ul>
                </div>

                {data?.status === 0 && (
                  <Box className="block">
                    <div className="title">付款方式</div>
                    {payMethods?.map((item: any) => {
                      return (
                        <Box
                          onClick={setPayId.bind(null, item.id)}
                          padding="20px"
                          border={
                            payId === item.id
                              ? "2px solid rgb(27, 94, 169)"
                              : ""
                          }
                          borderRadius={"5px"}
                          key={item.id}
                        >
                          {item.name}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Grid>
              {data?.status == 0 && (
                <Grid item xs={4}>
                  <CardPayWarp margin="20px 0" lineHeight={"28px"}>
                    <Box fontWeight={"500"} color="rgb(225, 221, 212)">
                      订单总额
                    </Box>
                    <Box justifyContent={"space-between"} display={"flex"}>
                      <Box>
                        {data.plan?.name} x{" "}
                        {/* {data?.period == "month_price" ? "月付" : "年付"} */}
                        {get(enumPrice, data?.period)}
                      </Box>
                      <Box>
                        ¥
                        {data?.plan?.month_price
                          ? (data?.plan?.month_price / 100).toFixed(2)
                          : (data?.plan?.year_price / 100).toFixed(2)}
                      </Box>
                    </Box>
                    <Box margin="10px 0">
                      <Divider />
                    </Box>
                    {/* 
                            折抵
                            */}

                    <Box fontWeight={"500"} color="rgb(225, 221, 212)">
                      折抵
                    </Box>
                    <Box justifyContent={"space-between"} display={"flex"}>
                      <Box></Box>
                      <Box>¥{(data?.surplus_amount / 100).toFixed(2)}</Box>
                    </Box>
                    <Box margin="10px 0">
                      <Divider />
                    </Box>
                    {/*  */}
                    {/* 
                            退款
                            */}

                    <Box fontWeight={"500"} color="rgb(225, 221, 212)">
                      {data?.balance_amount ? "余额：" : "退款："}
                    </Box>
                    <Box justifyContent={"space-between"} display={"flex"}>
                      <Box>
                        {/* {data.plan?.name} x{" "}
                          {data?.period == "month_price" ? "月付" : "年付"} */}
                      </Box>
                      <Box>
                        {data?.balance_amount ? "" : "-"} ¥
                        {data?.balance_amount
                          ? (data?.balance_amount / 100)?.toFixed(2)
                          : (data?.refund_amount / 100)?.toFixed(2)}
                      </Box>
                    </Box>
                    <Box margin="10px 0">
                      <Divider />
                    </Box>
                    {/*  */}

                    <Box>总计</Box>
                    <Box lineHeight={"40px"} fontSize="26px" fontWeight="bold">
                      ¥{(data?.total_amount / 100).toFixed(2)}
                    </Box>
                    <Box margin="10px 0">
                      <LoadingButton
                        loading={payLoading}
                        variant="contained"
                        fullWidth
                        color="warning"
                        onClick={handlePay}
                      >
                        结账
                      </LoadingButton>
                    </Box>
                  </CardPayWarp>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* <OrderList dataList={data} /> */}
      </WarpBox>
      {/* , */}
      <OrderDialog
        status={orderStatus.data}
        loading={cancelLoading}
        open={dialogVis}
        onClose={handleCancel}
      />
    </BasePage>
  );
};

export default OrderItem;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgba(16 18 27 / 40%)",
  // padding: "10px",
  border: "1px solid var(--theme-bg-color)",
  margin: "10px",
  borderRadius: "14px",
  overflow: "hidden",
  padding: "20px",
  paddingTop: "0px",
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
