type GridProductCardTitle = {
  name: string;
  textLength: number;
}

const GridProductCardTitle = ({name, textLength}:GridProductCardTitle) => {
  return (
    <h3 className={`text-md font-semibold text-[#7E2A0C]`}>{name.length > textLength ?  `${name.slice(0,textLength)}...` : name}</h3>
  )
}

export default GridProductCardTitle