type SubmitButton = {
  ButtonAction: string;
}

const SubmitButton = ({ButtonAction}:SubmitButton) => {
  return (
    <button type="submit" className="bg-white font-bold text-black p-2 mt-3 rounded-lg cursor-pointer hover:opacity-80 active:opacity-100">{ButtonAction}</button>
  )
}

export default SubmitButton