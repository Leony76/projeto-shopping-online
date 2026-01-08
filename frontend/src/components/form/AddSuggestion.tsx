import { FaPaperPlane } from "react-icons/fa6";
import InputForm from "./InputForm";
import SubmitButton from "./SubmitButton";

type AddSuggestion = {
  addSuggestion: string;
  actions: {
    setAddSuggestion: React.Dispatch<React.SetStateAction<string>>;    
    AddSuggestion: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  }
  processing: {
    addSuggestion: boolean;
  }
}

const AddSuggestion = ({actions, addSuggestion, processing}:AddSuggestion) => {
  return (
    <>
      <p className="md:text-base text-sm mb-2 text-cyan-800">Deixe sua sugestão do que poderia ser adicionado de novo no nosso site! Estamos a disposição de acolher quaisquer melhorias proveitosas que possam ser sugeridas por você e pela comunidade!</p>
      <form onSubmit={actions.AddSuggestion}>
        <InputForm
          fieldType="textArea" 
          maxLength={1000}
          value={addSuggestion}
          onTextArea={(e) => actions.setAddSuggestion(e.target.value)}
        />
        <SubmitButton 
          ButtonAction={"Mandar sugestão"} 
          icon={FaPaperPlane} 
          processing={processing.addSuggestion}  
          processingLabel={"Mandando"}
          style="bg-cyan-100 text-cyan-700 w-full !text-base font-semibold !mt-3"
        />
      </form>
    </>
  )
}

export default AddSuggestion