import { IoClose } from "react-icons/io5";
import type { Product } from "../../types/Product";
import InputForm from "./InputForm";
import ClearSearch from "../ui/ProceedActionButton";

type MainSearchTopBar = {
  value: {
    search: string;
    filter: string;
  }
  actions: {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setFilter: React.Dispatch<React.SetStateAction<"" | "Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis">>;
  }
}

const MainSearchTopBar = ({value, actions}:MainSearchTopBar) => {
  return (
    <>
      <InputForm
        fieldType={'search'}
        placeholderValue={'Buscar'}
        inputStyle='h-full !bg-orange-100 border-orange-700 border-r border-l-15 rounded-tr-[0] rounded-br-[0]'
        value={value.search}
        style='w-[300px]'
        onChange={(e) => actions.setSearch(e.target.value)}
      />
      <InputForm
        fieldType={'select'}
        forSearchInput={true}
        placeholderValue={'Buscar'}
        inputStyle='h-full mt-[-2px] !bg-orange-100 border-orange-700 rounded-none'
        value={value.filter}
        onSelect={(e) => actions.setFilter(e.target.value as Product['category'])}
      />
      <ClearSearch 
        iconButton={IoClose} 
        iconButtonSize={20} 
        buttonLabel={''}
        styles='h-full px-1 !bg-orange-100 border-orange-700 rounded !border-y-2 border-r-15 border-double rounded-tl-[0] rounded-bl-[0]'
        onClick={() => {
          actions.setSearch('');
          actions.setFilter('');
        }}
      />
    </>
  )
}

export default MainSearchTopBar