import { IoClose } from "react-icons/io5";
import type { Product } from "../../types/Product";
import InputForm from "./InputForm";
import React, { forwardRef } from 'react';
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

const MainSearchTopBar = forwardRef<HTMLInputElement, MainSearchTopBar>(
  ({value, actions}, ref) => {
    return (
      <div className="flex">
        <InputForm
          ref={ref}
          fieldType={'search'}
          placeholderValue={'Buscar'}
          inputStyle='h-full !bg-orange-100 border-orange-700 border-r border-l-15 rounded-tr-[0] rounded-br-[0]'
          value={value.search}
          style='xl:w-[300px] lg:w-[280px] md:w-[260px] sm:w-[300px] w-[45vw]'
          onChange={(e) => actions.setSearch(e.target.value)}
        />
        <InputForm
          fieldType={'select'}
          forSearchInput={true}
          placeholderValue={'Buscar'}
          inputStyle='h-full mt-[-2px] md:w-fit !bg-orange-100 border-orange-700 rounded-none'
          value={value.filter}
          onSelect={(e) => actions.setFilter(e.target.value as Product['category'])}
        />
        <ClearSearch 
          iconButton={IoClose} 
          iconButtonSize={20} 
          buttonLabel={''}
          styles='h-full px-1 text-cyan-600 !bg-orange-100 border-orange-700 rounded !border-y-2 border-r-15 border-double rounded-tl-[0] rounded-bl-[0]'
          onClick={() => {
            actions.setSearch('');
            actions.setFilter('');
          }}
        />
      </div>
    )
  }
)

export default MainSearchTopBar