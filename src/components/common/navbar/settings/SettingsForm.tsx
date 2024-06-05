import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import type { Settings } from "@/types/settings";

const formSchema = z.object({
  AudioTimeout: z.string().min(1),
  IdleTimeout: z.string().min(1),
  LightsOnEndpoint: z.string().min(2).max(50),
  LightsOffEndpoint: z.string().min(2).max(50),
  IdleImage: z
    .instanceof(FileList)
    .refine(
      (fileList) =>
        Array.from(fileList).every((file) => file.type === "image/png"),
      "The idle image file must be of type png"
    ),
  BackgroundMusic: z
    .instanceof(FileList)
    .refine(
      (fileList) =>
        Array.from(fileList).every((file) => file.type === "audio/mpeg"),
      "The music file must be of type MP3"
    ),
});

export function SettingsForm({
  onOpenChange,
}: {
  onOpenChange: (value: boolean) => void;
}) {
  const { settings, updateSettings } = useSettings();

  const parseTimeout = (timeout: string) => {
    const [minute, second] = timeout.split(":");
    return { minute, second };
  };

  const initialAudioTimeout = settings?.AudioTimeout
    ? parseTimeout(settings.AudioTimeout)
    : { minute: "", second: "" };
  const initialIdleTimeout = settings?.IdleTimeout
    ? parseTimeout(settings.IdleTimeout)
    : { minute: "", second: "" };

  const [audioTimeout, setAudioTimeout] = useState(initialAudioTimeout);
  const [idleTimeout, setIdleTimeout] = useState(initialIdleTimeout);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      AudioTimeout: settings?.AudioTimeout || "",
      IdleTimeout: settings?.IdleTimeout || "",
      LightsOnEndpoint: settings?.LightsOnEndpoint || "",
      LightsOffEndpoint: settings?.LightsOffEndpoint || "",
      IdleImage: undefined,
      BackgroundMusic: undefined,
    },
  });

  useEffect(() => {
    if (audioTimeout.minute && audioTimeout.second) {
      form.setValue(
        "AudioTimeout",
        `${audioTimeout.minute}:${audioTimeout.second}`
      );
    }
  }, [audioTimeout, form]);

  useEffect(() => {
    if (idleTimeout.minute && idleTimeout.second) {
      form.setValue(
        "IdleTimeout",
        `${idleTimeout.minute}:${idleTimeout.second}`
      );
    }
  }, [idleTimeout, form]);

  const IdleImageFileRef = form.register("IdleImage");
  const BackgroundMusicFileRef = form.register("BackgroundMusic");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      AudioTimeout,
      IdleTimeout,
      LightsOnEndpoint,
      LightsOffEndpoint,
      IdleImage,
      BackgroundMusic,
    } = values;

    const IdleImageFilePath = IdleImage?.[0]?.path;
    const BackgroundMusicFilePath = BackgroundMusic?.[0]?.path;

    const data: Settings = {
      AudioTimeout,
      IdleTimeout,
      LightsOnEndpoint,
      LightsOffEndpoint,
    };

    if (IdleImageFilePath) {
      await window.electronAPI.changeIdleImage(IdleImageFilePath);
    }

    if (BackgroundMusicFilePath) {
      await window.electronAPI.changeBackgroundAudio(BackgroundMusicFilePath);
    }

    console.log(data);
    updateSettings(data);
    onOpenChange(false);
  }

  function handleMinuteChange(
    event: React.ChangeEvent<HTMLInputElement>,
    field: "AudioTimeout" | "IdleTimeout"
  ) {
    const { value } = event.target;
    if (/^[0-5]?[0-9]?$/.test(value)) {
      if (field === "AudioTimeout") {
        setAudioTimeout((prev) => ({ ...prev, minute: value }));
      } else {
        setIdleTimeout((prev) => ({ ...prev, minute: value }));
      }
    }
  }

  function handleSecondChange(
    event: React.ChangeEvent<HTMLInputElement>,
    field: "AudioTimeout" | "IdleTimeout"
  ) {
    const { value } = event.target;
    if (/^[0-5]?[0-9]?$/.test(value)) {
      if (field === "AudioTimeout") {
        setAudioTimeout((prev) => ({ ...prev, second: value }));
      } else {
        setIdleTimeout((prev) => ({ ...prev, second: value }));
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex space-x-[11.6rem]">
          {/* Audio Timeout */}
          <FormField
            control={form.control}
            name="AudioTimeout"
            render={() => (
              <FormItem>
                <FormLabel>Audio Timeout</FormLabel>
                <FormDescription>Length of Mute Timeout</FormDescription>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    <Input
                      type="text"
                      placeholder="MM"
                      value={audioTimeout.minute}
                      onChange={(e) => handleMinuteChange(e, "AudioTimeout")}
                      className="w-[2.6rem] h-[2rem]"
                    />
                    <span>:</span>
                    <Input
                      type="text"
                      placeholder="SS"
                      value={audioTimeout.second}
                      onChange={(e) => handleSecondChange(e, "AudioTimeout")}
                      className="w-[2.6rem] h-[2rem]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Idle Timeout */}
          <FormField
            control={form.control}
            name="IdleTimeout"
            render={() => (
              <FormItem>
                <FormLabel>Idle Timeout</FormLabel>
                <FormDescription>Length of Idle Timeout.</FormDescription>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    <Input
                      type="text"
                      placeholder="MM"
                      value={idleTimeout.minute}
                      onChange={(e) => handleMinuteChange(e, "IdleTimeout")}
                      className="w-[2.6rem] h-[2rem]"
                    />
                    <span>:</span>
                    <Input
                      type="text"
                      placeholder="SS"
                      value={idleTimeout.second}
                      onChange={(e) => handleSecondChange(e, "IdleTimeout")}
                      className="w-[2.6rem] h-[2rem]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4">
          {/* Lights On Endpoint */}
          <FormField
            control={form.control}
            name="LightsOnEndpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lights On Endpoint</FormLabel>
                <FormDescription>
                  Endpoint used to turn on the lights.
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="http://192.168.1.199:8080/walkInOn"
                    className="w-[20rem]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lights Off Endpoint */}
          <FormField
            control={form.control}
            name="LightsOffEndpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lights Off Endpoint</FormLabel>
                <FormDescription>
                  Endpoint used to turn off the lights.
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="http://192.168.1.199:8080/walkInOff"
                    className="w-[20rem]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4">
          {/* Idle Image */}
          <FormField
            control={form.control}
            name="IdleImage"
            render={() => (
              <FormItem>
                <FormLabel>Idle Image File</FormLabel>
                <FormControl>
                  <Input
                    className="text-gray-500 w-[20rem]"
                    type="file"
                    placeholder="Lucien"
                    {...IdleImageFileRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Background Music */}
          <FormField
            control={form.control}
            name="BackgroundMusic"
            render={() => (
              <FormItem>
                <FormLabel>Background Music File</FormLabel>
                <FormControl>
                  <Input
                    className="text-gray-500 w-[20rem]"
                    type="file"
                    placeholder="Lucien"
                    {...BackgroundMusicFileRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="w-1/2 rounded-[0.5rem]">
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
}
