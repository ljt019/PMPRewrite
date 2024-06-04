import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteMovieDialogContentProps {
  folderName: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export function DeleteMovieDialogContent({
  folderName,
  onClose,
  onDeleteSuccess,
}: DeleteMovieDialogContentProps) {
  const deleteMovie = async () => {
    const result = await window.electronAPI.deleteMovieFolder(folderName);
    if (result.success) {
      console.log(`Movie folder deleted: ${folderName}`);
      onDeleteSuccess();
    } else {
      alert(`Failed to delete movie folder: ${folderName}`);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            movie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteMovie}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
