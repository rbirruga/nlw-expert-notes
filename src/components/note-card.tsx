import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ptBR } from "date-fns/locale";

import { X } from "lucide-react";

interface NoteCardProps {
    note: {
        id: string
        date: Date
        content: string
    }
    onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted } : NoteCardProps) {
    return(
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md text-left flex flex-col bg-neutral-900 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-neutral-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-neutral-200 '>
                    {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
                </span>
                <p className='text-sm leading-6 text-neutral-400'>
                    {note.content}
                </p>

                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-black/0 pointer-events-none' />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.DialogOverlay className="inset-0 fixed bg-black/50"/>
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-neutral-800 md:rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-neutral-900 p-1.5 text-neutral-400 hover:text-neutral-100">
                        <X className="size-5"/>
                    </Dialog.Close>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                        <span className='text-sm font-medium text-neutral-200 '>
                            {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
                        </span>
                        <p className='text-sm leading-6 text-neutral-400'>
                            {note.content}
                        </p>
                    </div>

                    <button 
                        type="button"
                        onClick={() => onNoteDeleted(note.id)}
                        className="w-full bg-neutral-900 py-4 text-center text-sm text-neutral-300 outline-none font-medium group"
                    >
                        Deseja <span className="text-red-500 group-hover:underline">apagar esta nota</span> ?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}