export type UserCommentaryRate = {
  id?: number;
  rate: number;
  username: string;
  user_id: number;
  product_id: number;
  commentary: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}