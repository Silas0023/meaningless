import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useClashInfo } from "@/hooks/use-clash";
import { useVerge } from "@/hooks/use-verge";
import { TrafficGraph, type TrafficRef } from "./traffic-graph";
import { useLogSetup } from "./use-log-setup";
import { useWebsocket } from "@/hooks/use-websocket";
import parseTraffic from "@/utils/parse-traffic";
import useFetch from "use-http";

// setup the traffic
const LayoutTraffic = ({ useAge }: any) => {
  // const { data: todos = [] } = useFetch('/api/v1/user/info', {
  //   suspense: true // can put it in 2 places. Here or in Provider
  // }, []) // onMount
  const { clashInfo } = useClashInfo();

  // whether hide traffic graph
  const { verge } = useVerge();
  const trafficGraph = verge?.traffic_graph ?? true;

  const trafficRef = useRef<TrafficRef>(null);
  const [traffic, setTraffic] = useState({ up: 0, down: 0 });

  // setup log ws during layout
  useLogSetup();

  const { connect, disconnect } = useWebsocket((event) => {
    const data = JSON.parse(event.data) as ITrafficItem;
    trafficRef.current?.appendData(data);
    setTraffic(data);
  });

  useEffect(() => {
    if (!clashInfo) return;

    const { server = "", secret = "" } = clashInfo;
    connect(`ws://${server}/traffic?token=${encodeURIComponent(secret)}`);

    return () => {
      disconnect();
    };
  }, [clashInfo]);

  useEffect(() => {
    // 页面隐藏时去掉请求
    const handleVisibleChange = () => {
      if (!clashInfo) return;
      if (document.visibilityState === "visible") {
        // reconnect websocket
        const { server = "", secret = "" } = clashInfo;
        connect(`ws://${server}/traffic?token=${encodeURIComponent(secret)}`);
      } else {
        disconnect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibleChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibleChange);
    };
  }, []);

  const [up, upUnit] = parseTraffic(traffic.up);
  const [down, downUnit] = parseTraffic(traffic.down);

  const valStyle: any = {
    component: "span",
    color: "primary",
    textAlign: "center",
    sx: { flex: "1 1 54px", userSelect: "none" },
  };
  const unitStyle: any = {
    component: "span",
    color: "grey.500",
    fontSize: "12px",
    textAlign: "right",
    sx: { flex: "0 1 27px", userSelect: "none" },
  };

  return (
    <Box
      width="200px"
      position="relative"
      top="20px"
      onClick={trafficRef.current?.toggleStyle}
    >
      {trafficGraph && (
        <div style={{ width: "100%", height: 40, marginBottom: 6 }}>
          <TrafficGraph ref={trafficRef} />
        </div>
      )}

      <Box
        mt="20px"
        display="flex"
        flex-direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex" alignItems="center" whiteSpace="nowrap">
          <ArrowUpward
            sx={{ mr: 0.75, fontSize: 18 }}
            color={+up > 0 ? "primary" : "disabled"}
          />
          <Typography {...valStyle}>{up}</Typography>
          <Typography {...unitStyle}>{upUnit}/s</Typography>
        </Box>

        <Box display="flex" alignItems="center" whiteSpace="nowrap">
          <ArrowDownward
            sx={{ mr: 0.75, fontSize: 18 }}
            color={+down > 0 ? "primary" : "disabled"}
          />
          <Typography {...valStyle}>{down}</Typography>
          <Typography {...unitStyle}>{downUnit}/s</Typography>
        </Box>
      </Box>
      {useAge?.transfer_enable && (
        <Box margin="10px 0px" fontSize={"12px"} fontWeight="bold">
          {(useAge?.u + useAge?.d) / 1024 / 1024 / 1024 > 1
            ? `已用 ${((useAge?.u + useAge?.d) / 1024 / 1024 / 1024).toFixed(
                2
              )} GB`
            : `已用 ${((useAge?.u + useAge?.d) / 1024 / 1024).toFixed(2)} MB`}
          / 总计
          {(useAge?.transfer_enable / 1024 / 1024 / 1024).toFixed(2)} GB
          {}
        </Box>
      )}
    </Box>
  );
};

export default LayoutTraffic;
