import type { ProductAPI } from "../../types/ProductAPI"
import CategoryIcon from "../ui/CategoryIcon";
import Money from "../ui/Money";
import Rating from "../ui/Rating";
import RatingCount from "../ui/RatingCount";
import SoldAmount from "../ui/SoldAmount";
import Date from "../ui/Date";
import CardTitle from "../ui/GridProductCardTitle";
import UserComment from "./UserComment";
import type { UserCommentaryRate } from "../../types/UserCommentaryRate";

type UsersRateCommentCard = {
  product: ProductAPI;
  usersReviews: UserCommentaryRate[];
}

const UsersRateCommentCard = ({
  product,
  usersReviews,
}:UsersRateCommentCard) => {
  return (
    product && (
      <div className="flex p-2 border-x-4 border-double border-cyan-700 bg-gray-100">
        <div className="flex w-full border-y-2 border-gray-300 py-1 py-2">                    
          <div className="w-[200px]">
            <figure className="h-[120px]">
              <img className="rounded h-full" src={product.image_url} alt={product.name} />
            </figure>
            <div className="flex flex-col gap-1">
              <CardTitle textLength={24} name={product.name}/>
              <div className="flex gap-1 text-cyan-700 items-center">
                <CategoryIcon category={product.category}/>    
                <span className="text-[10px]">●</span>   
                <Date timeStamp={product.created_at}/>
              </div>
              <div className="flex text-xs font-semibold items-center justify-between">
                <Money value={product.price}/>
                <Rating rate={product.product_rate_avg_rating}/>   
                <RatingCount rateCount={product.product_rate_count}/>
                <SoldAmount soldAmount={product.orders_sum_quantity}/>
              </div>
            </div>
          </div>
          <div className="custom-scroll max-h-[185px] overflow-y-auto flex flex-col flex-1 gap-2 px-2 ml-1">
            {usersReviews.map(review => (
              <UserComment
                key={review.id}
                {...review}
              />
            ))}
          </div>
        </div>
      </div>
    )
  )
}

export default UsersRateCommentCard