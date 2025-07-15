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
  IconButton,
  InputAdornment,
  Radio,
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

const ShareDialog = (props: Props) => {
  const { open, onClose, loading, status, reload } = props;

  const [transferValue, setTransferValue] = useState<number | undefined>();

  const {
    data,
    post,
    loading: transferLoading,
  } = useFetch("/api/v1/user/transfer", {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  const handleTransfer = () => {
    const newLocal = (transferValue || 0) * 100;
    post({
      transfer_amount: newLocal,
    }).then((res) => {
      if (res) {
        toast.success("佣金划转成功！", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTransferValue(undefined);
        onClose();
        reload();
      }
    });
  };

  const handleInputChange = (e: any) => {
    setTransferValue(e.target.value);
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
        推广佣金划转至余额
      </DialogTitle>
      <DialogContent dividers>
        {/* <DialogContentText width={"500px"} id="alert-dialog-description"> */}
        <Stack spacing={2}>
          <Alert severity="warning">划转后的余额仅用于1clickpass消费使用</Alert>
          <TextField
            autoFocus
            margin="dense"
            variant="outlined"
            id="currentValue"
            label="当前推广佣金余额"
            type="email"
            fullWidth
            disabled
            value={status}

            // startAdornment={
            //   <InputAdornment position="start">$</InputAdornment>
            // }
          />
          <TextField
            autoFocus
            margin="dense"
            variant="outlined"
            id="transferValue"
            label="输入需要划转到余额的金额"
            type="email"
            fullWidth
            onChange={handleInputChange}
            value={transferValue || ""}
          />
        </Stack>
        {/* 当前推广佣金余额 */}
        {/* </DialogContentText> */}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="info" onClick={onClose}>
          取消
        </Button>
        <LoadingButton
          loading={transferLoading}
          variant="contained"
          color="info"
          onClick={handleTransfer}
          autoFocus
        >
          确认
        </LoadingButton>
      </DialogActions>
    </TypeDialog>
  );
};

export default ShareDialog;

// https://mui.com/material-ui/react-dialog/#system-AlertDialog.tsx
