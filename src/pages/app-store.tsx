import useSWR from "swr";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import {
  Box,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  styled,
} from "@mui/material";
import { getRules } from "@/services/api";
import { BaseEmpty, BasePage } from "@/components/base";
import useFetch from "use-http";
import BasicCard from "@/components/combo/basic-card";
import { appList } from "./data";
import { openWebUrl } from "@/services/cmds";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import RuleItem from "@/components/rule/rule-item";

const AppPage = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("1");

  // https://aa18.de/apiv2/clickPass/getAppCenter
  const { data, loading } = useFetch(
    "/apiv2/clickPass/getAppCenter",
    {
      onNewData(currData, newData) {
        setValue(newData?.data?.[0]?.title);
        return newData;
      },
    },
    []
  );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BasePage
      title={t("Rules")}
      contentStyle={{
        height: "calc(100% - 0px)",

        overflow: "hidden",
      }}
    >
      <PageWarp elevation={0} sx={{ boxSizing: "border-box", height: "100%" }}>
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
          <div className="app-detail-warp">
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  {data?.data?.map((item: any) => {
                    return (
                      <Tab
                        key={item.title}
                        label={item.title}
                        value={item.title}
                      />
                    );
                  })}
                </TabList>
              </Box>

              {Array.isArray(data?.data) &&
                data?.data?.map((item: any) => {
                  return (
                    <TabPanel value={item.title} key={item.title}>
                      <Grid container spacing={12}>
                        {item?.typeData?.map((item: any) => {
                          return (
                            <Grid item key={item.appName}>
                              <div className="app-detail-item">
                                <div
                                  style={{
                                    backgroundColor: "white",
                                    backgroundSize: "80% 80%",
                                  }}
                                  onClick={() => {
                                    openWebUrl(item.appLink);
                                  }}
                                  className="app-item"
                                  key={item.appName}
                                >
                                  <img src={item.appIcon} />
                                </div>

                                <div>{item.appName}</div>
                              </div>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </TabPanel>
                  );
                })}
            </TabContext>
          </div>
        )}
      </PageWarp>
    </BasePage>
  );
};

export default AppPage;

const WarpBox = styled(Paper)(({ theme: { palette, typography } }) => ({}));

const PageWarp = styled(Paper)(({ theme: { palette, typography } }) => ({
  "& .app-detail-warp": {
    width: "100%",
    height: "calc(100% - 20px)",
    "& .MuiTabPanel-root": {
      height: "calc(100% - 100px)",
      overflow: "hidden",
      overflowY: "scroll",
    },
  },
}));
