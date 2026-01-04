type GridProductCardTitle = {
  name: string;
  textLength: number;
  style?: string;
}

const GridProductCardTitle = ({name, textLength, style}:GridProductCardTitle) => {
  return (
    <h3 className={`font-semibold text-[#7E2A0C] ${style}`}>{name.length > textLength ?  `${name.slice(0,textLength)}...` : name}</h3>
  )
}

export default GridProductCardTitle