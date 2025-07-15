import { styled, Box, Typography, Button, Divider } from "@mui/material";
import dayjs from "dayjs";
import useFetch from "use-http";

interface ICodeItem {
  code: string;
  create_at: number;
  id: number;
  pv: number;
  status: number;
  updated_at: number;
  user_id: number;
}

const Item = styled(Box)(({ theme }) => ({
  //   display: "flex",
  padding: "10px",
  color: theme.palette.text.primary,
  background: "rgb(36, 37, 37)",
}));

interface Props {
  codes: Array<ICodeItem>;
}

const ShareDetail = (props: Props) => {
  const { data } = useFetch("/api/v1/user/invite/details", {}, []);

  return (
    <Item>
      <Box
        margin={"0px 0px 10px 0px"}
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ lineHeight: 2, minWidth: 30, mr: 2.25, textAlign: "center" }}
        >
          佣金发放记录
        </Typography>
      </Box>
      <Divider />

      <Box
        marginTop={"10px"}
        // margin={"0px 0px 10px 0px"}
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ lineHeight: 2, minWidth: 30, mr: 2.25, textAlign: "center" }}
        >
          发放时间
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ lineHeight: 2, minWidth: 30, mr: 2.25, textAlign: "center" }}
        >
          佣金
        </Typography>
      </Box>
      {data?.length > 0 ? (
        data?.map((item: any) => {
          return (
            <Box
              key={item.id}
              marginTop={"10px"}
              // margin={"0px 0px 10px 0px"}
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Typography
                align="left"
                color="text.secondary"
                variant="body2"
                sx={{
                  lineHeight: 2,
                  minWidth: 30,
                  mr: 2.25,
                  textAlign: "center",
                }}
              >
                {dayjs(item.created_at * 1000).format("YYYY-MM-DD HH:mm")}
              </Typography>

              <Typography
                color="text.secondary"
                variant="body2"
                sx={{
                  lineHeight: 2,
                  minWidth: 30,
                  mr: 2.25,
                  textAlign: "center",
                }}
              >
                ¥{(item.get_amount / 100).toFixed(2)}
              </Typography>
            </Box>
          );
        })
      ) : (
        <Box>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              lineHeight: 2,
              minWidth: 30,
              mr: 2.25,
              textAlign: "center",
            }}
          >
            您还没有佣金到账记录
          </Typography>
        </Box>
      )}
    </Item>
  );
};

export default ShareDetail;
