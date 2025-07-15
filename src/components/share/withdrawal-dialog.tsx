// import useSWR from "swr";
// import snarkdown from "snarkdown";
// import { useMemo } from "react";
// import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useFetch, { CachePolicies } from "use-http";

interface Props {
  open: boolean;
  onClose: () => void;
  reload: () => void;
  loading: boolean;
  status: number;
}

const TypeDialog = styled(Dialog)(({ theme }) => {
  return {
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    // "& .MuiPaper-root": {
    //   backgroundColor: "#171925",
    //   color: theme.palette.common.white,
    // },
    // "& .MuiDialogTitle-root": {
    //   borderBottom: "1px solid #2d3140",
    // },
    // #2d3140
    // transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  };
});

const TypeList = styled(List)(({ theme }) => ({
  "& .MuiListItem-root": {
    borderBottom: "1px solid #2d3140",
  },
}));

const WithDrawalDialog = (props: Props) => {
  const { open, onClose, loading, status, reload } = props;

  const { data: payMethods } = useFetch("/api/v1/user/comm/config", {}, []);

  const [withDrawalMethods, setWidthMethods] = useState<string>("");

  const [withDrawalNumber, setWidthNumber] = useState<string>("");

  useEffect(() => {
    if (payMethods?.withdraw_methods?.length > 0) {
      setWidthMethods(payMethods.withdraw_methods[0]);
    }
  }, [payMethods]);

  const {
    data,
    post,
    loading: withDrawLoading,
  } = useFetch("/api/v1/user/ticket/withdraw", {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  const handleWithdraw = () => {
    const newLocal = (Number.parseFloat(withDrawalNumber) || 0) * 100;
    post({
      withdraw_account: newLocal,
      withdraw_method: withDrawalMethods,
    }).then((res) => {
      if (res) {
        toast.success("申请提现成功，请等待客服打款！", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        onClose();
        reload();
      }
    });
  };

  return (
    <TypeDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // maxWidth={"xl"}
    >
      <DialogTitle aria-labelledby="customized-dialog-title">
        申请提现
      </DialogTitle>
      <DialogContent dividers>
        {/* <DialogContentText width={"500px"} id="alert-dialog-description"> */}
        <Stack margin={"20px 0px"} width={"500px"} spacing={2}>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">
              提现方式
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              label="提现方式"
              value={withDrawalMethods}
              onChange={(e) => {
                setWidthMethods(e.target.value);
              }}
            >
              {payMethods?.withdraw_methods?.map((item: any) => {
                return (
                  <MenuItem dense={false} key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {/* <Alert severity="warning">划转后的余额仅用于1clickpass消费使用</Alert> */}
          {/* <Select
          
            fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="提现方式"
            // onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          */}

          <FormControl sx={{ m: 1, minWidth: 80 }}>
            {/* <InputLabel id="demo-simple-select-autowidth-label">
              提现账号
            </InputLabel> */}
            <TextField
              value={withDrawalNumber}
              onChange={(e) => {
                setWidthNumber(e.target.value);
              }}
              id="outlined-basic"
              label="提现账号"
              variant="outlined"
            />
          </FormControl>
        </Stack>
        {/* 当前推广佣金余额 */}
        {/* </DialogContentText> */}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="info" onClick={onClose}>
          取消
        </Button>
        <LoadingButton
          loading={withDrawLoading}
          variant="contained"
          color="info"
          onClick={handleWithdraw}
          autoFocus
        >
          确认
        </LoadingButton>
      </DialogActions>
    </TypeDialog>
  );
};

export default WithDrawalDialog;

// https://mui.com/material-ui/react-dialog/#system-AlertDialog.tsx
