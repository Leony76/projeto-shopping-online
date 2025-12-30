type CardsGrid = {
  children: React.ReactNode;
  style?: string;
  grid: {
    sm: 1 | 2 | 3 | 4 | 5,
    md: 1 | 2 | 3 | 4 | 5,
    lg: 1 | 2 | 3 | 4 | 5,
    xl: 1 | 2 | 3 | 4 | 5,
  };
}

const CardsGrid = ({children, style, grid}:CardsGrid) => {
  return (
    <div className={`grid
      grid-cols-1
      sm:grid-cols-${grid.sm}
      md:grid-cols-${grid.md}
      lg:grid-cols-${grid.lg}
      xl:grid-cols-${grid.xl}
      gap-4 my-4
      ${style}
    `}>{children}</div>
  )
}

export default CardsGrid;