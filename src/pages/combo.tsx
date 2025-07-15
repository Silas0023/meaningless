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
  TextField,
  styled,
} from "@mui/material";
import { getRules } from "@/services/api";
import { BaseEmpty, BasePage } from "@/components/base";
import useFetch, { CachePolicies } from "use-http";
import BasicCard from "@/components/combo/basic-card";
import dayjs from "dayjs";
import bgImg from "@/assets/image/glass.png";
// import RuleItem from "@/components/rule/rule-item";

const ComboPage = () => {
  const { t } = useTranslation();
  // const { data = [] } = useSWR("getRules", getRules);

  // const [filterText, setFilterText] = useState("");

  // const rules = useMemo(() => {
  //   return data.filter((each) => each.payload.includes(filterText));
  // }, [data, filterText]);

  const { data: userInfo } = useFetch(
    "/api/v1/user/info",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    },
    []
  );
  const { data: combos = [], loading } = useFetch(
    "/api/v1/user/plan/fetch",
    {
      // suspense: true, // can put it in 2 places. Here or in Provider
    },
    []
  ); // onMount

  // console.log(userInfo, "userInfouserInfo");
  const mm = userInfo
    ? dayjs(userInfo.expired_at * 1000).diff(Date.now(), "minute")
    : -1;
  return (
    <BasePage title={t("Rules")} contentStyle={{ height: "100%" }}>
      <Paper elevation={0} sx={{ boxSizing: "border-box", height: "100%" }}>
        <StyledBox>
          <div className="plane-banner">
            <div className="banner-user-info">
              {userInfo && (
                <>
                  <div className="plane-detial-user">
                    <div className="plan-name-warp">
                      {/* {props.subInfo.plan.name} */}
                    </div>
                    <span>
                      Hi!{" "}
                      {userInfo.email
                        ?.replace("@phone.com", "")
                        .replace("@phoneSms.com", "")}
                    </span>
                  </div>
                  <Box marginBottom={"10px"}>
                    {mm < 1 ? (
                      <Box color={"#fff"}>您的账户已过期，请购买套餐。</Box>
                    ) : (
                      <div className="day">
                        您的套餐有效期至：
                        {dayjs(userInfo.expired_at * 1000).format(
                          "YYYY年MM月DD日 HH:mm:ss"
                        )}
                      </div>
                    )}
                  </Box>
                  <div className="day">
                    您的账户余额：¥{(userInfo.balance / 100).toFixed(2)}
                  </div>
                  {/* <span> Hi! {userInfo.email}</span> */}
                </>
              )}
            </div>
            <img className="content-wrapper-img" src={bgImg} alt="" />
          </div>
        </StyledBox>

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
            <Grid container spacing={2}>
              {combos.map((combo: any) => (
                <Grid key={combo.id} item xs={4}>
                  <BasicCard detail={combo} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </BasePage>
  );
};

export default ComboPage;

const StyledBox = styled(Box)(({ theme: { palette, typography } }) => ({
  "& .plane-banner": {
    height: "150px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    width: " calc(100% - 15px)",
    justifyContent: "space-between",
    borderRadius: "14px",
    margin: "10px 20px 10px 10px",
    paddingLeft: "20px",
    fontWeight: "bold",
    backgroundImage:
      "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABkCAMAAADqvX3PAAAAKlBMVEUAAADX19fX19fBwcHT09PX19fW1tbT09PW1tbV1dXOzs7Ozs7BwcHV1dX5uIg2AAAADnRSTlMAPQAKH0czAAApFAAAAHys1goAAAHwSURBVHja7ZfdcuMwCEb1GUIDcd//dZuk2n5rZzCKOzuzFzo3+XNOBAIHtQosxwi0XUw/jjh2qN1pVzV43FJwJIDLuq5tvaNmzxeEZI5wWP/p9v0gypgGYhGH8fL28yyM7ycOJkFlJW3tZDHhRdBjIO22JR6a1BGMgTAWopvr6BC1jSB1MDWyXYfvkpDlg4iiV83lITiuoXZL+U4/ltcNq2MhogaYBWMYjYU8HHfSRdTrCIOLYImemrfz8dMO6DlVGYyFMWz3tmuGY6GgO1ikXVM51JDXurBO0nyEcyPTnvOXvmyb0hzqfV64jUUYw47Re9CZe6EbeC+M39+TcfK/gTFZuxZgOSag7aMASwGkrQW1Y2lLwXRMx3RMx3T8Pw67FpSOcA5RCccOcTMNL05aRw7Fn2kizA7+1VNH6ENAOBgOxiIK888dHPVqh+Q/yeknzQfHkhx+nqyjT0QFzDUd2Skp53lp7PdFnEkYIhzQv/KRzJUV0QdDSON5+S14CEW0vqSTiAPWWDknCLsY0BZxnNP0L/Z9YQEO8yznXZ2yNwfgTu7rNFgj9aamvS9eZljMTNOeoybSGNwQkvZ+3XrCU07t4HmWSBjDLBzEwdSzhMYcRPRZNYmgdjA1FyahcKQIqpKZs8N0TMd0TMd0/BvHF8n9f8tHo7HcAAAAAElFTkSuQmCC), linear-gradient(to right top, #cf4af3, #e73bd7, #f631bc, #fd31a2, #ff3a8b, #ff4b78, #ff5e68, #ff705c, #ff8c51, #ffaa49, #ffc848, #ffe652)",
  },
  "& .content-wrapper-img": {
    width: "130px",
    objectFit: "cover",
    marginTop: " -25px",
    objectPosition: "center",
  },
  "& .plane-detial-user": {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    marginBottom: "10px",
  },
}));
