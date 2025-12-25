type GridProductCardTitle = {
  name: string;
}

const GridProductCardTitle = ({name}:GridProductCardTitle) => {
  return (
    <h3 className={`text-md font-semibold text-[#7E2A0C]`}>{name.length > 20 ?  `${name.slice(0,20)}...` : name}</h3>
  )
}

export default GridProductCardTitle