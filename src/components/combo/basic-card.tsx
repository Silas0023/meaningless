import {
  styled,
  Box,
  Typography,
  keyframes,
  Card,
  CardActions,
  Button,
  CardHeader,
  CardContent,
} from "@mui/material";
import { get } from "lodash-es";
import { useNavigate } from "react-router-dom";

export const priceProperties = [
  "month_price",
  "quarter_price",
  "half_year_price",
  "year_price",
  "two_year_price",
  "three_year_price",
];

export const enumPrice = {
  month_price: "月付",
  quarter_price: "季付",
  half_year_price: "半年付",
  year_price: "年付",
  two_year_price: "两年付",
  three_year_price: "三年付",
};

export const getPriceType = (itemDetail: any) => {
  let priceType = "";
  for (const prop of priceProperties) {
    if (itemDetail[prop] !== null && itemDetail[prop] !== undefined) {
      priceType = prop;
      break;
    }
  }

  return priceType;
  // detail
};

const spin = keyframes`
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
`;

interface ProjectItem {
  capacity_limit: string;
  time?: string;
  payload: string;
}

interface Props {
  detail: any;
  //   value: IBasicCard;
}

const BasicCard = (props: Props) => {
  const { detail } = props;

  // /api/v1/user/order/checkout
  const navigate = useNavigate();

  const currentPrice = getPriceType(detail);
  return (
    <WarpBox borderRadius={"10px"}>
      <div className="card-title">{detail.name}</div>
      <div className="card-subtitle">
        <div>
          {"¥"}
          {(detail?.[currentPrice] / 100).toFixed(2)}
        </div>
        <div className="sub-type">
          {get(enumPrice, currentPrice)}
          {/* {detail?.month_price ? "月付" : "年付"} */}
        </div>
      </div>
      <div
        className="card-inner"
        dangerouslySetInnerHTML={{ __html: detail.content || "NULL" }}
      ></div>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            navigate(`/combo/${detail.id}`);
          }}
          fullWidth
        >
          立即购买
        </Button>
      </CardActions>
    </WarpBox>
  );
};

export default BasicCard;

const WarpBox = styled(Box)(({ theme: { palette, typography } }) => ({
  background: "rgb(36, 37, 37)",
  fontWeight: "500",
  // padding: "20px",
  "& .card-title": {
    color: "rgba(229, 224, 216, 0.85)",
    lineHeight: "35px",
    padding: "10px",
  },
  "& .card-subtitle": {
    background: "rgb(46, 48, 47)",
    padding: "20px 10px",
    fontSize: "24px",
    fontWeight: "blob",
    "& .sub-type": {
      fontSize: "14px",
    },
  },
  ul: {
    listStyle: "inside",
    padding: "10px",
    lineHeight: "24px",
    color: "rgb(155, 145, 131)",
    "& font[color='black']": {
      color: "#e5e0d8",
    },
    "& font[color='blue']": {
      color: "#457fe5",
    },
  },
}));
