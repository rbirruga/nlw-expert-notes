import * as Dialog from "@radix-ui/react-dialog";

import { X, ArrowLeft } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition:  SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [shouldShowBackArrow, setShouldShowBackArrow] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState('');

  function handleShowOnboarding() {
    setShouldShowOnboarding(true);
    setShouldShowBackArrow(false);
  }

  function handleStartEditor() {
    setShouldShowOnboarding(false);
    setShouldShowBackArrow(true);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if(event.target.value === ''){
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if(content === ''){
      toast.error("É necessário preencher o texto para adicionar a nota ...");
      return;
    }

    onNoteCreated(content);
    setContent('');
    setShouldShowOnboarding(true);

    toast.success("Nota adicionada com sucesso!");
  }

  function handleStartRecording(){

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window;
    
    if(!isSpeechRecognitionAPIAvailable){
      toast.error("Infelizmente seu navegador não suporta a API de gravação!");
      return;
    }
    setIsRecording(true);
    setShouldShowOnboarding(false);
    setShouldShowBackArrow(true)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');

      setContent(transcription);
    }

    speechRecognition.onerror = (event) => {
      console.error(event);
    }

    speechRecognition.start();  
  }

  function handleStopRecording(){
    

    if(speechRecognition){
      speechRecognition.stop();
      toast.info("Transcrição finalizada!")
    }

    setIsRecording(false);
    
  }

  return(
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col text-left bg-neutral-700 p-5 gap-3 outline-none hover:ring-2 hover:ring-neutral-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className='text-sm font-medium text-neutral-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-neutral-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>

      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.DialogOverlay className="inset-0 fixed bg-black/50"/>
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-neutral-800 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-neutral-900 p-1.5 text-neutral-400 hover:text-neutral-100">
              <X className="size-5"/>
          </Dialog.Close>
          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className='text-sm font-medium text-neutral-200'>
                <div className="flex justify-start">
                  {shouldShowBackArrow ? (
                    <><button type="button" onClick={handleShowOnboarding} className="m-0 pr-4"><ArrowLeft/></button><span className="pt-1">Adicionar nota</span></>
                  ) : (
                    <span className="pt-1">Adicionar nota</span>
                  )}
                </div>
              </span>
              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-neutral-400'>
                  Comece <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
                </p> 
                ) : (
                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-neutral-400 bg-neutral-900 resize-none flex-1 outline-none p-5 rounded-sm"
                    onChange={handleContentChanged}
                    value={content}
                  />
                )
              
              }
            </div>
            {isRecording ? (
              <button 
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 py-4 text-center text-sm text-neutral-300 outline-none font-medium hover:underline hover:text-neutral-100"
              >
                  <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                  Gravando! (clique para interromper)
              </button>

            ) : (
              <button 
                  type="button"
                  onClick={handleSaveNote}
                  className="w-full bg-lime-400 py-4 text-center text-sm text-neutral-800 outline-none font-medium hover:underline hover:bg-lime-500"
              >
                  Salvar nota
              </button>
            )}

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}