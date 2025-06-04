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
    OrigenData : any,
    //initialValues: {
    //    ProductoID: 0,
    //    Descripcion: '',
    //    Activo: false,
    //    ConvenioID: 0
    //},
    //cbActualizar(item: any): any,
    //cbGuardar(item: any, values: any): any,
    fnCancelar(): any,
    
    //FnGetSucursales?(id: any): any,
    // optProductos: { value: number, label: string }[],
    // optCondiciones: { value: number, label: string }[],
    //optComisiones: { value: number, label: string }[],
    //optComisionOrigen: { value: number, label: string }[],
    isUpdate: boolean
}
// const  [origin , setOrigin] = React.useState([]);


export const CFormTraspasoTabulador = (props: CFormType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    const optComisionOrigen: any[] = []
    // const optComisiones: any[] = []
    // var optComisionesD: any = []
    const optComisionesD: any[] = []
    const [origins , setOrigins] = React.useState();
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
        // optComisiones,
        optComisionesD,
        // ProductoID: props.ProductoID,
        // ComisionesID: props.ComisionesID,
        isUpdate: false
    })

    const FnGetComisionOrigen = () => {
        
        
        let Datos = {
            ProductoID : props.ProductoID,
            ComisionesID: props.ComisionesID
        }
        var destinos = props.OrigenData;
        console.log(destinos);
        var destinoFiltro = {...destinos};
        // destinoFiltro = destinos.findIndex((obj : any) =>  obj.ComisionesID === Datos.ComisionesID && obj.ProductoID === Datos.ProductoID);
        // if (destinoFiltro !== -1) {
        //     destinos.splice(destinoFiltro, 1);
        //   }
        console.log(destinos);
        
        var comisionDestino = destinos.map((valor : any) => {
            var obj = { value: valor.identifier, label : 'Producto '+ valor.Producto.Producto+ '- Tabulador: ' +  valor.Descripcion, ProductoID : valor.ProductoID};
            return obj;
        });
        
        Funciones.FNGetComisionOrigen(props.oidc, Datos)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                    var comisionOrigen = respuesta.map((valor: any) => {
                        var obj = { value: valor.ComisionesID, label: 'Producto: ' + valor.Producto + '- Tabulador: ' + valor.Descripcion };
                        return obj
                    });
                console.log(destinos);
                
                setState(s => ({ ...s, optComisionOrigen: comisionOrigen, optComisionesD : comisionDestino}))
                // console.log(state.optComisionesD);
                
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optComisionOrigen: [] }))
                // }
            })
    }

    // const FnGetComisiones = () => {
    //     Funciones.FNGetComisiones(props.oidc)
    //         .then((respuesta: any) => {
    //             // if (isMounted.current === true) {

    //             var comisiones = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.ComisionesID, label: 'Producto: ' + valor.Producto + '- Tabulador: ' + valor.Descripcion };
    //                 return obj
    //             });

    //             setState(s => ({ ...s, optComisiones: comisiones }))
    //             // }
    //         })
    //         .catch(() => {
    //             // if (isMounted.current === true) {
    //             setState(s => ({ ...s, optComisiones: [] }))
    //             // }
    //         })
    // }


    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetComisionOrigen()
            // FnGetComisiones()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Formik
            initialValues={{props, identifier : ''}}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // ProductoID: Yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el producto'),
                // CondicionesID: Yup.number().required("Seleccione la condición").moreThan(0, 'Seleccione la condición'),
                // SucursalId: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal')
                identifier: Yup.number()
                    .required('Seleccione la Comisión Destino')
                    .moreThan(0, 'Seleccione la Comisión Destino')
                // .of(
                //     Yup.object().shape({                            
                //     value: Yup.number().required(),
                //     label: Yup.string().required(),
                //     })
                // ),
            })}
            onSubmit={(values: any) => {
                console.log(values);
                
                setLoading(true)

                MySwal.fire({
                    title: '<strong>Traspaso de Comisiones</strong>',
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
                console.log(values);
                
                Funciones.FNAddComisiones(props.oidc, {
                    ...values,
                    ProductoID: props.ProductoID,
                    ComisionesID: props.ComisionesID,
                    ComisionesDestinoID: values.identifier
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
                <ActionSelect
                    disabled //={props.isUpdate || loading}
                    label="Comisión Origen"
                    name="ComisionOrigenID"
                    placeholder="Seleccione la sucursal"
                    options={state.optComisionOrigen}
                    addDefault={false}
                    valor={values.props.ComisionesID}
                // accion={cbSucursal}
                // ref={refSucursal}
                />
                 <CustomSelect
                    disabled={loading || props.isUpdate} 
                    label="Comisión Destino"
                    name="identifier"
                    placeholder="Seleccione la Comisión Destino"
                    options={state.optComisionesD}
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
