import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormDialogProps {
  title: string;
  Icon: React.ReactNode;
  Form: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function FormDialog({
  title,
  Icon,
  Form,
  isOpen,
  setIsOpen,
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        {Icon}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {Form}
      </DialogContent>
    </Dialog>
  );
}
