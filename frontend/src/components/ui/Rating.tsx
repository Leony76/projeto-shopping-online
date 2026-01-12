import { IoIosStar } from "react-icons/io"
import { IoStarOutline } from "react-icons/io5"

const Rating = ({ rate }: { rate?: number | null }) => {
  const hasRating = typeof rate === 'number' && rate > 0;

  return (
    <p className="flex items-center gap-1 text-yellow-600">
      {hasRating ? <IoIosStar /> : <IoStarOutline />}
      {hasRating ? rate.toFixed(1).replace('.', ',') : '?'}
    </p>
  );
};

export default Rating;
