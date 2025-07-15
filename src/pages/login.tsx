import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  List,
  Paper,
  Snackbar,
  Stack,
  styled,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  Zoom,
} from "@mui/material";

import { appWindow } from "@tauri-apps/api/window";
import getSystem from "@/utils/get-system";

import bgSvg from "@/assets/image/login.svg";
import { useEffect, useState } from "react";
import useFetch, { CachePolicies } from "use-http";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { openWebUrl } from "@/services/cmds";
// import { Tab } from "@mui/icons-material";

import useSmsCodeCountdown from "@/hooks/useSmsCodeCountdown";
import Tab from "@mui/material/Tab";
import { toast } from "react-toastify";
import { event } from "@tauri-apps/api";
const OS = getSystem();

const reg = /^1[3-9]\d{9}$/;
const emailReg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;

const prefix = "@phone.com";

const Login = ({ setToken }: any) => {
  const { post, loading, response } = useFetch("/api/v1/passport/auth/login");
  const { post: register, loading: registerLoading } = useFetch(
    "api/v1/passport/auth/register"
  );

  // http://localhost:8083/api/clickPass/sendSms?phone=18301742267
  // 手机号发送验证码

  const { post: sendSms, loading: smsLoaidng } = useFetch(
    "/apiv2/clickPass/sendSms",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const { post: phoneLogin, loading: phoneLoading } = useFetch(
    "/apiv2/clickPass/phoneLogin",
    // "http://192.168.120.30:8083/api/clickPass/phoneLogin",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const { post: sendMail, loading: sendMailLoading } = useFetch(
    "/apiv2/clickPass/sendEmail",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const { post: emailRegister, loading: emailRegisterLoading } = useFetch(
    "/apiv2/clickPass/emailRegister",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const { post: emailLogin, loading: emailLoginLoading } = useFetch(
    "/apiv2/clickPass/emailLogin",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const { post: forgetPwdToEmailCode, loading: forgetPwdLoading } = useFetch(
    "/apiv2/clickPass/forgetPwdToEmailCode",
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const [selectedValue, setSelected] = useState("1");

  const [registerForm, setRegisterForm] = useState({
    email: "",
    code: "",
    password: "",
  });

  const [forgetForm, setfForgetForm] = useState({
    email: "",
    code: "",
    password: "",
  });

  const [emailLoginForm, setEmailLoginForm] = useState({
    email: "",
    password: "",
  });
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  //   redPassword: "",
  // });
  //   http://localhost:8083/api/clickPass/phoneLogin?phone=18301742267&smsCode=6128
  // 手机号登录

  const [phoneForm, setPhoneForm] = useState({
    phone: "",
    smsCode: "",
  });

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    if (emailReg.test(emailLoginForm.email) && emailLoginForm.password.trim()) {
      const params = new FormData();
      params.append("email", emailLoginForm.email);
      params.append("password", emailLoginForm.password);
      const res = await emailLogin(params);

      switch (res.errorCode) {
        case 0: {
          setToken(res.loginData.data.auth_data);
          toast.success("登录成功！");
          break;
        }
        case 1: {
          toast.warn("账号或密码错误！");
          break;
        }
        default: {
          return false;
        }
      }
      // if (res.errorCode === 0) {

      // }else{
      //   // toast.warn()
      // }
    }
  };

  const handlePhoneLogin = async () => {
    if (reg.test(phoneForm.phone)) {
      const formData = new FormData();
      formData.append("phone", phoneForm.phone);
      formData.append("smsCode", phoneForm.smsCode);
      formData.append("isOldUser", "false");
      const res = await phoneLogin(formData);
      // console.log(res, 'res')
      if (res.errorCode === 0) {
        setToken(res.loginData.data.auth_data);
      } else if (res.errorCode === 404) {
        return toast.warn("您还未发送验证码", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.warn("验证码错误", {
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
      // console.log(res, 'phoneRes')
      // .

      // then(res => {
      //   console.log(res, 'res')
      // })
    }
  };
  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();

    const parmas = new FormData();

    parmas.append("email", registerForm.email);
    parmas.append("code", registerForm.code);
    parmas.append("password", registerForm.password);

    if (registerForm.email && registerForm.code && registerForm.password) {
      emailRegister(parmas).then((res) => {
        switch (res.errorCode) {
          case 0: {
            toast.success("注册成功！请返回登录使用！");
            setSelected("1");
            setEmailLoginForm({
              email: registerForm.email,
              password: registerForm.password,
            });
            break;
          }
          case 1: {
            toast.warn("注册账号已存在！");
            break;
          }
          case 2: {
            toast.warn("未知异常");
            break;
          }
          case 3: {
            toast.warn("邮箱验证码错误");
            break;
          }
          default: {
            return false;
          }
        }
      });
    }
  };

  const handleSubmitByForget = async (e: any) => {
    e.preventDefault();

    const parmas = new FormData();

    parmas.append("email", forgetForm.email);
    parmas.append("code", forgetForm.code);
    parmas.append("password", forgetForm.password);

    if (forgetForm.email && forgetForm.code && forgetForm.password) {
      forgetPwdToEmailCode(parmas).then((res) => {
        if (res.status === 500) {
          return toast.warn(res?.message);
        } else if (res.status === 200) {
          toast.success("密码找回成功！请返回登录使用！");
          setSelected("1");
          setEmailLoginForm({
            email: forgetForm.email,
            password: forgetForm.password,
          });
        } else {
          toast.success("系统异常！");
        }
        // switch (res.errorCode) {

        //   case 0: {
        //     toast.success("密码找回成功！请返回登录使用！")
        //     setSelected('1');
        //     setEmailLoginForm({
        //       email: forgetForm.email,
        //       password: forgetForm.password,
        //     })
        //     break
        //   }
        //   case 1: {
        //     toast.warn("注册账号已存在！")
        //     break;
        //   }
        //   case 2: {
        //     toast.warn("未知异常")
        //     break
        //   }
        //   case 3: {
        //     toast.warn("邮箱验证码错误")
        //     break;
        //   }
        //   default: {
        //     return false
        //   }
        // }
      });
    }
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setRegisterForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const hadnlePhoneChange = (event: any) => {
    const { name, value } = event.target;
    setPhoneForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginChange = (event: any) => {
    const { name, value } = event.target;
    setEmailLoginForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const hadnleForgetChange = (event: any) => {
    const { name, value } = event.target;
    setfForgetForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [{ disabled, formatText }, run]: any = useSmsCodeCountdown({});

  const onClickHandle = () => {
    if (reg.test(phoneForm.phone)) {
      if (disabled) {
        return false;
      } else {
        const smsFormData = new FormData();
        smsFormData.append("phone", phoneForm.phone);
        smsFormData.append("tag", "baidu");
        sendSms(smsFormData).then((res) => {
          // 修复倒计时逻辑：检查响应状态而不是data内容
          if (res && (res.data === "pending" || res.data?.includes("成功") || res.status === 200)) {
            run?.(60);
            toast.success("验证码发送成功！请注意查收。");
          } else {
            toast.warn("发送失败，请稍后重试", {
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
        }).catch((err) => {
          toast.warn("发送失败，请稍后重试", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
      }
    } else {
      toast.warn("请输入正确的手机号码", {
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

  //   发送验证码：http://localhost:8083/api/clickPass/sendEmail?email=363740086@qq.com&tag=register
  // 注册：tag=register
  // 忘记密码：tag=forget

  const [{ disabled: mailDisabled, formatText: mailText }, mailRun]: any =
    useSmsCodeCountdown({});
  const sendEmail = async (tag = "register") => {
    if (!mailDisabled) {
      if (emailReg.test(registerForm.email)) {
        const params = new FormData();
        params.append("email", registerForm.email);
        params.append("tag", tag);
        const res = await sendMail(params);

        if (res.status === 200) {
          toast.success(res.data, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          mailRun?.(60);
        } else {
          toast.warn(res.message, {
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
      } else {
        toast.warn("请输入正确的邮箱", {
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
    }

    // Register
    //  post: sendMail, loading: sendMailLoading,
    // alert(1)
  };
  const [{ disabled: forgetDisabled, formatText: forgetText }, frogetRun]: any =
    useSmsCodeCountdown({});
  const hadnleSendMailByForget = async () => {
    if (forgetDisabled) {
      return;
    }
    if (emailReg.test(forgetForm.email)) {
      const params = new FormData();
      params.append("email", forgetForm.email);
      params.append("tag", "forget");
      const res = await sendMail(params);

      if (res.status === 200) {
        toast.success(res.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        frogetRun?.(60);
      } else {
        toast.warn(res.message, {
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
    } else {
      toast.warn("请输入正确的邮箱", {
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

  // useEffect(() => {

  //   if (smsNumber == 0) {
  //     clearInterval(timer);
  //     setSmsNumber(61);
  //   }

  // }, [smsNumber])

  return (
    <PageLogin
      square
      elevation={0}
      className={`${OS} Login`}
      onPointerDown={(e: any) => {
        if (e.target?.dataset?.windrag) appWindow.startDragging();
      }}
      onContextMenu={(e) => {
        // only prevent it on Windows
        e.preventDefault();
        // if (OS === "windows") e.preventDefault();
      }}
    >
      <div className="Login__left" data-windrag>
        <div className="the-logo" data-windrag></div>
        {/* <div className="the-name">快连VPN</div> */}
      </div>
      <Container
        style={{
          height: "calc(100% - 50px)",
          display: "flex",
          justifyContent: "center",
        }}
        maxWidth="sm"
      >
        <Container
          style={{
            marginTop: 100,
          }}
          maxWidth="sm"
        >
          <LoginContainer>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="手机号" value="1" />
                  <Tab label="邮箱" value="2" />
                  {/* <Tab label="旧版登陆" value="3" /> */}
                </TabList>
              </Box>
              <TabPanel value="1">
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      name="phone"
                      label="手机号"
                      value={phoneForm.phone}
                      onChange={hadnlePhoneChange}
                    />
                    <Grid container spacing={0}>
                      <Grid item xs={7} padding={0}>
                        <TextField
                          fullWidth
                          name="smsCode"
                          label="验证码"
                          value={phoneForm.smsCode}
                          onChange={hadnlePhoneChange}
                        />

                        {/* <Item>xs=8</Item> */}
                      </Grid>
                      <StyledGrid item padding={0} xs={5}>
                        <LoadingButton
                          sx={{
                            // bgcolor: 'background.paper',
                            // boxShadow: 1,
                            // borderRadius: 2,
                            // p: 2,
                            width: "90%!important",
                          }}
                          type="submit"
                          color="success"
                          size="large"
                          variant="contained"
                          disableElevation
                          onClick={onClickHandle}
                          loading={smsLoaidng}
                        >
                          {formatText}
                        </LoadingButton>
                      </StyledGrid>
                    </Grid>

                    <LoadingButton
                      fullWidth
                      type="submit"
                      color="warning"
                      size="large"
                      variant="contained"
                      disableElevation
                      loading={phoneLoading}
                      onClick={handlePhoneLogin}
                    >
                      登录
                    </LoadingButton>

                    <Typography textAlign={"center"} component="span">
                      未注册的手机号验证成功后将自动注册
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2 }}
                  >
                    <Link variant="subtitle2" underline="hover"></Link>
                  </Stack>
                </CardContent>
              </TabPanel>
              <TabPanel value="2">
                {selectedValue === "1" ? (
                  <>
                    <CardHeader
                      title="登录"
                      subheader={
                        <Typography component="span">
                          还没有账号？
                          <Link
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSelected("2");
                            }}
                            color="rgb(158, 119, 237)"
                            underline="hover"
                          >
                            立即注册
                          </Link>
                        </Typography>
                      }
                    ></CardHeader>
                    <form onSubmit={handleEmailLogin}>
                      <CardContent>
                        <Stack spacing={3}>
                          <TextField
                            name="email"
                            label="邮箱"
                            value={emailLoginForm.email}
                            onChange={handleLoginChange}
                          />

                          <TextField
                            name="password"
                            label="密码"
                            type="password"
                            value={emailLoginForm.password}
                            onChange={handleLoginChange}
                          />

                          <LoadingButton
                            fullWidth
                            type="submit"
                            color="warning"
                            size="large"
                            variant="contained"
                            disableElevation
                            loading={emailLoginLoading}
                            // loadingIndicator="登录中"
                          >
                            登录
                          </LoadingButton>

                          <Link
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelected("3")}
                          >
                            忘记密码
                          </Link>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ my: 2 }}
                        >
                          <Link variant="subtitle2" underline="hover"></Link>
                        </Stack>
                      </CardContent>
                    </form>
                  </>
                ) : selectedValue === "2" ? (
                  <>
                    <CardHeader
                      title="注册账户"
                      subheader={
                        <Typography component="span">
                          已经拥有账号？
                          <Link
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSelected("1");
                            }}
                            color="rgb(158, 119, 237)"
                            underline="hover"
                          >
                            去登录使用，
                          </Link>
                          <Typography component="p">
                            提示：（如未收到，请检查垃圾箱）
                          </Typography>
                        </Typography>
                      }
                    ></CardHeader>
                    <form onSubmit={handleRegisterSubmit}>
                      <CardContent>
                        <Stack spacing={3}>
                          <TextField
                            name="email"
                            label="邮箱"
                            value={registerForm.email}
                            onChange={handleInputChange}
                          />
                          <Grid container spacing={0}>
                            <Grid item xs={7} padding={0}>
                              <TextField
                                fullWidth
                                name="code"
                                label="邮箱验证码"
                                value={registerForm.code}
                                onChange={handleInputChange}
                              />

                              {/* <Item>xs=8</Item> */}
                            </Grid>
                            <StyledGrid item padding={0} xs={5}>
                              <LoadingButton
                                sx={{
                                  // bgcolor: 'background.paper',
                                  // boxShadow: 1,
                                  // borderRadius: 2,
                                  // p: 2,
                                  width: "90%!important",
                                }}
                                color="success"
                                size="large"
                                variant="contained"
                                disableElevation
                                //  , formatText: mailText
                                onClick={() => {
                                  sendEmail("register");
                                }}
                                loading={sendMailLoading}
                              >
                                {mailText}
                              </LoadingButton>
                            </StyledGrid>
                          </Grid>

                          <TextField
                            name="password"
                            label="密码（最少8位）"
                            type="password"
                            value={registerForm.password}
                            onChange={handleInputChange}
                          />
                          <LoadingButton
                            fullWidth
                            type="submit"
                            color="info"
                            size="large"
                            variant="contained"
                            disableElevation
                            loading={emailRegisterLoading}
                          >
                            注册
                          </LoadingButton>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ my: 2 }}
                        >
                          <Link
                            style={{
                              cursor: "pointer",
                            }}
                            variant="subtitle2"
                            underline="hover"
                          ></Link>
                        </Stack>
                      </CardContent>
                    </form>
                  </>
                ) : (
                  <>
                    <CardHeader
                      title="找回密码"
                      subheader={
                        <Typography component="span">
                          已找回密码？
                          <Link
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSelected("1");
                            }}
                            color="rgb(158, 119, 237)"
                            underline="hover"
                          >
                            去登录使用，
                          </Link>
                          <Typography component="p">
                            提示：（如未收到，请检查垃圾箱）
                          </Typography>
                        </Typography>
                      }
                    ></CardHeader>
                    <form onSubmit={handleSubmitByForget}>
                      <CardContent>
                        <Stack spacing={3}>
                          <TextField
                            name="email"
                            label="邮箱"
                            value={forgetForm.email}
                            onChange={hadnleForgetChange}
                          />
                          <Grid container spacing={0}>
                            <Grid item xs={7} padding={0}>
                              <TextField
                                fullWidth
                                name="code"
                                label="邮箱验证码"
                                value={forgetForm.code}
                                onChange={hadnleForgetChange}
                              />

                              {/* <Item>xs=8</Item> */}
                            </Grid>
                            <StyledGrid item padding={0} xs={5}>
                              <LoadingButton
                                sx={{
                                  // bgcolor: 'background.paper',
                                  // boxShadow: 1,
                                  // borderRadius: 2,
                                  // p: 2,
                                  width: "90%!important",
                                }}
                                color="success"
                                size="large"
                                variant="contained"
                                disableElevation
                                //  , formatText: mailText
                                onClick={hadnleSendMailByForget}
                                loading={sendMailLoading}
                              >
                                {forgetText}
                              </LoadingButton>
                            </StyledGrid>
                          </Grid>

                          <TextField
                            name="password"
                            label="新密码（最少8位）"
                            type="password"
                            value={forgetForm.password}
                            onChange={hadnleForgetChange}
                          />
                          <LoadingButton
                            fullWidth
                            type="submit"
                            color="info"
                            size="large"
                            variant="contained"
                            disableElevation
                            loading={forgetPwdLoading}
                          >
                            重置密码
                          </LoadingButton>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ my: 2 }}
                        >
                          <Link
                            style={{
                              cursor: "pointer",
                            }}
                            variant="subtitle2"
                            underline="hover"
                          ></Link>
                        </Stack>
                      </CardContent>
                    </form>
                  </>
                )}
              </TabPanel>
            </TabContext>
          </LoginContainer>

          {/* 
          <TabContext value={selectedValue}>
            <Zoom in={selectedValue === "1"}>
              <TabPanel value="1">
                <LoginCard>
                  <CardHeader
                    title="登录"
                    subheader={
                      <Typography component="span">
                        还没有账号？
                        <Link
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFormData({
                              email: "",
                              password: "",
                              redPassword: "",
                            });
                            setSelected("2");
                          }}
                          color="rgb(158, 119, 237)"
                          underline="hover"
                        >
                          立即注册
                        </Link>
                      </Typography>
                    }
                  ></CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <Stack spacing={3}>
                        <TextField

                          name="email"
                          label="手机号或邮箱"
                          value={formData.email}
                          onChange={handleInputChange}
                        />

                        <TextField
                          name="password"
                          label="密码"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}

                        />

                        <LoadingButton
                          fullWidth
                          type="submit"
                          color="warning"
                          size="large"
                          variant="contained"
                          disableElevation
                          loading={loading}
                        // loadingIndicator="登录中"
                        >
                          登录
                        </LoadingButton>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ my: 2 }}
                      >
                        <Link variant="subtitle2" underline="hover">
                        </Link>
                      </Stack>
                    </CardContent>
                  </form>
                </LoginCard>
              </TabPanel>
            </Zoom>
            <TabPanel value="2">
              <Zoom in={selectedValue === "2"}>
                <LoginCard>
                  <CardHeader
                    title="注册账户"
                    subheader={
                      <Typography component="span">
                        已经拥有账号？
                        <Link
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelected("1");
                          }}
                          color="rgb(158, 119, 237)"
                          underline="hover"
                        >
                          去登录使用
                        </Link>
                      </Typography>
                    }
                  ></CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <Stack spacing={3}>
                        <TextField
                          name="email"
                          label="手机号或邮箱"
                          value={formData.email}
                          onChange={handleInputChange}
                        />

                        <TextField
                          name="password"
                          label="密码"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />

                        <TextField
                          name="redPassword"
                          label="确认密码"
                          type="password"
                          value={formData.redPassword}
                          onChange={handleInputChange}
                        />

                        <LoadingButton
                          fullWidth
                          type="submit"
                          color="info"
                          size="large"
                          variant="contained"
                          disableElevation
                          loading={registerLoading}
                        >
                          注册
                        </LoadingButton>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ my: 2 }}
                      >
                        <Link
                          style={{
                            cursor: "pointer",
                          }}
                          variant="subtitle2"
                          underline="hover"
                        >

                        </Link>

                      </Stack>
                    </CardContent>
                  </form>
                </LoginCard>
              </Zoom>
            </TabPanel>
          </TabContext> */}
        </Container>
      </Container>
    </PageLogin>
  );
};

export default Login;

const PageLogin = styled(Paper)(({ theme: { palette, typography } }) => ({
  width: "100vw",
  height: "100vh",
  //   background: "rgba(16, 18, 27, 0.4) !important",
  backdropFilter: "blur(20px)",
  boxSizing: "border-box",
  backgroundImage: `url(${bgSvg})`,
  backgroundColor: "rgb(11, 15, 25)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: " center top",
  //   background-image: url(/assets/gradient-bg.svg);
  display: "flex",
  flex: " 1 1 auto",
  flexDirection: "column",

  "& .Login__left": {
    padding: "20px 100px",
    paddingBottom: "0px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  "& .the-logo": {
    width: "30px",
    height: "30px",
    backgroundSize: "100%",
    borderRadius: "5px",
    // marginTop: "100px",
  },
  "& .the-name": {
    marginLeft: "10px",
    color: "rgb(237, 242, 247)",
    fontSize: "14px",
    fontWeight: "800",
  },
  //   borderRadius: "10px",
  //   border: " 1px solid #C75DEB",
  //   backgroundColor: "#3a3375",
  //   padding: "4px 0px",
  //   width: "80px",
  //   textAlign: "center",
}));

const LoginCard = styled(Card)(({ theme: { palette, typography } }) => ({
  // backgroundColor: "#111927",
  // borderRadius: "20px",
  // padding: "15px 20px",
  // color: "#fff",
}));

const LoginContainer = styled(Card)(({ theme: { palette, typography } }) => ({
  backgroundColor: "#111927",
  borderRadius: "20px",
  padding: "15px 20px",
  color: "#fff",
}));

const StyledGrid = styled(Grid)(({ theme: { palette, typography } }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiLoadingButton-root": {
    width: "130px",
    height: "40px",
  },
}));
