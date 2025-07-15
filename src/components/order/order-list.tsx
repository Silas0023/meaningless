import { styled, Box, Typography, keyframes } from "@mui/material";
import { useNavigate } from "react-router-dom";

const spin = keyframes`
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
`;
// background: #191c29;
// width: var(--card-width);
// height: var(--card-height);
// padding: 3px;
// position: relative;
// border-radius: 6px;
// justify-content: center;
// align-items: center;
// text-align: center;
// display: flex;
// font-size: 1.5em;
// color: rgb(88 199 250 / 0%);
// cursor: pointer;

//   .card::before {
//     content: "";
//     width: 104%;
//     height: 102%;
//     border-radius: 8px;
//     background-image: linear-gradient(
//       var(--rotate)
//       , #5ddcff, #3c67e3 43%, #4e00c2);
//       position: absolute;
//       z-index: -1;
//       top: -1%;
//       left: -2%;
//       animation: spin 2.5s linear infinite;
//   }

//   .card::after {
//     position: absolute;
//     content: "";
//     top: calc(var(--card-height) / 6);
//     left: 0;
//     right: 0;
//     z-index: -1;
//     height: 100%;
//     width: 100%;
//     margin: 0 auto;
//     transform: scale(0.8);
//     filter: blur(calc(var(--card-height) / 6));
//     background-image: linear-gradient(
//       var(--rotate)
//       , #5ddcff, #3c67e3 43%, #4e00c2);
//       opacity: 1;
//     transition: opacity .5s;
//     animation: spin 2.5s linear infinite;
//   }

const Item = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "#191c29",
  margin: "10px 20px",
  padding: "3px",
  width: "var(--card-width)",
  height: "var(--card-height)",
  position: "relative",
  borderRadius: "6px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  //   color: "rgb(88 199 250 / 0%)",
  cursor: "pointer",
  "& ::before": {
    content: "''",
    width: "104%",
    height: "102%",
    borderRadius: "8px",
    backgroundImage:
      "linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2)",
    position: "absolute",
    zIndex: "1",
    top: "-1%",
    left: "-2%",
    animation: "spin 2.5s linear infinite",
    // border-radius: 8px;
    // background-image: linear-gradient(
    //   var(--rotate)
    //   , #5ddcff, #3c67e3 43%, #4e00c2);
    //   position: absolute;
    //   z-index: -1;
    //   top: -1%;
    //   left: -2%;
    //   animation: spin 2.5s linear infinite;
  },
  "& ::after": {
    position: "absolute",
    content: "''",
    top: "calc(var(--card-height) / 6)",
    left: "0",
    right: "0",
    zIndex: "1",
    height: "100%",
    width: "100%",
    margin: "0 auto",
    transform: "scale(0.8)",
    filter: "blur(calc(var(--card-height) / 6))",
    opacity: 1,
    transition: "opacity .5s",
    animation: " spin 2.5s linear infinite",
    //     left: 0;
    //     right: 0;
    //     z-index: -1;
    //     height: 100%;
    //     width: 100%;
    //     margin: 0 auto;
    //     transform: scale(0.8);
    //     filter: blur(calc(var(--card-height) / 6));
    //     background-image: linear-gradient(
    //       var(--rotate)
    //       , #5ddcff, #3c67e3 43%, #4e00c2);
    //       opacity: 1;
    //     transition: opacity .5s;
    //     animation: spin 2.5s linear infinite;
  },
  //   padding: "8px 0",
  //   margin: "0 12px",
  //   lineHeight: 1.35,
  //   borderBottom: `1px solid ${palette.divider}`,
  //   fontSize: "0.875rem",
  //   fontFamily: typography.fontFamily,
  //   userSelect: "text",
  //   "& .time": {
  //     color: palette.text.secondary,
  //   },
  //   "& .type": {
  //     display: "inline-block",
  //     marginLeft: 8,
  //     textAlign: "center",
  //     borderRadius: 2,
  //     textTransform: "uppercase",
  //     fontWeight: "600",
  //   },
  //   '& .type[data-type="error"], & .type[data-type="err"]': {
  //     color: palette.error.main,
  //   },
  //   '& .type[data-type="warning"], & .type[data-type="warn"]': {
  //     color: palette.warning.main,
  //   },
  //   '& .type[data-type="info"], & .type[data-type="inf"]': {
  //     color: palette.info.main,
  //   },
  //   "& .data": {
  //     color: palette.text.primary,
  //   },
}));

interface ProjectItem {
  capacity_limit: string;
  time?: string;
  payload: string;
}

interface Props {
  dataList: any;
  //   value: IOrderList;
}

const statusMap: any = {
  0: "等待付款",
  1: "开通中",
  2: "已取消",
  3: "已完成",
  4: "已折抵",
};
const OrderList = (props: Props) => {
  const { dataList } = props;
  const navigate = useNavigate();
  //   console.log(dataList, "dataList");
  return (
    <Box>
      {dataList?.map((i: any) => {
        // const idx = (i.status || 0) as any;
        return (
          <OrderItem key={i.trade_no}>
            <TagBox>{i?.plan?.name}</TagBox>
            <div className="order-status">
              {statusMap?.[i.status!]}
              {/* <Badge status="success" /> */}
            </div>
            <div className="order-price">
              <span>
                ¥
                {i.plan.month_price
                  ? i.plan.month_price / 100
                  : i.plan.year_price / 100}
              </span>

              <div
                onClick={() => {
                  navigate(`/order/${i.trade_no}`);
                  // props.setActOrder(item.trade_no)
                }}
                className="view-order"
              >
                查看订单
              </div>
              {/* <span>
    <Icon type="right" />
    </span> */}
            </div>
          </OrderItem>
        );
      })}
      {/* content */}
      {/* <Typography
        component="div"
        width="100%"
        title={"value"}
        //   color={value ? "text.primary" : "text.secondary"}
        sx={({ palette }) => ({
          "> span": {
            color: palette.primary.main,
          },
        })}
        dangerouslySetInnerHTML={{ __html: detail.content || "NULL" }}
      /> */}

      {/* <div>
        <span className="time">{value.time}</span>
        <span className="type" data-type={value.type.toLowerCase()}>
          {value.type}
        </span>
      </div>
      <div>
        <span className="data">{value.payload}</span>
      </div> */}
    </Box>
  );
};

export default OrderList;

const OrderItem = styled(Box)(({ theme: { palette, typography } }) => ({
  padding: " 10px 18px",
  display: "flex",
  alignItems: "center",
  fontSize: "16px",
  whiteSpace: "nowrap",
  transition: "0.3s",
  borderBottom: "1px solid var(--border-color)",
  color: "var(--theme-color)",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "var(--theme-bg-color)",
  },
  "& .order-status": {
    flex: 1,
    textAlign: "center",
  },
  "& .order-price": {
    width: "200px",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
  },
  "& .view-order": {
    background: "none",
    border: "1px solid var(--button-inactive)",
    fontSize: " 15px",
    marginTop: "0",
    padding: "8px 26px",
    color: "var(--theme-color)",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s",
    whiteSpace: "nowrap",
    marginLeft: "20px",
  },
}));

const TagBox = styled(Box)(({ theme: { palette, typography } }) => ({
  borderRadius: "10px",
  border: " 1px solid #C75DEB",
  backgroundColor: "#3a3375",
  padding: "4px 0px",
  width: "80px",
  textAlign: "center",
}));
