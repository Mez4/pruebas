import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, ActionMultipleSelect, CustomSelect, ActionSelect, CustomSelect2 } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CFormType = {
    oidc: IOidc
    ProductoID: number,
    CondicionesID: number,
    fnCancelar(): any,
    isUpdate: boolean
}


export const CFormTraspasoTabulador = (props: CFormType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    const optCondicionOrigen: any[] = []
    const optCondiciones: any[] = []

    const [state, setState] = React.useState({
      
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            SucursalId: undefined,
        },
        optCondicionOrigen,
        optCondiciones,
        isUpdate: false
    })


    const FnGetCondicionOrigen = () => {
        let Datos = {
            CondicionesID: props.CondicionesID
        }
        Funciones.FNGetCondicionOrigen(props.oidc, Datos)
            .then((respuesta: any) => {
                var condicionOrigen = respuesta.map((valor: any) => {
                    var obj = { value: valor.CondicionesID, label: 'Producto: ' + valor.Producto + '- Tabulador: ' + valor.Descripcion };
                    return obj
                });
                setState(s => ({ ...s, optCondicionOrigen: condicionOrigen }))
            })
            .catch(() => {
                setState(s => ({ ...s, optCondicionOrigen: [] }))
            })
    }

    const FnGetCondiciones = () => {
        Funciones.FNGetCondiciones(props.oidc)
            .then((respuesta: any) => {
                var condiciones = respuesta.map((valor: any) => {
                    var obj = { value: valor.CondicionesID, label: 'Producto: ' + valor.Producto + '- Tabulador: ' + valor.Descripcion };
                    return obj
                });
                setState(s => ({ ...s, optCondiciones: condiciones }))
            })
            .catch(() => {
                setState(s => ({ ...s, optCondiciones: [] }))
            })
    }

    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetCondicionOrigen()
            FnGetCondiciones()
        }
        return () => {
            isMounted.current = false
        }
    }, [])

    return (
        <Formik
            initialValues={props}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CondicionesDestinoID: Yup.number()
                    .required('Seleccione la Condición Destino')
                    .moreThan(0, 'Seleccione la Condición Destino')
             
            })}
            onSubmit={(values: any) => {
                setLoading(true)

                MySwal.fire({
                    title: '<strong>Traspaso de Condiciones</strong>',
                    icon: 'question',
                    html:
                        <div className="text-center">
                            ¿Esta seguro de de realizar el traspaso? Una vez aceptado, los cambios no podrán ser recuperados
                        </div>,
                    showCloseButton: false,
                    showCancelButton: true,
                    showConfirmButton: true,
                    focusConfirm: false,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar',
                    confirmButtonAriaLabel: 'Aceptar',
                    cancelButtonAriaLabel: ''
                }).then((result) => {
                    if (result.isConfirmed) { 
                Funciones.FNAddCondiciones(props.oidc, {
                    ...values,
                    ProductoID: props.ProductoID,
                    CondionesID: props.CondicionesID,
                    CondicionesDestinoID: values.CondicionesDestinoID
                })
                    .then((respuesta: any) => {
                        props.fnCancelar()
                        setLoading(false)
                        toast.success(respuesta);
                    })
                    .catch((error: any) => {
                        if (error.response)
                        toast.error(`Response: ${error.response.data}`);
                      else if (error.request) toast.error(`Request ${error}`);
                      else toast.error(`${error}`);
                      setLoading(false);
                    })
            }
        })
        }}>
            {({ values }) => (
            <Form>
                <ActionSelect
                    disabled 
                    label="Condición Origen"
                    name="CondicionOrigenID"
                    placeholder="Seleccione la sucursal"
                    options={state.optCondicionOrigen}
                    addDefault={false}
                    valor={values.CondicionesID}
                />
                 <CustomSelect
                    disabled={loading || props.isUpdate} 
                    label="Condición Destino"
                    name="CondicionesDestinoID"
                    placeholder="Seleccione la Condición Destino"
                    options={state.optCondiciones}
                    addDefault={false}
                /> 
                {loading && <Spinner />}
                {!loading && (
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                )}
            </Form>
            )}
        </Formik>
    )
}
