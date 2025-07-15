import useSWR from "swr";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { getRules } from "@/services/api";
import { BaseEmpty, BasePage } from "@/components/base";
import useFetch, { CachePolicies } from "use-http";
import BasicCard from "@/components/combo/basic-card";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import RuleItem from "@/components/rule/rule-item";
import HelpIcon from "@mui/icons-material/Help";
import ShareCode from "@/components/share/share-code";
import ShareDetail from "@/components/share/share-detail";
import { useMount } from "ahooks";
import ShareDialog from "@/components/share/share-dialog";
import WithDrawalDialog from "@/components/share/withdrawal-dialog";

const SharePage = () => {
  const { t } = useTranslation();
  // const { data = [] } = useSWR("getRules", getRules);

  const [openTransferState, setTransfer] = useState<boolean>(false);
  const [openWithDrawalState, setWithDrawalState] = useState<boolean>(false);

  // const rules = useMemo(() => {
  //   return data.filter((each) => each.payload.includes(filterText));
  // }, [data, filterText]);

  const { get: createLink, loading: createLoading } = useFetch(
    "/api/v1/user/invite/save",
    { cachePolicy: CachePolicies.NO_CACHE }
  );

  const {
    data,
    get: fetchData,
    loading,
  } = useFetch(
    "/api/v1/user/invite/fetch",
    {
      cachePolicy: CachePolicies.NO_CACHE,
      // suspense: true, // can put it in 2 places. Here or in Provider
    },
    []
  ); // onMount

  const handleOpenTransfer = () => setTransfer(true);
  const handleOpenWithDrawal = () => setWithDrawalState(true);
  const handleClick = () => {
    createLink().then((res) => {
      if (res) {
        fetchData("/");
      }
    });
  };

  const reload = () => {
    fetchData("/");
  };

  return (
    <BasePage title={t("Rules")} contentStyle={{ height: "100%" }}>
      <Paper elevation={0} sx={{ boxSizing: "border-box", height: "100%" }}>
        {loading ? (
          <Box padding={"10px"}>
            <Grid container spacing={2}>
              {Array.from({ length: 20 }).map((it, idx) => {
                return (
                  <Grid key={idx} item xs={4}>
                    <Skeleton height={300} animation="wave" />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          <Box padding={"10px"}>
            <Box bgcolor={"rgb(36, 37, 37)"} padding={"10px"}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                style={{
                  height: "40px",
                }}
              >
                <Typography>我的邀请</Typography>
                {/* <GroupAddIcon fontSize="large" /> */}
              </Box>
              <Divider />

              <Box display="flex" alignItems="flex-end">
                <Typography variant="h4" component="h2">
                  {data?.stat?.[4] && (data?.stat?.[4] / 100).toFixed(2)}
                </Typography>
                <Typography marginLeft={"10px"} variant="body1">
                  CNY
                </Typography>
              </Box>
              <Typography>当前剩余佣金</Typography>

              <Box marginTop={"10px"}>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={handleOpenTransfer}
                    size="small"
                    variant="contained"
                    color="info"
                  >
                    划转
                  </Button>
                  <Button
                    onClick={handleOpenWithDrawal}
                    size="small"
                    variant="outlined"
                    color="info"
                  >
                    推广佣金提现
                  </Button>
                </Stack>
              </Box>
            </Box>

            <Box
              marginTop={"10px"}
              bgcolor={"rgb(36, 37, 37)"}
              padding={"10px"}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems="center"
                height={"40px"}
              >
                <Typography>已注册用户数</Typography>
                <Typography marginLeft={"10px"} variant="body1">
                  {data?.stat?.[0] && data?.stat?.[0]}人
                </Typography>
              </Box>
              <Divider />
              <Box
                height={"40px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography>佣金比例</Typography>
                <Typography marginLeft={"10px"} variant="body1">
                  {data?.stat?.[3] && data?.stat?.[3]}%
                </Typography>
              </Box>
              <Divider />
              <Box
                height={"40px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography>
                  确认中的佣金
                  <Tooltip title="佣金将会在确认后到达您的佣金账户。">
                    <HelpIcon fontSize="small" />
                  </Tooltip>
                </Typography>
                <Typography marginLeft={"10px"} variant="body1">
                  ¥{data?.stat?.[2] && (data?.stat?.[2] / 100).toFixed(2)}
                </Typography>
              </Box>
              <Divider />
              <Box
                height={"40px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography>累计获得佣金</Typography>
                <Typography marginLeft={"10px"} variant="body1">
                  ¥ {data?.stat?.[1] && (data?.stat?.[1] / 100).toFixed(2)}
                </Typography>
              </Box>
              <Divider />
            </Box>
            <Box marginTop={"10px"}>
              <ShareCode
                codes={data?.codes}
                loading={createLoading}
                createLink={handleClick}
              />
            </Box>
            <Box marginTop={"10px"}>
              <ShareDetail codes={data?.codes} />
            </Box>
          </Box>
        )}
        <ShareDialog
          reload={reload}
          open={openTransferState}
          onClose={setTransfer.bind(null, false)}
          loading
          status={data?.stat?.[4] ? data?.stat?.[4] / 100 : 0}
        />
        <WithDrawalDialog
          open={openWithDrawalState}
          reload={reload}
          loading
          onClose={setWithDrawalState.bind(null, false)}
          status={0}
        />
      </Paper>
    </BasePage>
  );
};

export default SharePage;
