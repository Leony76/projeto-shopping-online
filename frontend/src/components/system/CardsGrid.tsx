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
        ${'xl:gap-4 xl:my-4 xl:mx-0 xl:py-2'}
        ${'lg:gap-8 lg:my-4 lg:mx-4 lg:py-4'}
        ${'md:gap-10 md:my-4 md:mx-4 md:py-4'}
        ${'sm:gap-12 sm:my-4 sm:mx-4 sm:py-4'}
        ${'xs:gap-12 xs:my-4 sx:mx-4 xs:py-4'}
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