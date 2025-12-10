import { useEffect, useState } from "react";
import { validateProductBeforeSubmit } from "../utils/ValidateProductInfosBeforeSubmit";
import { ProductPost } from "../services/ProductPost";
import Toast from "./Toast";

type AddProductsFormPropsType = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  file: File | null;
  handleChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
  resetImagePreview: () => void; 
}

const AddProductsForm = ({
  inputRef,
  preview,
  file,
  handleChange,
  handleClick,
  resetImagePreview,
}:AddProductsFormPropsType) => {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const error = validateProductBeforeSubmit({
      name,
      category,
      description,
      price,
      amount,
    });

    if (error) {
      setToast({ message: error, type: "error" });
      return;
    }

    if (!file) {
      setToast({message: 'Selecione a imagem do produto', type: 'error'})
      return;
    } 

    const payload = new FormData();

    payload.append("name", name);
    payload.append("category", category);
    payload.append("description", description);
    payload.append("price", price);
    payload.append("image", file);
    payload.append("amount", amount);

    try {
      const response = await ProductPost(payload);
      setToast({message: response.data.message, type: response.data.type});

      setName(""); 
      setCategory("");
      setDescription("");
      setPrice("");
      setAmount("");
      resetImagePreview();
    } catch (err:any) {
      setToast({message: `Houve um erro: ${err}`, type: 'error'});
    }
  }

  useEffect(() => {
    if (!toast)return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    }
  }, [toast]);

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      {toast && (
        <Toast message={toast.message} type={toast.type}/>
      )}

      <div className="product-info">
        <div className="product-information">
          <h1>Adicionar Produtos</h1>
          <div>
            <label htmlFor="name">Nome:</label>
            <input onChange={(e) => setName(e.target.value)} value={name} name="name" id="name" type="text" />
          </div>
          <div>
            <label htmlFor="category">Categoria:</label>
            <select onChange={(e) => setCategory(e.target.value)} value={category} name="category" id="category">
              <option value="" disabled>--Selecione--</option>
              <option value="Artesanal">Artesanal</option>
              <option value="Cozinha">Cozinha</option>
              <option value="Limpeza">Limpeza</option>
            </select>
          </div>
          <div>
            <label htmlFor="description">Descrição:</label>
            <textarea onChange={(e) => setDescription(e.target.value)} value={description} name="description" id="description"></textarea>
          </div>
          <div>
            <label htmlFor="price">Preço:</label>
            <input onChange={(e) => setPrice(e.target.value)} value={price} name="price" id="price" min={0} type="number" step={'any'}/>
          </div>
        </div>
        <div className="image-input-amount">
          <div className="image-input">
            <label htmlFor="image">Imagem:</label>
            <input onChange={handleChange} ref={inputRef} accept="image/*" name="image" id="file-input" type="file" hidden/>
            <button type="button" className="image-file-button" onClick={handleClick}>Escolher Imagem</button>
          </div>
          <div className="amount-container">
            <label htmlFor="amount">Quantidade:</label>
            <input onChange={(e) => setAmount(e.target.value)} value={amount} name="amount" id="amount" min={1} type="number" />
          </div>
        </div>
        <button type="submit" className="add-product-button">Adicionar</button>
      </div>
      <div className="image-preview"
        style={{backgroundImage: preview ? `url(${preview})` : "none"}}
      ><p>{preview ? '' : 'Imagem do produto'}</p></div>
    </form>
  )
}

export default AddProductsForm