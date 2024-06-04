import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        className="hover:text-foreground text-muted-foreground"
        variant="ghostNoHover"
        onClick={() => setIsOpen(true)}
      >
        <Settings />
      </Button>
      <SettingsDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

function SettingsDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <SettingsForm />
      </DialogContent>
    </Dialog>
  );
}

function SettingsForm() {
  return <div>"This is a form"</div>;
}

/* 
Settings I Want

- Change the music playing
- Change the idle image
- Change duration of idle image timeout
- Change duration of audio timeout

? Possible
- Change the endpoints for the lightsOn/lightsOff
- Change the theme (not a priority)

*/
