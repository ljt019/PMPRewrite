import { useState, useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        timeoutId = setTimeout(() => setIsPlaying(true), 600000);
      }
    }

    // Clear the timeout when the component unmounts or when isPlaying changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPlaying]);

  const togglePlayback = () => setIsPlaying(!isPlaying);

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src="/assets/backgroundAudio.mp3" type="audio/mpeg" />
      </audio>
      <div className="flex items-center space-x-2">
        <Switch
          id="audio"
          checked={isPlaying}
          onCheckedChange={() => {
            togglePlayback();
          }}
        />
        <Label htmlFor="audio">{isPlaying ? <Volume2 /> : <VolumeX />}</Label>
      </div>
    </div>
  );
}

export default AudioPlayer;
