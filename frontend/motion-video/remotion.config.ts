import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

// 렌더링 서버에서 Chrome 자동 다운로드가 막혀 있으면 경로를 환경변수로 지정한다.
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}
