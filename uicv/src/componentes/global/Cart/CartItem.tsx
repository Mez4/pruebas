import React, { useState, useMemo, useEffect, useContext } from "react";
import { Input, Collection, useSelector, useForm } from "usetheform";
import { FaTrashAlt } from 'react-icons/fa'
import { truncateDecimals } from '../../../global/functions'
import { CustomFieldText2, ImgViewer } from '../'
import * as Funciones from '../../app/modulos/creditos/CompCreditos/CreditoArticulos/Funciones'
import { IOidc } from "../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import { FormateoDinero } from "../../../global/variables";
import { FNValidarCodigoTiendita } from "../../app/modulos/creditos/CompCreditos/CreditoTienditaSocia/Funciones";
import { CtxCreditoTiendita } from "../../app/modulos/creditos/CompCreditos/CreditoTienditaSocia/CreditoTienditaContext";

type Type = {
  qty: number,
  price: number,
  id: number,
  sku: number,
  codigo: string,
  desc: string,
  stock: number,
  imagen: string,
  id_estructura: number,
  descuento: number
  descuentoOriginal: number
  onRemoveItem(id: number): any,
}

const preventNegativeQty = (val: number) => (val < 1 ? 1 : val);

export function CartItem({ qty, price, onRemoveItem, id, sku, codigo, desc, stock, imagen, id_estructura, descuento, descuentoOriginal }: Type) {
  const { DistribuidorID, ClienteID, Oidc, setArticulosCarrito, ArticulosCarrito, avoidCodigo } = useContext(CtxCreditoTiendita);
  const [total, setTotal] = useState(0);
  const [codeDiscount, setCodeDiscount] = useState('');
  const { state, dispatch } = useForm();

  const preventOutofStock = (val: number) => val > stock ? stock : val;

  const Imagen = useMemo(() => { return <ImgViewer imgSrc={imagen} noToolbar={true} zIndex={1500} maxWidth={480} maxHeight={430} /> }, [imagen])



  const changeQtyItem = (newValue) => {
    const value = preventOutofStock(preventNegativeQty(newValue))
    setArticulosCarrito((prev) => {
      console.log("M: DENTRO DEL STATE", prev.filter(data => data.sku == sku))
      return prev.map(art => ({
        ...art,
        qty: art.sku == sku ? value : art.qty,
        descuento: art.sku == sku ?
          art.descuentoOriginal ? art.descuentoOriginal / value : 0 :
          art.descuento,
      }))
    })
  }

  const updateCodeDiscount = (value) => {
    setCodeDiscount(value)
    if (value.length == 6) {
      FNValidarCodigoTiendita(Oidc, { DistribuidorID, ClienteID, SKU: sku, Codigo: value })
        .then((res: any) => {
          // dispatch(prev => ({
          //   ...prev,
          //   cart: {
          //     ...prev.cart,
          //     items: prev.cart.items.map(art => ({
          //       ...art,
          //       descuento: res.SKU == art.sku ? res.Descuento / art.qty : art.descuento,
          //       descuentoOriginal: res.Descuento,
          //     }))
          //   }
          // }))
          setArticulosCarrito((prev) => prev.map(art => ({
            ...art,
            code: res.SKU == art.sku ? value : art.code,
            descuento: res.SKU == art.sku ? res.Descuento / art.qty : art.descuento,
            descuentoOriginal: res.SKU == art.sku ? res.Descuento : art.descuento,
          })))
        })
        .catch(err => toast.error(err.response.data || err))
    } else {
      // dispatch(prev => ({
      //   ...prev,
      //   cart: {
      //     ...prev.cart,
      //     items: prev.cart.items.map(art => ({
      //       ...art,
      //       code: value,
      //       descuento: sku == art.sku ? undefined : art.descuento,
      //       descuentoOriginal: undefined,
      //     }))
      //   }
      // }))
      setArticulosCarrito((prev) => prev.map(art => ({
        ...art,
        code: sku == art.sku ? value : art.code,
        descuento: sku == art.sku ? undefined : art.descuento,
        descuentoOriginal: undefined,
      })))
    }
  }

  React.useEffect(() => {
    console.log("M: ACTUALIZA CANTIDAS", qty, sku)
  }, [qty, sku]);

  useEffect(() => {
    // dispatch(prev => ({
    //   ...prev,
    //   cart: {
    //     ...prev.cart,
    //     items: ArticulosCarrito
    //   }
    // }))
    setTotal((descuento > 0 ? (price - ((price * descuento) / 100)) : price) * qty)
  }, [ArticulosCarrito]);



  return (
    <div className="box control">
      <Collection object >
        <Input type="hidden" name="id" value={id} />
        <Input type="hidden" name="codigo" value={codigo} />
        {/* <div className="card"> */}

        <div className="columns is-desktop is-tablet">
          <div className="column">
            <div className="card-image">
              <figure className="image is-4by3">
                {Imagen}
              </figure>
            </div>
          </div>
          <div className="column">
            <div className="card-content">
              <div className="media">
                {/* <div className="media-left">
                  <figure className="image is-64x64">
                    <ImgViewer imgSrc={imagen} noToolbar={true} zIndex={1500} maxWidth={40} maxHeight={50} />
                  </figure>          
                </div> */}
                <div className="media-content">
                  <p className="subtitle is-6">
                    {`SKU: ${id}`}
                    <br />
                    {`Código Barras: ${codigo}`}
                  </p>
                  <p className="title is-5">{desc}</p>
                  <p className="subtitle is-6">
                    {`Precio: `}
                    {descuento > 0 ? (
                      <>
                        <del style={{ position: 'relative', display: 'inline-block', color: '#c2c0c0' }}>{FormateoDinero.format(price)} </del>
                        <span style={{ color: 'red' }}>{FormateoDinero.format(price - ((price * descuento) / 100))}</span>
                      </>
                    ) : (
                      `${FormateoDinero.format(price)}`
                    )}
                  </p>
                  {/* {<p className="subtitle is-6">{`Descuento: ${descuento}`}</p> */}
                  {/* <p className="subtitle is-6">{`Existencia: ${stock}`}</p> */}
                  {!avoidCodigo && <div className="mb-2">
                    <label className="label is-small">{'Código (opcional):'}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code"
                      id="code"
                      value={codeDiscount}
                      onChange={(e) => updateCodeDiscount(e.target.value)}
                    />
                    {/* <Input
                      // onKeyDown={(e) => e.preventDefault()}
                      className="input is-small"
                      type='string'
                      name="code"
                      id="code"
                      value={codeDiscount}
                      onChange={updateCodeDiscount}
                    /> */}
                  </div>}
                  <div className="content">
                    <div className="field">
                      <label className="label is-small">Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        name="qty"
                        id="qty"
                        value={qty}
                        onChange={(e) => changeQtyItem(e.target.value)}
                      />
                      {/* <Input
                        onKeyDown={(e) => e.preventDefault()}
                        reducers={[preventNegativeQty, preventOutofStock]}
                        className="input is-small"
                        type="number"
                        name="qty"
                        id="qty"
                        value={qty}
                        onChange={changeQtyItem}
                      /> */}
                    </div>
                    <div className="columns">
                      <div className="column is-three-quarters">
                        <p className="is-size-6">{`Importe:`} {descuento > 0 ? (
                          <>
                            <del style={{ position: 'relative', display: 'inline-block', color: '#c2c0c0' }}>{FormateoDinero.format(total + ((price * descuento) / 100))} </del>
                            <span style={{ color: 'red' }}>{FormateoDinero.format(total)}</span>
                          </>
                        ) : (
                          `${FormateoDinero.format(total)}`
                        )}
                        </p>
                      </div>
                      <div className="column">
                        <button
                          type="button"
                          className="button is-small is-danger is-rounded"
                          onClick={() => onRemoveItem(id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        <Input
          className="input is-small"
          disabled
          type="hidden"
          name="imagen"
          readOnly
          value={imagen}
        />
        <Input
          className="input is-small"
          disabled
          type="hidden"
          name="stock"
          readOnly
          value={stock}
        />
        <Input
          className="input is-small"
          disabled
          type="hidden"
          name="desc"
          readOnly
          value={desc}
        />
        <Input
          className="input is-small"
          type="hidden"
          disabled
          name="price"
          readOnly
          value={(descuento > 0 ? (price - ((price * descuento) / 100)) : price)}
        />
        <Input
          className="input is-small"
          type="hidden"
          disabled
          name="id_estructura"
          readOnly
          value={id_estructura}
        />
        <Input
          className="input is-small"
          type="hidden"
          disabled
          name="descuento"
          readOnly
          id="descuento"
          value={descuento}
        />
        <Input
          className="input is-small"
          type="hidden"
          name="descuentoOriginal"
          id="descuentoOriginal"
          value={descuentoOriginal}
        />
        <Input
          className="input is-small"
          type="hidden"
          disabled
          name="precioOrg"
          readOnly
          value={price}
        />
      </Collection>
    </div>
  );
}
