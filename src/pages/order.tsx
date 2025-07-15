import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import useFetch, { CachePolicies } from "use-http";
import OrderList from "@/components/order/order-list";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { get as lodashGet } from "lodash-es";
import { enumPrice } from "@/components/combo/basic-card";
// import styled from "@emotion/styled";

const statusMap: any = {
  0: "等待付款",
  1: "开通中",
  2: "已取消",
  3: "已完成",
  4: "已折抵",
};
function createData(
  trade_no: string,
  period: string,
  total_amount: number,
  status: number,
  created_at: number
) {
  return { trade_no, period, total_amount, status, created_at };
}

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

const OrderPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { get, data, loading, response } = useFetch(
    "/api/v1/user/order/fetch",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    },
    []
  ); // onMount

  const { post, loading: cancelLoading } = useFetch("api/v1/user/order/cancel");

  const rows = data?.map((item: any) => {
    return createData(
      item.trade_no,
      item.period,
      item.total_amount,
      item.status,
      item.created_at
    );
  });

  const handleCancel = async (id: string) => {
    const res = await post({
      trade_no: id,
    });
    get();
  };
  return (
    <BasePage title={t("Logs")} contentStyle={{ height: "calc(100% - 20px)" }}>
      <WarpBox>
        {loading ? (
          Array.from({ length: 20 }).map((it, idx) => {
            return <Skeleton height={50} key={idx} animation="wave" />;
          })
        ) : (
          // <OrderList dataList={data} />
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650, maxHeight: 200, overflow: "hidden" }}
              // size="small"
              stickyHeader
              aria-label="sticky table"
              // aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell align="right">周期</TableCell>
                  <TableCell align="right">订单金额</TableCell>
                  <TableCell align="right">订单状态</TableCell>
                  <TableCell align="right">创建时间</TableCell>
                  <TableCell align="left">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row: any) => (
                  <TableRow
                    key={row.trade_no}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link
                        onClick={() => {
                          navigate(`/order/${row.trade_no}`);
                        }}
                        color={"rgb(98, 169, 228)"}
                      >
                        {row.trade_no}
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      {/* {row.period === "month_price" ? "月付" : "年付"} */}
                      {lodashGet(enumPrice, row?.period)}
                    </TableCell>
                    <TableCell align="right">
                      {(row.total_amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        {/* <Badge badgeContent={1} color="info"> */}
                        {statusMap?.[row?.status]}
                        {/* </Badge> */}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {dayjs(row.created_at * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={2}>
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          onClick={() => {
                            navigate(`/order/${row.trade_no}`);
                          }}
                        >
                          查看详情
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleCancel.bind(null, row.trade_no)}
                          color="info"
                          disabled={row.status !== 0}
                        >
                          取消
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </WarpBox>
    </BasePage>
  );
};

export default OrderPage;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgba(16 18 27 / 40%)",
  // padding: "10px",
  border: "1px solid var(--theme-bg-color)",
  margin: "10px",
  borderRadius: "14px",
  overflow: "hidden",
}));
