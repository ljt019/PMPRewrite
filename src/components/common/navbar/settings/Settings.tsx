import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { SettingsForm } from "./SettingsForm";

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
      <DialogContent className="w-[44rem] max-w-4xl">
        <SettingsForm onOpenChange={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
