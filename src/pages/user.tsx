import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Link,
  ListItem,
  ListItemText,
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

const UserPage = () => {
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
      // header={
      //   <Button
      //     onClick={setTicketDialog.bind(null, true)}
      //     color="info"
      //     variant="contained"
      //     size="small"
      //   >
      //     新建工单
      //   </Button>
      // }
      title={t("Logs")}
      contentStyle={{ height: "calc(100% - 20px)" }}
    >
      <Card>
        <WarpBox>
          <svg
            className="MuiBox-root css-1nfvd2g"
            fill="none"
            viewBox="0 0 144 62"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
              fill="currentColor"
              fill-rule="evenodd"
            ></path>
          </svg>
        </WarpBox>
        <ListItemText></ListItemText>
        <Stack></Stack>
        <Divider></Divider>
        <Box></Box>
      </Card>
    </BasePage>
  );
};

export default UserPage;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  // background: "rgba(16 18 27 / 40%)",
  // // padding: "10px",
  // height: "100%",
  // border: "1px solid var(--theme-bg-color)",
  // margin: "10px",
  // borderRadius: "14px",
  // overflow: "hidden",

  "& .css-1nfvd2g": {
    width: "144px",
    height: " 62px",
    color: "rgb(33, 43, 54)",
    left: "0px",
    right: "0px",
    zIndex: "10",
    marginLeft: "auto",
    marginRight: "auto",
    bottom: "-26px",
    position: "absolute",
  },
}));
