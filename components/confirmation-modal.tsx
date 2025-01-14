import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { AppButton } from './AppButton';
type ModalProps = {
  title: string;
  description: string;
  open: boolean;
  trigger: (cb?: () => void) => React.ReactNode;
  onOpen?: () => void;
  onClose: () => void;
  onAccept: () => void;
}
export function ConfirmationModal({ title, description, trigger, open, onOpen, onClose, onAccept }: ModalProps) {
  return <Dialog
    open={open}

    onOpenChange={open => {
      if (!open) onClose();
    }}
  >
    <DialogTrigger asChild>
      {trigger(onOpen)}
    </DialogTrigger>
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <AppButton onPress={onAccept} size="sm" variant="primary">OK</AppButton>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}