import { api } from "./api";

export async function ProductPost(payload: FormData) {
  return await api.post("admin/products", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
// type PropsType = {
//   name: string;
//   category: string;
//   description: string;
//   file: File | null;
//   price: string;
//   amount: string;
// }

// export async function ProductPost({
//   name,
//   category,
//   description,
//   file,
//   price,
//   amount
// }:PropsType) {
//   return await api.post('admin/products', {
//     name: name,
//     category: category,
//     description: description,
//     image: file,
//     price: Number(price),
//     amount: Number(amount),
//   })
// }


