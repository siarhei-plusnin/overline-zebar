import { useEffect, useState } from "react";
import * as zebar from "zebar";
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
      className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 items-center bg-background/80 border border-button-border/80 backdrop-blur-3xl text-text h-full antialiased select-none rounded-lg font-mono py-1.5"
      style={{ width: `calc(100% - ${Number(offsetX) * 2}px)` }}
    >
      <div className="flex min-w-0 items-center gap-2 h-full z-10 pl-2">
        <div className="h-full shrink-0">
          <WorkspaceControls glazewm={output.glazewm} />
        </div>

        <div className="h-full shrink-0 px-0.5 pr-1">
          <TilingControl glazewm={output.glazewm} />
        </div>

        <WindowTitle glazewm={output.glazewm} />
      </div>

      <div className="h-full flex justify-center items-center whitespace-nowrap transition-all ease-in-out">
        {output?.date?.formatted ?? ""}
      </div>

      <div className="flex justify-self-end gap-2 h-full z-10 pr-2">
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
              stat={
                `${(output.memory.usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB`
                + ` / `
                + `${(output.memory.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`
              }
              type="inline"
            />
          )}
        </Chip>

        <VolumeControl
          playbackDevice={output.audio?.defaultPlaybackDevice}
          setVolume={output.audio?.setVolume}
          statIconClassnames={statIconClassnames}
        />

        <Media media={output.media} />
      </div>
    </div>
  );
}

export default App;
