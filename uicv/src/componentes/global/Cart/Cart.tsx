import React, { useContext, useMemo } from "react";
import { Collection, useForm } from "usetheform";
import { CartItem } from "./CartItem";
import { ShopInfo } from "./ShopInfo";
import { IOidc } from "../../../interfaces/oidc/IOidc";
import { CtxCreditoTiendita } from "../../app/modulos/creditos/CompCreditos/CreditoTienditaSocia/CreditoTienditaContext";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

type Type = {
  items: { id: number; sku: number, codigo: string, qty: number; desc: string; price: number; stock: number, imagen: string, id_estructura: number, descuento: number }[],
  onRemoveItem(id: number): any
}

export function Cart({ onRemoveItem }: Type) {
  const { ArticulosCarrito } = useContext(CtxCreditoTiendita);
  const { state, dispatch } = useForm();

  const udpdateShopInfo = (value: any) => {

    const items = value?.items?.map(item => ({
      ...item,
      price: isNaN(item.descuento) ? item.price : item.price - (item.price * item.descuento / 100)
    }));


    console.log("M: UPDATE ITEMS ON HOOK", items, ArticulosCarrito)

    const info = items.reduce(
      (acc: any, item: any) => {
        acc.totalQty += item.qty;
        acc.totalPrice += Number((item.qty * item.price).toFixed(2));
        acc.totalPriceOrg = Number((acc.totalPriceOrg + item.qty * item.precioOrg).toFixed(2));
        return acc;
      },
      { totalItems: items.length, totalPrice: 0, totalQty: 0, totalPriceOrg: 0 }
    );

    return {
      items
      , info
    };
  };

  React.useEffect(() => {
    console.log("M: ACTUALIZA HOOOOOOOK", ArticulosCarrito)
    dispatch(prev => ({
      ...prev,
      cart: udpdateShopInfo({ items: ArticulosCarrito })
    }))
  }, [ArticulosCarrito]);

  React.useEffect(() => {
    console.log(state.cart)
  }, [state]);

  return (
    <Collection object name="cart" >
      <div className="cartItems">
        <Collection array name="items" >
          {ArticulosCarrito.map((item: any) => (
            <CartItem {...item} onRemoveItem={onRemoveItem} key={item.id} />
          ))}
        </Collection>
      </div>
      <ShopInfo />
    </Collection>
  );
}

