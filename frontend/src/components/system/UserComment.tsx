import { FaUserCircle } from "react-icons/fa"
import { FaThumbsUp, FaThumbsDown, FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa6"
import RatingStars from "../ui/RatingStars"
import type { UserCommentaryRate } from "../../types/UserCommentaryRate";
import { timeAgo } from "../../utils/formatation/timeAgo";
import { useCatchError } from "../../utils/ui/useCatchError";
import { api, getCsrf } from "../../services/api";
import { useEffect, useState } from "react";
import type { UserReactions } from "../../types/UserReactions";
import { useAuth } from "../../context/AuthContext";
import { RiBookFill, RiBookOpenFill } from "react-icons/ri";
import { limitName } from "../../utils/formatation/limitName";

const UserComment = ({
  id,
  username,
  commentary,
  rate,
  likes,
  dislikes,
  created_at,
  updated_at,
}:UserCommentaryRate) => {
  const catchError = useCatchError();

  const { user } = useAuth();

  const [likesCount, setLikesCount] = useState(likes ?? 0);
  const [dislikesCount, setDislikesCount] = useState(dislikes ?? 0);
  const [sliceCommentary, setSliceCommentary] = useState<boolean>(false);

  const [userReactions, setUserReactions] = useState<UserReactions[]>([]);

  const handleLike = async () => {
    try {
      await getCsrf();
      const response = await api.post(`/like-dislike-comment/${id}`, { type: 'like' });

      setLikesCount(response.data.likes);
      setDislikesCount(response.data.dislikes);

      setUserReactions(prev =>
        prev
          .filter(r => r.user_review_id !== id)
          .concat(response.data.user_reaction ? [response.data.user_reaction] : [])
      );
    } catch (err) {
      catchError(err);
    }
  };

  const handleDislike = async () => {
    try {
      await getCsrf();
      const response = await api.post(`/like-dislike-comment/${id}`, { type: 'dislike' });

      setLikesCount(response.data.likes);
      setDislikesCount(response.data.dislikes);

      setUserReactions(prev =>
        prev
          .filter(r => r.user_review_id !== id)
          .concat(response.data.user_reaction ? [response.data.user_reaction] : [])
      );
    } catch (err) {
      catchError(err);
    }
  };

  useEffect(() => {
    setLikesCount(likes ?? 0);
    setDislikesCount(dislikes ?? 0);
  }, [likes, dislikes]);

  useEffect(() => {
    const getCurrentReactions = async() => {
      try {
        const response = await api.get<{reactions: UserReactions[]}>('/users-current-reactions');
        setUserReactions(response.data.reactions);
      } catch (err:unknown) {
        catchError(err);
      }
    }

    getCurrentReactions();
  },[]);

  const alreadyReacted = userReactions.find(
    ur =>
      ur.user_review_id === id
    && 
      ur.user_id === user?.id
  );

  useEffect(() => {
    if (commentary.length > 200) {
      setSliceCommentary(true);
    }
  },[]);

  return (
    <div className="border-y-3 bg-white px-2 border-double border-yellow-500">
      <div className="flex text-orange-800 py-1 items-center gap-1">
        <h4 className="mb-[2px] text-sm flex items-center gap-1"><FaUserCircle className="mt-[2px]" size={15}/>{limitName(username.length > 20 ? username.slice(0,20) + '...' : username, 2)}</h4>
        <span className="text-[10px]">●</span>
        <small>{timeAgo(created_at)}</small>
        {created_at !== updated_at && <small>(Editado)</small>}
      </div> 
      <p className="break-words border-t pt-1 text-cyan-700 border-gray-200 text-xs leading-[1.4]">   
        {sliceCommentary ? commentary.slice(0, 200) + '...' : commentary}
      </p>
      {sliceCommentary && <button className=" flex items-center gap-1 text-gray-400 text-sm cursor-pointer hover:brightness-[1.2]" onClick={() => setSliceCommentary(false)}><RiBookOpenFill className="mt-1"/>Ler mais</button>}
      {(!sliceCommentary && commentary.length > 255) && <button className=" flex items-center gap-1 text-gray-400 text-sm cursor-pointer hover:brightness-[1.2]" onClick={() => setSliceCommentary(true)}><RiBookFill className="mt-1"/>Ler menos</button>}
      <div className="flex items-center gap-4 text-sm border-t border-gray-200 pt-1 my-1">
        <RatingStars
          elements={{
            rating: rate
          }}
        />
        <span onClick={handleLike} className="flex items-center gap-1 text-green-700 hover:brightness-[1.3] cursor-pointer">{alreadyReacted?.type === 'like' ? <FaThumbsUp/> : <FaRegThumbsUp/>}{likesCount === 0 ? '' : likesCount}</span>
        <span onClick={handleDislike} className="flex items-center gap-1 text-red-700 hover:brightness-[0.7] cursor-pointer">{alreadyReacted?.type === 'dislike' ? <FaThumbsDown/> : <FaRegThumbsDown/>}{dislikesCount === 0 ? '' : dislikesCount}</span>
      </div>
    </div>
  )
}

export default UserComment;