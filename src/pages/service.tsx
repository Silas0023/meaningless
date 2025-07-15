import useFetch, { CachePolicies, Provider } from "use-http";
import Layout from "./_layout";
import { useLocalStorageState } from "ahooks";
import Login from "./login";
import useCustomTheme from "@/components/layout/use-custom-theme";
import { alpha, List, Paper, ThemeProvider } from "@mui/material";
import { SWRConfig, mutate } from "swr";
import { ToastContainer, toast } from "react-toastify";
import { useMemo } from "react";

const ServicePage = () => {
  const { theme } = useCustomTheme();
  const [token, setToken] = useLocalStorageState<string | undefined>(
    "Authorization"
  );
  const options = useMemo(() => {
    return {
      // suspense: true,

      interceptors: {
        // every time we make an http request, this will run 1st before the request is made
        // url, path and route are supplied to the interceptor
        // request options can be modified and must be returned
        request: async ({ options, url, path, route }: any) => {
          // console.log(options, url, path, route, " options, url, path, route");
          // console.log(token, "token");
          // if (isExpired(token)) {
          //   token = await getNewToken()
          //   setToken(token)
          // }
          options.headers.Authorization = token;
          return options;
        },
        // every time we make an http request, before getting the response back, this will run
        response: async ({ response }: any) => {
          const res = response;

          if (res.ok) {
            const data = res?.url?.includes("apiv2")
              ? {
                  data: res.data,
                }
              : res.data;
            return data;
          } else if (res.status === 500) {
            // const [errorMsg]: any = Object.values(res.data.errors);
            const message = res.data.message;

            toast.error(message.replace("邮箱", "账号"), {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            throw Promise.reject(res.data);
          } else if (res.status === 403) {
            setToken("");
          } else {
            const [errorMsg]: any = Object.values(res.data.errors);
            const message = res.data.errors
              ? errorMsg.join("")
              : res.data.message;

            toast.error(message, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            return Promise.reject(res);
          }

          // if (res.data) res.data = toCamel(res.data)
        },
      },
      // cachePolicy: "no-cache",
    };
  }, [token]);

  // error
  return (
    <SWRConfig value={{ errorRetryCount: 3 }}>
      <ThemeProvider theme={theme}>
        <Provider url="https://aa18.de/" options={options}>
          {token ? <Layout /> : <Login setToken={setToken} />}
          <ToastContainer />
        </Provider>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default ServicePage;
