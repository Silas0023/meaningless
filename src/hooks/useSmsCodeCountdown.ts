import { useState } from "react";

/**
 * 短信验证码倒计时钩子
 * @param formatter: function|undefined
 */
const useSmsCodeCountdown = (opt: any) => {
  const { formatter } = opt || {};

  // 倒计时值
  const [countdown, setCountdown] = useState(0);
  // 倒计时的实例
  const [timer, setTimer] = useState<any>(null);

  // 默认的格式化文本
  const defaultFormatter = (num: any) => {
    if (num) return `重新获取(${num}s)`;
    return "获取验证码";
  };

  // 运行方法
  const runHandle = (num: any) => {
    // 设置倒计时值
    setCountdown(num);
    // 清除倒计时的实例
    clearTimeout(timer);
    if (num > 0) setTimer(setTimeout(() => runHandle(num - 1), 1000));
  };

  const formatText =
    typeof formatter === "function"
      ? formatter(countdown)
      : defaultFormatter(countdown);
  return [{ countdown, disabled: countdown > 0, formatText }, runHandle];
};

export default useSmsCodeCountdown;
