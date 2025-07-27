import { useEffect, useState } from "react";
import * as zebar from "zebar";
import { Center } from "./components/Center";
import { Chip } from "./components/common/Chip";
import Media from "./components/media";
import Stat from "./components/stat";
import { TilingControl } from "./components/TilingControl";
import VolumeControl from "./components/volume";
import { WindowTitle } from "./components/windowTitle/WindowTitle";
import { WorkspaceControls } from "./components/WorkspaceControls";
import "./styles/fonts.css";
import { useAutoTiling } from "./utils/useAutoTiling";
import { useConfig } from "./context/ConfigContext";

const providers = zebar.createProviderGroup({
  media: { type: "media" },
  network: { type: "network" },
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  date: { type: "date", formatting: "EEEE dd MMMM tt", locale: "en-GB" },
  memory: { type: "memory" },
  weather: { type: "weather" },
  audio: { type: "audio" },
  systray: { type: "systray" },
});

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  const { offsetX } = useConfig();

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  useAutoTiling();

  const statIconClassnames = "h-3 w-3 text-icon";

  return (
    <div
    className="relative flex justify-between items-center bg-background/80 border border-button-border/80 backdrop-blur-3xl text-text h-full antialiased select-none rounded-lg font-mono py-1.5"
    style={{ width: `calc(100% - ${Number(offsetX) * 2}px)` }}
    >
      <div className="flex items-center gap-2 h-full z-10 pl-2">
        <div className="flex items-center gap-2 h-full">
          <WorkspaceControls glazewm={output.glazewm} />
        </div>

        <div className="h-full flex items-center px-0.5 pr-1">
          <TilingControl glazewm={output.glazewm} />
        </div>

        <div className="h-full flex items-center justify-center">
          <WindowTitle glazewm={output.glazewm} />
        </div>
      </div>

      <div className="absolute w-full h-full flex items-center justify-center left-0">
        <Center>
          {output?.date?.formatted ?? ""}
        </Center>
      </div>

      <div className="flex gap-2 items-center h-full z-10 pr-2">
        <div className="flex items-center h-full">
          <Chip
            className="flex items-center gap-3 h-full"
            as="button"
            onClick={() => {
              output.glazewm?.runCommand("shell-exec taskmgr");
            }}
          >
            {output.cpu && (
              <Stat
                Icon={<p className="font-medium text-icon">CPU</p>}
                stat={`${Math.round(output.cpu.usage)}%`}
                type="inline"
              />
            )}

            {output.memory && (
              <Stat
                Icon={<p className="font-medium text-icon">RAM</p>}
                stat={`${Math.round(output.memory.usage)}%`}
                type="inline"
              />
            )}
          </Chip>
        </div>

        <div className="flex items-center h-full">
          <VolumeControl
            playbackDevice={output.audio?.defaultPlaybackDevice}
            setVolume={output.audio?.setVolume}
            statIconClassnames={statIconClassnames}
          />
        </div>

        <div className="flex items-center justify-center gap-3 h-full">
          <Media media={output.media} />
        </div>
      </div>
    </div>
  );
}

export default App;
