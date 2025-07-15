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
  Typography,
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
import { LoadingButton } from "@mui/lab";
import TicketDialog from "@/components/ticket/ticket-dialog";
// import styled from "@emotion/styled";

const statusMap: any = {
  0: "待回复",
  1: "已关闭",
  // 2: "已取消",
  // 3: "已完成",
  // 4: "已折抵",
};
function createData(
  id: number,
  subject: string,
  level: number,
  status: number,
  created_at: number,
  updated_at: number
) {
  return { id, subject, level, status, created_at, updated_at };
}

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

const TicketPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ticketDialog, setTicketDialog] = useState(false);

  const { get, data, loading, response } = useFetch(
    "/api/v1/user/ticket/fetch",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    },
    []
  ); // onMount

  const { post, loading: closeLoading } = useFetch("api/v1/user/ticket/close");

  const rows = data?.map((item: any) => {
    return createData(
      item.id,
      item.subject,
      item.level,
      item.status,
      item.created_at,
      item.updated_at
    );
  });

  const handleCancel = async (id: string) => {
    const res = await post({
      id: id,
    });
    get();
  };
  return (
    <BasePage
      header={
        <Button
          onClick={setTicketDialog.bind(null, true)}
          color="info"
          variant="contained"
          size="small"
        >
          新建工单
        </Button>
      }
      title={t("Logs")}
      contentStyle={{ height: "calc(100% - 20px)" }}
    >
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
                  <TableCell>#</TableCell>
                  <TableCell align="right">主题</TableCell>
                  <TableCell align="right">工单级别</TableCell>
                  <TableCell align="right">工单状态</TableCell>
                  <TableCell align="right">创建时间</TableCell>
                  <TableCell align="right">最后回复</TableCell>
                  <TableCell align="left">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map?.((row: any) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell width={60} component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.subject}</TableCell>
                    <TableCell width={60} align="right">
                      {row.level === 0 ? "低" : row.level === 1 ? "中" : "高"}
                    </TableCell>
                    <TableCell align="right" width={90}>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent="center"
                      >
                        <Box
                          marginRight="5px"
                          width="6px"
                          height="6px"
                          bgcolor={row?.status === 1 ? "#f5222d" : "#52c41a"}
                          borderRadius={"5px"}
                        ></Box>
                        <Typography>{statusMap[row?.status]}</Typography>
                        {/* </Badge> */}
                      </Box>
                    </TableCell>
                    <TableCell width={90} align="right">
                      {dayjs(row.created_at * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell width={90} align="right">
                      {dayjs(row.updated_at * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={2}>
                        <Button
                          size="small"
                          color="info"
                          variant="contained"
                          onClick={() => {
                            navigate(`/ticket/${row.id}`);
                          }}
                        >
                          查看
                        </Button>
                        <LoadingButton
                          loading={closeLoading}
                          size="small"
                          variant="contained"
                          onClick={handleCancel.bind(null, row.id)}
                          color="warning"
                          disabled={row.status !== 0}
                        >
                          关闭
                        </LoadingButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* ticketDialog, setTicketDialog */}
        <TicketDialog
          open={ticketDialog}
          onClose={setTicketDialog.bind(null, false)}
          reload={get}
          loading={false}
          status={0}
        />
      </WarpBox>
    </BasePage>
  );
};

export default TicketPage;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgba(16 18 27 / 40%)",
  // padding: "10px",
  border: "1px solid var(--theme-bg-color)",
  margin: "10px",
  borderRadius: "14px",
  overflow: "hidden",
}));
