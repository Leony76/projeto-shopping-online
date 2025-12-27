import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

type RatingStars = {
  elements: {
    name: string
    hoverRating?: number;
    rating: number | undefined;
  }
  actions?: {
    setHoverRating: React.Dispatch<React.SetStateAction<number>>;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    handleRatingSubmit: (rating: number | null) => Promise<void>;
  }
  flags: {
    hovering: boolean;
  }
}

const RatingStars = ({elements, actions, flags}:RatingStars) => {

  const currentRating = elements.hoverRating !== undefined && elements.hoverRating > 0
    ? elements.hoverRating
    : elements.rating ?? 0
  ;

  return (
    <div title="Avalição média" className="flex text-yellow-600 font-semibold items-center gap-1">
      {elements.name}
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = currentRating >= star;
        const isHalf = currentRating >= star - 0.5 && currentRating < star; 

        return (
          <label
            key={star}
            onMouseEnter={() => flags.hovering && actions?.setHoverRating(star)}
            onMouseLeave={() => flags.hovering && actions?.setHoverRating(0)}
            className={`${flags?.hovering ? 'cursor-pointer' : ''}`}
          >
            <input
              type="radio"
              name="rating"
              value={star}
              hidden
              onChange={() => {
                actions?.setRating(star);
                actions?.handleRatingSubmit(star);
              }}
            />

            {isFull ? (
              <IoIosStar className="text-yellow-600 text-xl" />
            ) : isHalf ? (
              <IoIosStarHalf className="text-yellow-600 text-xl"/>
            ) : (
              <IoIosStarOutline className="text-yellow-600 text-xl" />
            )}
          </label>
        )
      })}
    </div>
  )
}

export default RatingStars