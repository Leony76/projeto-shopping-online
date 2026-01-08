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
      <div className="p-2 border-x-6 border-double shadow-[0_0_3px_#005F78] border-cyan-700 bg-gray-100">
        <div className="flex xl:flex-row flex-col xl:gap-0 gap-4 w-full border-y-2 border-gray-300 py-1 py-2">                    
          <div className="xl:w-[200px] w-full">
            <figure className="xl:h-[185px] w-full">
              <img className="rounded object-cover h-full" src={product.image_url} alt={product.name} />
            </figure>
            <div className="flex flex-col gap-">
              <CardTitle style="xl:block hidden" textLength={24} name={product.name}/>
              <CardTitle style="xl:hidden block !text-xl mt-1" textLength={50} name={product.name}/>
              <div className="flex sm:text-sm text-sm gap-1 mt-[-6px] text-cyan-700 items-center">
                <CategoryIcon category={product.category}/>    
                <span className="text-[10px]">●</span>   
                <Date timeStamp={product.created_at}/>
              </div>
              <div className="flex justify-between font-semibold xl:text-[13px] md:text-lg sm:text-xl text-[14px] flex-wrap">
                <Money value={product.price}/>
                <SoldAmount soldAmount={product.orders_sum_quantity}/>
                <Rating rate={product.product_rate_avg_rating}/>
                <RatingCount rateCount={product.product_rate_count}/>
              </div>
            </div>
          </div>
          <div className="custom-scroll xl:border-none mt-[-8px] xl:mt-0 border-t-2 border-gray-300 xl:pt-0 pt-2 max-h-[185px] overflow-y-auto flex flex-col flex-1 gap-2 xl:px-2 pr-1 ml-1">
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