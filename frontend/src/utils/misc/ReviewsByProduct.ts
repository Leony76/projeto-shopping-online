import { useMemo } from "react";
import type { UserCommentaryRate } from "../../types/UserCommentaryRate";

const ReviewsByProduct = ({userReviews}:{userReviews:UserCommentaryRate[]}) => {
  const reviewsByProduct = useMemo(() => {
    return userReviews.reduce<Record<number, UserCommentaryRate[]>>(
      (acc, review) => {
        if (!acc[review.product_id]) {
          acc[review.product_id] = [];
        }
        acc[review.product_id].push(review);
        return acc;
      },
      {}
    );
  }, [userReviews]);

  return { reviewsByProduct }
}

export default ReviewsByProduct