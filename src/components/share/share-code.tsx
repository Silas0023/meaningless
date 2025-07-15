import { LoadingButton } from "@mui/lab";
import { styled, Box, Typography, Button, Divider } from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
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
  createLink: any;
  loading: boolean;
}

const ShareCode = (props: Props) => {
  const { codes, loading } = props;

  const handleClick = () => {
    props?.createLink();
  };

  const handleCopy = async (item: any) => {
    try {
      await navigator.clipboard.writeText(`https://www.kuailian.dev`);
      toast.success("复制邀请链接成功，请CTRL+V粘贴给好友！");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
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
          邀请码管理
        </Typography>
        <LoadingButton
          loading={loading}
          onClick={handleClick}
          size="small"
          variant="contained"
          color="info"
        >
          生成邀请码
        </LoadingButton>
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
          邀请码
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ lineHeight: 2, minWidth: 30, mr: 2.25, textAlign: "center" }}
        >
          创建时间
        </Typography>
      </Box>
      {codes?.map((item) => {
        return (
          <Box
            key={item.id}
            marginTop={"10px"}
            // margin={"0px 0px 10px 0px"}
            display="flex"
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Typography
                align="left"
                width={"90px"}
                color="text.secondary"
                variant="body2"
                sx={{
                  lineHeight: 2,
                  minWidth: 30,
                  mr: 2.25,
                  textAlign: "center",
                }}
              >
                {item.code}
              </Typography>

              <Button
                onClick={handleCopy.bind(null, item)}
                size="small"
                variant="contained"
                color="success"
              >
                复制邀请链接
              </Button>
            </Box>
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
              {dayjs(item.create_at).format("YYYY-MM-DD HH:mm")}
            </Typography>
          </Box>
        );
      })}
    </Item>
  );
};

export default ShareCode;
