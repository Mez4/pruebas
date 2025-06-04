import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, ActionMultipleSelect, CustomSelect, ActionSelect, CustomSelect2 } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { FNGetCondicionesOrigenNivel } from './Funciones';

type CFormType = {
    oidc: IOidc
    ProductoID: number,
    CondicionesID: number,
    CondicionesDestinoID: number,
    fnCancelar(): any,
    isUpdate: boolean,
}


export const CFormTraspasoTabuladorNivOrig = (props: CFormType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    const optCondicionOrigen: any[] = []
    const optCondiciones: any[] = []
    const optNiveles: any[] = []
    const optNivelesDestino: any[] = []

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
        optNivelesDestino,
        optNiveles,
        isUpdate: false,
        NivelesDestinoIds: []
    })


    const FnGetCondicionOrigen = () => {
        let Datos = {
            CondicionesID: props.CondicionesID
        }
        Funciones.FNGetCondicionOrigenNivel(props.oidc, Datos)
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

    
    const FnGetNiveles = () => {
        Funciones.FNGetNiveles(props.oidc)
            .then((respuesta: any) => {
                var niveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivelID + ' - ' + valor.DistribuidorNivel };
                    return obj
                });
                setState(s => ({ ...s, optNiveles: niveles }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNiveles: [] }))
            })
    }

    const FnGetCondiciones = () => {
        Funciones.FNGetCondicionesOrigenNivel(props.oidc)
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

    const FnGetNivelesDestino = () => {
        Funciones.FNGetNivelesDestino(props.oidc)
            .then((respuesta: any) => {
                var niveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivelID + ' - ' + valor.DistribuidorNivel };
                    return obj
                });
                setState(s => ({ ...s, optNivelesDestino: niveles }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNivelesDestino: [] }))
            })
    }

    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetCondicionOrigen()
            FnGetCondiciones()
            FnGetNiveles()
            FnGetNivelesDestino()
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
                    .moreThan(0, 'Seleccione la Condición Destino'),
                    DistribuidorNivelID: Yup.number()
                    .required('Seleccione el Nivel Origen')
                    .moreThan(0, 'Seleccione el Nivel Origen'),
                    NivelesDestinoIds: Yup.array()
                    .min(1, 'Seleccione al menos un Nivel Destino')
             
            })}
            onSubmit={(values: any) => {
                setLoading(true)

                MySwal.fire({
                    title: '<strong>Traspaso de Condiciones por Nivel Origen</strong>',
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
                Funciones.FNAddCondicionesOrigen(props.oidc, {
                    ...values,
                    ProductoID: props.ProductoID,
                    CondionesID: props.CondicionesID,
                    CondicionesDestinoID: values.CondicionesDestinoID,
                    DistribuidorNivelID: values.DistribuidorNivelID,
                    NivelesDestinoIds: values.NivelesDestinoIds,
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
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                <ActionSelect
                    disabled 
                    label="Condición Origen"
                    name="CondicionOrigenID"
                    placeholder="Seleccione la sucursal"
                    options={state.optCondicionOrigen}
                    addDefault={false}
                    valor={values.CondicionesID}
                />
                 </div>
                <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                 <ActionSelect
                    disabled={loading || props.isUpdate} 
                    label="Condición Destino"
                    name="CondicionesDestinoID"
                    placeholder="Seleccione la Condición Destino"
                    options={state.optCondiciones}
                    addDefault={false}
                    valor={values.CondicionesDestinoID}
                /> 
                </div>
                <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                <CustomSelect
                    disabled={loading || props.isUpdate} 
                    label="Nivel Origen"
                    name="DistribuidorNivelID"
                    placeholder="Seleccione el Nivel Origen"
                    options={state.optNiveles}
                    addDefault={false}
                /> 
                 </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                    <ActionMultipleSelect
                    disabled={loading || props.isUpdate} 
                    label="Nivel Destino"
                    name="NivelesDestinoIds"
                    placeholder="Seleccione el Nivel Destino"
                    options={state.optNivelesDestino}
                    addDefault={false}
                    valor={state.NivelesDestinoIds}
                /> 
                </div>
                {loading && <Spinner />}
                {!loading && (
                    <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile">
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                    </div>
                )}
            </div>
            </Form>
            )}
        </Formik>
    )
}
