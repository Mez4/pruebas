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
    ComisionesID: number,
    ComisionesDestinoID: number,
    fnCancelar(): any,
    isUpdate: boolean,
    OrigenData : any
}

export const CFormTraspasoTabuladorNivOrig = (props: CFormType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    const optComisionOrigen: any[] = []
    const optComisiones: any[] = []
    const optNiveles: any[] = []
    const optNivelesDestino: any[] = []
    const optComisionesD: any[] = [];
    const [state, setState] = React.useState({
      
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            SucursalId: undefined,
        },
        optComisionOrigen,
        optComisiones,
        optNiveles,
        optNivelesDestino,
        optComisionesD,
        
        isUpdate: false,
        NivelesDestinoIds: []
    })

    const FnGetComisionOrigen = () => {
        let Datos = {
            ComisionesID: props.ComisionesID,
            ProductoID : props.ProductoID
        }
        var destinos = props.OrigenData;
        var comisionDestino = destinos.map((valor : any) => {
            var obj = { value: valor.identifier, label : 'Producto '+ valor.Producto.Producto+ '- Tabulador: ' +  valor.Descripcion, ProductoID : valor.ProductoID};
            return obj;
        });
        Funciones.FNGetComisionOrigenNivel(props.oidc, Datos)
            .then((respuesta: any) => {
                var comisionOrigen = respuesta.map((valor: any) => {
                    var obj = { value: valor.ComisionesID, label: 'Producto: ' + valor.Producto + '- Tabulador: ' + valor.Descripcion };
                    return obj
                });
                setState(s => ({ ...s, optComisionOrigen: comisionOrigen, optComisionesD : comisionDestino }))
            })
            .catch(() => {
                setState(s => ({ ...s, optComisionOrigen: [] }))
            })
    }

    // const FnGetComisiones = () => {
    //     Funciones.FNGetComisionesOrigenNivel(props.oidc)
    //         .then((respuesta: any) => {
    //             var comisiones = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.ComisionesID, label: 'Producto: ' + valor.Producto + '- Tabulador: ' + valor.Descripcion };
    //                 return obj
    //             });
    //             setState(s => ({ ...s, optComisiones: comisiones }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optComisiones: [] }))
    //         })
    // }

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
            FnGetComisionOrigen()
            // FnGetComisiones()
            FnGetNiveles()
            FnGetNivelesDestino()
        }
        return () => {
            isMounted.current = false
        }
    }, [])

    return (
        <Formik
            initialValues={{props, identifier : ''}}
            enableReinitialize
            validationSchema={Yup.object().shape({
                identifier: Yup.number()
                    .required('Seleccione la Comisión Destino')
                    .moreThan(0, 'Seleccione la Comisión Destino'),
                    DistribuidorNivelID: Yup.number()
                    .required('Seleccione el Nivel Origen')
                    .moreThan(0, 'Seleccione el Nivel Origen'),
                    NivelesDestinoIds: Yup.array()
                    .min(1, 'Seleccione al menos un Nivel Destino')
            })}
            onSubmit={(values: any) => {
                setLoading(true)

                MySwal.fire({
                    title: '<strong>Traspaso de Comisiones por Nivel Origen</strong>',
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
                Funciones.FNAddComisionesOrigen(props.oidc, {
                    ...values,
                    ProductoID: props.ProductoID,
                    ComisionesID: props.ComisionesID,
                    ComisionesDestinoID: values.identifier,
                    // DistribuidorNivelID: values.DistribuidorNivelID,
                    NivelesDestinoIds: values.NivelesDestinoIds,
                })
                    .then((respuesta: any) => {
                        props.fnCancelar()
                        setLoading(false)
                        toast.success(respuesta);
                    })
                    .catch((error: any) => {
                        if (error.response)
                        toast.error(`${error.response.data.msj}`);
                      else if (error.request) toast.error(`Request ${error}`);
                      else toast.error(`${error}`);
                      setLoading(false);
                    })
            }
            // setLoading(false);
        })
        }}>
            {({ values }) => (
            <Form>
                 <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <ActionSelect
                            disabled 
                            label="Comisión Origen"
                            name="ComisionOrigenID"
                            placeholder="Seleccione la sucursal"
                            options={state.optComisionOrigen}
                            addDefault={false}
                            valor={values.props.ComisionesID}
                        />
                    </div>
                <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                    <ActionSelect
                        disabled={loading || props.isUpdate} 
                        label="Comisión Destino"
                        name="identifier"
                        placeholder="Seleccione la Comisión Destino"
                        options={state.optComisionesD}
                        addDefault={false}
                        valor={values.identifier}
                    /> 
                </div>
                <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                <ActionSelect
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
