import React, { useRef, useState, useCallback, useEffect, useContext } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, ActionMultipleSelect, CartForm } from '../../../../../global'
//import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { filterArrayByValues } from '../../../../../../global/functions'
import * as Funciones from './Funciones'
import { CtxCreditoTiendita } from '../CreditoTienditaSocia/CreditoTienditaContext'


type CFormType = {
    oidc: IOidc
    // SucursalId: number,
    initialValues: {
        ArticulosIds: []
    },
    // cbActualizar(item: any): any,
    cbArticles(values: any): any,
    fnCancelar(): any,
    // FnGetSucursales?(id: any): any,
    optArticulos: { value: number, label: string }[]
    articulos: { id: number, sku: number, codigo: string, qty: number, desc: string, price: number, stock: number, imagen: string, id_estructura: number, descuento: number }[],
    articles: any[],
}

export const CForm = (props: CFormType) => {
    const { ArticulosCarrito, setArticulosCarrito } = useContext(CtxCreditoTiendita);

    const [loading, setLoading] = useState(false)


    const [delItem, setDelItem] = useState(0)

    const sumbit = useRef<HTMLButtonElement>(null);

    const [sumbiting, setSumbiting] = useState(false)
    const [cart, setCart] = useState([]);

    const fnSetArticulos = (value: []) => {
        const arrayCarrito = props.articulos.filter(reg => !ArticulosCarrito.map(art => art.id).includes(reg.id))
            .map(reg => ({ ...reg, precioOrg: reg.price }))
        // console.log('M: SELECCIONO EL PRODUCTO', arrayCarrito, value, (filterArrayByValues(arrayCarrito, value, "id")))
        setArticulosCarrito(prev => [...filterArrayByValues(arrayCarrito, value, "id"), ...prev])

    }

    const fnGetItems = (value: any) => {
        // console.log('valueeeee cform',value)
        if (value.cart.items) {
            console.log("M: CART VALUE SENT", value.cart)
            setCart(value.cart);
            setSumbiting(true);
        } else {
            toast.error("No ha seleccionado ningun artículo")
        }
    }

    const fnCancelarArticulos = () => {
        // setArticulosIds([]);
        // setArticles([]);
        // setSumbiting(true);
        props.cbArticles({ cart: null });
    }

    useEffect(() => {
        if (sumbiting) {
            const btn: any = sumbit;
            btn.current.click()
        }
    }
        , [sumbiting]);

    // const removeItem = (idToRemove: number) => {
    //     console.log(ArticulosIds)
    //     let arr = ArticulosIds.filter((value: any) => value !== idToRemove)
    //     console.log(arr)
    // }

    const removeItem = useCallback((idToRemove) => {
        setDelItem(idToRemove)
        // setArticulosIds((prev) => prev.filter(({ id }) => id !== idToRemove))
    }
        , []);
    // console.log('cartttttttttt', cart)
    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    ArticulosIds: Yup.array()
                        .min(1, 'Seleccione al menos un artículo')
                    // .of(
                    //     Yup.object().shape({                            
                    //     value: Yup.number().required(),
                    //     label: Yup.string().required(),
                    //     })
                    // ),
                })}
                onSubmit={(values: any) => {

                    setLoading(true)


                    props.cbArticles({
                        ...values,
                        cart
                    });

                    // Funciones.FNAdd(props.oidc, {
                    //     ...values,
                    //     ProductoID: props.ProductoID,
                    //     DistribuidorID: props.DistribuidorID
                    // })
                    //     .then((respuesta: any) => {
                    //         setLoading(false)
                    //         props.cbGuardar(respuesta, values.SucursalesIds)
                    //         toast.success("Se guardó la relación de la sucursal con la comisión")
                    //     })
                    //     .catch((error: any) => {
                    //         console.log(JSON.stringify(error))
                    //         setLoading(false)
                    //         toast.error("Error al guardar la relación de la sucursal con la comisión")
                    //     })

                }}>
                <Form className='flex-grow-0'>
                    <ActionMultipleSelect
                        disabled={loading}
                        label="Artículos"
                        name="ArticulosIds"
                        placeholder="Seleccione el artículo"
                        options={props.optArticulos}
                        addDefault={false}
                        valor={props.initialValues.ArticulosIds}
                        delete={delItem}
                        // ref={refArticulos}
                        accion={fnSetArticulos}
                    />
                    <button type="submit" hidden ref={sumbit} />

                    {/* {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Aceptar
                            </button>
                        </div>
                    } */}
                </Form>
            </Formik>
            {loading && <Spinner />}
            {!loading &&
                <CartForm articulos={ArticulosCarrito} removeItem={removeItem} sendItems={fnGetItems} fnCancel={fnCancelarArticulos} />
            }
        </>
    )
}
