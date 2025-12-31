import { FaKitchenSet } from "react-icons/fa6";
import { GiGameConsole, GiGemNecklace, GiMagicBroom } from "react-icons/gi";
import { MdTableRestaurant } from "react-icons/md";

type CategoryIcon = {
  category: "Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis" | "";
  style?: string;
}

const CategoryIcon = ({category, style}:CategoryIcon) => {
  return (
    <p className={`flex text-xs items-center gap-[2px] ${style && style}`}>
      {category === 'Cozinha' ?
        <FaKitchenSet/>
      : category === 'Artesanal' ?
        <GiGemNecklace/>
      : category === 'Eletrônico' ?
        <GiGameConsole/>
      : category === 'Limpeza' ?
        <GiMagicBroom/>
      : 
        <MdTableRestaurant/>
      }
    {category}</p>
  )
}

export default CategoryIcon