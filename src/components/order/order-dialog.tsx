// import useSWR from "swr";
// import snarkdown from "snarkdown";
// import { useMemo } from "react";
// import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  Stack,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  status: number;
}

const TypeDialog = styled(Dialog)(({ theme }) => {
  return {
    "& .MuiPaper-root": {
      backgroundColor: "#171925",
      color: theme.palette.common.white,
    },
    "& .MuiDialogTitle-root": {
      borderBottom: "1px solid #2d3140",
    },
    // #2d3140
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  };
});

const TypeList = styled(List)(({ theme }) => ({
  "& .MuiListItem-root": {
    borderBottom: "1px solid #2d3140",
  },
}));

const OrderDialog = (props: Props) => {
  const { open, onClose, loading, status } = props;

  // useEffect(() => {

  // }, [status]);

  const handleCheck = () => {
    if (status !== 3) {
      toast.warn("订单支付失败，请重新支付！", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  return (
    <TypeDialog maxWidth="sm" open={open}>
      <DialogContent>
        <Box
          padding={"0 20px"}
          display={"flex"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
        >
          <Box
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width={"96px"}
            height={"96px"}
            bgcolor={"#f3f5f6"}
            borderRadius={"200px"}
          >
            <HourglassEmptyIcon sx={{ fontSize: 60, color: "#b2b8bd" }} />
          </Box>
          <Box margin="10px 0px" fontSize={"16px"} fontWeight={"bold"}>
            等待您完成支付...
          </Box>
          <Box
            margin="0px 0px 20px 0px"
            color={"rgba(229, 224, 216, 0.85)"}
            fontSize={"12px"}
            fontWeight={"bold"}
          >
            请在支付页面继续完成支付
          </Box>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleCheck} variant="contained">
              支付完成
            </Button>
            <LoadingButton
              loading={loading}
              onClick={onClose}
              variant="contained"
              color="error"
            >
              取消支付
            </LoadingButton>
          </Stack>
        </Box>
      </DialogContent>
    </TypeDialog>
  );
};

export default OrderDialog;

const TypeBox = styled(Box)(({ theme: { palette, typography } }) => ({
  // border: "1px solid #ccc",
  // borderColor: alpha(palette.text.secondary, 0.36),
  color: alpha(palette.text.secondary, 1),
  borderRadius: 4,
  fontSize: 10,
  fontFamily: typography.fontFamily,
  marginRight: "4px",
  padding: "0 4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // lineHeight: 1.25,
}));
