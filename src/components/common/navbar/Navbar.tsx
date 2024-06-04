import AudioPlayer from "@/components/common/BackgroundAudioPlayer";
import { LinkButton } from "@/components/common/navbar/LinkButton";
import { SettingsButton } from "@/components/common/navbar/Settings";

export default function Navbar() {
  return (
    <>
      <div className="grid grid-cols-3 mt-2">
        <div>
          <SettingsButton />
        </div>
        <div className="flex justify-center">
          <LinkButton route="/" name="Play Movies" />
          <LinkButton route="/scheduleMovies" name="Schedule Movies" />
          <LinkButton route="/manageMovies" name="Manage Movies" />
        </div>
        <div className="flex justify-end pt-2 pr-3">
          <AudioPlayer />
        </div>
      </div>
    </>
  );
}
