export function convertPrice(price:number) {
   const converted_price = price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return converted_price;
}