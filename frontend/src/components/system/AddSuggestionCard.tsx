import { FaCheckCircle, FaWindowClose } from "react-icons/fa";
import { FaUser, FaPlus } from "react-icons/fa6";
import { ImCheckboxChecked } from "react-icons/im";
import type { AddSuggestions } from "../../types/AddSuggestions";
import { limitName } from "../../utils/formatation/limitName";
import DateTime from "../ui/DateTime";
import ProceedActionButton from "../ui/ProceedActionButton";
import ReturnActionButton from "../ui/ReturnActionButton";

type AddSuggestionCard = {
  addSuggestion: AddSuggestions;
  actions: {
    AddSuggestionDecision: (addSuggestionId: number, decision: "accepted" | "denied") => Promise<void>
  }
}

const AddSuggestionCard = ({addSuggestion, actions}:AddSuggestionCard) => {
  return (
    <div className='relative border-y-8 border-double pb-2 pt-1 bg-gray-100 shadow-[0px_0px_3px_#0092B8] px-2 border-cyan-600' key={addSuggestion.id}>
      {addSuggestion.accepted ? <FaCheckCircle title='Sugestão aceita' className='absolute text-green-700 right-3 top-2 text-2xl'/> : ''}
      <div className='text-xl flex items-center gap-1 text-orange-700'><FaUser/>{limitName(addSuggestion.user.name.length > 25 ? addSuggestion.user.name.slice(0,25) : addSuggestion.user.name, 2)}</div>
      <div className='text-cyan-700'><DateTime timeStamp={addSuggestion.created_at}/></div>
      <div>
        <label className='flex text-gray-600 items-center gap-1'><FaPlus/>
          Sugestão de adição:
        </label>
        <p className='h-[fit] text-sm overflow-y-auto border-t-1 pb-1 text-orange-800 pt-0.5 mt-1 border-gray-300'>{addSuggestion.add_suggestion}</p>
      </div>
      {!addSuggestion.accepted && (
        <div className='flex gap-3 border-t-1 pt-2 border-gray-400'>
          <ProceedActionButton
            iconButton={ImCheckboxChecked}
            iconButtonSize={0}
            buttonLabel={'Aceitar'}
            styles='text-green-800 bg-green-100'
            onClick={() => actions.AddSuggestionDecision(addSuggestion.id, 'accepted')}
          />
          <ReturnActionButton 
            onClick={() => actions.AddSuggestionDecision(addSuggestion.id, 'denied')}
            iconButton={FaWindowClose} 
            iconButtonSize={0} 
            buttonLabel={'Recusar'}
          />
        </div>
      )}
    </div>
  )
}

export default AddSuggestionCard