export type AddSuggestions = {
  id: number;
  add_suggestion: string;
  accepted: boolean;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    id: number;
  } 
};