import React, { ReactNode } from "react";
import { Box, Link, Typography } from "@mui/material";
import { BaseErrorBoundary } from "./base-error-boundary";
import CampaignIcon from "@mui/icons-material/Campaign";
import LanguageIcon from "@mui/icons-material/Language";
import { openWebUrl } from "@/services/cmds";
interface Props {
  title?: React.ReactNode; // the page title
  header?: React.ReactNode; // something behind title
  contentStyle?: React.CSSProperties;
  children?: ReactNode;
}

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, children } = props;

  return (
    <BaseErrorBoundary>
      <div className="base-page" data-windrag>
        <header data-windrag style={{ userSelect: "none" }}>
          <Typography variant="h4" component="p" data-windrag>
            {/* {title} */}
          </Typography>

          {header}
        </header>

        <section>
          <div className="base-content" style={contentStyle} data-windrag>
            {children}
          </div>
        </section>
        <footer className="footer">
          <div className="noc-text">
            <Box
              display={"flex"}
              flex={"1"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box display={"flex"} alignItems={"center"}>
                <CampaignIcon />
                <span>[福利]一键连加速器限时活动正在进行中。。。</span>
              </Box>
              {/* <Link
                onClick={() => {
                  openWebUrl("https://vip.1clickpass.com/");
                }}
                display={"flex"}
                alignItems={"center"}
                style={{
                  cursor: "pointer",
                }}
              >
                <LanguageIcon
                  style={{
                    marginRight: "10px",
                  }}
                  fontSize="small"
                />
                官方网站
              </Link> */}
            </Box>
          </div>
        </footer>
      </div>
    </BaseErrorBoundary>
  );
};
