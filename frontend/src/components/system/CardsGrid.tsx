type CardsGrid = {
  children: React.ReactNode;
  style?: string;
  gridType: 'productCards' | 'productReviews' | 'productSuggests';
}

const CardsGrid = ({children, style, gridType}:CardsGrid) => {
  return (
    gridType === 'productCards' ? (
      <div className={`grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4 my-4
        ${style}
      `}>{children}</div>
    ) : (
       <div className={`grid
        grid-cols-1
        sm:grid-cols-1
        md:grid-cols-1
        lg:grid-cols-2
        xl:grid-cols-2
        gap-4 my-4
        ${style}
      `}>{children}</div>
    )
  )
}

export default CardsGrid;