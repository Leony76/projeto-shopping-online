import { IoIosStar } from "react-icons/io";
import { IoStarOutline } from "react-icons/io5";

const Rating = ({ rate }: { rate?: number | string | null }) => {
  const numericRate =
    rate !== null && rate !== undefined
      ? Number(rate)
      : null;

  const hasRating =
    typeof numericRate === "number" &&
    !Number.isNaN(numericRate);

  return (
    <p className="flex items-center gap-1 text-yellow-600">
      {hasRating ? <IoIosStar /> : <IoStarOutline />}
      {hasRating ? numericRate.toFixed(1).replace(".", ",") : "?"}
    </p>
  );
};

export default Rating;
