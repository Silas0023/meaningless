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

const TicketDialog = (props: Props) => {
  const { open, onClose, loading, status, reload } = props;

  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    message: "",
  });

  const {
    data: ticketRes,
    loading: ticketLoading,
    post: saveTicket,
  } = useFetch("/api/v1/user/ticket/save", {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  // const [withDrawalMethods, setWidthMethods] = useState<string>("");

  // const [withDrawalNumber, setWidthNumber] = useState<string>("");

  // useEffect(() => {
  //   if (payMethods?.withdraw_methods?.length > 0) {
  //     setWidthMethods(payMethods.withdraw_methods[0]);
  //   }
  // }, [payMethods]);

  // const {
  //   data,
  //   post,
  //   loading: withDrawLoading,
  // } = useFetch("/api/v1/user/ticket/withdraw", {
  //   cachePolicy: CachePolicies.NO_CACHE,
  // });

  // const handleWithdraw = () => {
  //   const newLocal = (Number.parseFloat(withDrawalNumber) || 0) * 100;
  //   post({
  //     withdraw_account: newLocal,
  //     withdraw_method: withDrawalMethods,
  //   }).then((res) => {
  //     if (res) {
  //       toast.success("申请提现成功，请等待客服打款！", {
  //         position: "bottom-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "dark",
  //       });
  //       onClose();
  //       reload();
  //     }
  //   });
  // };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    saveTicket({
      ...formData,
    }).then((res) => {
      if (res) {
        setFormData({
          subject: "",
          level: "",
          message: "",
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
        新的工单
      </DialogTitle>
      <DialogContent dividers>
        {/* <DialogContentText width={"500px"} id="alert-dialog-description"> */}
        <Stack margin={"20px 0px"} width={"500px"} spacing={3}>
          <FormControl>
            <TextField
              value={formData.subject}
              onChange={handleInputChange}
              id="subject"
              name="subject"
              label="主题"
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">
              工单等级
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="level"
              name="level"
              label="提现方式"
              value={formData.level}
              onChange={handleInputChange}
            >
              <MenuItem dense={false} value={0}>
                低
              </MenuItem>
              <MenuItem dense={false} value={1}>
                中
              </MenuItem>
              <MenuItem dense={false} value={2}>
                高
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <TextField
              value={formData.message}
              multiline
              rows={3}
              onChange={handleInputChange}
              id="message"
              name="message"
              label="消息"
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
          loading={ticketLoading}
          variant="contained"
          color="info"
          onClick={handleSubmit}
          autoFocus
        >
          确认
        </LoadingButton>
      </DialogActions>
    </TypeDialog>
  );
};

export default TicketDialog;

// https://mui.com/material-ui/react-dialog/#system-AlertDialog.tsx
