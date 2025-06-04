import React, { useState, useCallback, useEffect, useContext } from "react";
import { Form } from "usetheform";
// import { Form } from 'formik'
import { Cart } from "./Cart";
// import ReactJson from "react-json-view";

// import "bulma/css/bulma.css";
import "./styles.css";
import { IOidc } from "../../../interfaces/oidc/IOidc";
import { CtxCreditoTiendita } from "../../app/modulos/creditos/CompCreditos/CreditoTienditaSocia/CreditoTienditaContext";

type CartFormType = {
  articulos: {
    id: number,
    sku: number,
    codigo: string,
    qty: number,
    desc: string,
    price: number,
    stock: number,
    imagen: string,
    id_estructura: number,
    descuento: number
  }[],
  removeItem(id: number): any,
  sendItems(items: any): any,
  fnCancel(): any
}

export default function CartForm(props: CartFormType) {
  const { ArticulosCarrito, setArticulosCarrito } = useContext(CtxCreditoTiendita);
  //   const [formState, setFormState] = useState({});
  // const [items, setCartItem] = useState(props.articulos);

  const onRemoveItem = useCallback((idToRemove) => {
    setArticulosCarrito((prev) => prev.filter(({ id }) => id !== idToRemove))
    props.removeItem(idToRemove)
  }
    //eslint-disable-next-line
    , []);

  // const onAddItem = useCallback(() => {
  //   const item = createRandomItem();
  //   setCartItem((s) => [...s, item]);
  // }, []);

  return (
    <div className="CartForm">
      {/* <div className="box"> */}
      <Form
        onSubmit={(state: any) => {
          props.sendItems(state)
          // props.sendItems({ cart: state })
        }
        }

      //   onChange={(state: any) => setFormState(state)}
      >
        <Cart items={ArticulosCarrito} onRemoveItem={onRemoveItem} />
        {/* <button type="submit" className="button is-small is-link">
            Submit
          </button> */}
        <div className="text-end">
          {/* <button type="button" className="ms-2 button is-small is-danger waves-effect waves-light" onClick={props.fnCancel}>
            Cancelar
          </button> */}
          <button type="submit" className="ms-2 button is-small is-link waves-effect waves-light">
            Aceptar
          </button>
        </div>
      </Form>
      {/* <br />
        <button
          type="button"
          className="button is-small is-success"
          onClick={onAddItem}
        >
          Añadir Producto
        </button> */}
      {/* </div> */}
      {/* <div className="box">
        <ReactJson src={formState} />
      </div> */}
    </div>
  );
}

// let id = 0;
// const createRandomItem = () => {
//   id = id + 1;
//   return {
//     id,
//     qty: 1,
//     desc: `Item number: ${id}`,
//     price: Number((Math.random() * 10 + 1).toFixed(2)),
//     stock: 3
//   };
// };
