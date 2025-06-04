import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
// import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios'
// import Credito from './Credito'
// import * as Funciones from './CreditoVale/Funciones'

import * as Funciones from "./Funciones";
// Icons
import { FaTicket } from 'react-icons/fa6'

// Custom components
import { Card, CustomFieldText, Spinner } from '../../../../../global'

import { FiRefreshCcw } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { stat } from 'fs'
import { Form } from 'usetheform'
import { Formik, FormikHelpers } from 'formik'
import yup from '../../../../../../global/yupLocale'
import { Distribuidores } from '../../../../../selectores'
import { GiTicket } from 'react-icons/gi'
import { GrMoney, GrStar, GrStarHalf, GrStarOutline, GrTicket } from 'react-icons/gr'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CatalogosType = {
    oidc: IOidc,
    SucursalId: number,
    cbArticles(values: any): any,
    ArticulosIds: any,
    Articles: any[],
    cbSucursal(values: any): any,
}

const Raspadito = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    // console.log('SucursalId', props.SucursalId)
    // const ArticulosIds: [] = []
    const DatosDefecto = {
        ArticulosIds: props.ArticulosIds
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    // const Articulos: any[] = []
    const optArticulos: any[] = []
    const optSucursales: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        DistribuidorID: 0,
        Monto: 0
        // CreditoID: 0
    })

    // const FNGetLocal = () => {

    //     setState(s => ({ ...s, Cargando: true }))
    // Funciones.FNGet(props.Seguridad)
    //     .then((respuesta: any) => {
    //         if (isMounted.current === true) {
    //             setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
    //         }
    //     })
    //     .catch(() => {
    //         if (isMounted.current === true) {
    //             setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
    //         }
    //     })
    // }
    const ActualizaSaldos = (DistribuidorId: number) => {

        setState(s => ({ ...s, DistribuidorID: DistribuidorId }))

    };
    const MySwal = withReactContent(Swal)

    const FNValida = () => {
        let obj = {
            DistribuidorID: state.DistribuidorID
        };
        Funciones.FNValidaBoleto(props.oidc, obj)
            .then((respuesta: any) => {
                // if (respuesta.regresa === 1) {
                //     toast.success(
                //       respuesta.RangoAsignado
                //     )
                // }
                MySwal.fire(
                    {
                        icon: 'success',
                        html: <div><br />
                            <h3 className="text-center">FELICIDADES</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">{respuesta.RangoAsignado} </h5>
                            </div>
                        </div>,
                        //timerProgressBar: true,
                        confirmButtonText: `Aceptar`,
                        allowOutsideClick: false,
                        //timer: 500,
                        /*  didOpen: () => {
                             MySwal.showLoading()
                         }, */
                    }
                );
            })
            .catch((error: any) => {
                if (error.response) toast.error(`Response : ${error.response.data}`);
                else if (error.request) toast.error(`Request ${error}`);
                else toast.error(`${error}`);
            });

    }

    const FNVerifica = (values: any) => {
        let obj = {
            DistribuidorID: state.DistribuidorID,
            Folio: values.Folio
        };
        Funciones.FNVerificaBoleto(props.oidc, obj)
            .then((respuesta: any) => {
                if (respuesta.MontoGanado != 0) {
                    setState(s => ({ ...s, Monto: respuesta.MontoGanado }))
                    MySwal.fire(
                        {
                            icon: 'success',
                            html: <div><br />
                                <h3 className="text-center">FELICIDADES GANASTE</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">${respuesta.MontoGanado} </h5>
                                </div>
                            </div>,
                            //timerProgressBar: true,
                            confirmButtonText: `Aceptar`,
                            allowOutsideClick: false,
                            //timer: 500,
                            /*  didOpen: () => {
                                MySwal.showLoading()
                            }, */
                        }
                    );
                }
                else {
                    MySwal.fire(
                        {
                            icon: 'error',
                            html: <div><br />
                                <h3 className="text-center">LO SENTIMOS</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">${respuesta.MontoGanado} </h5>
                                </div>
                            </div>,
                            //timerProgressBar: true,
                            confirmButtonText: `Aceptar`,
                            allowOutsideClick: false,
                            //timer: 500,
                            /*  didOpen: () => {
                                MySwal.showLoading()
                            }, */
                        }
                    );
                }
            })
            .catch((error: any) => {
                if (error.response) toast.error(`Response : ${error.response.data}`);
                else if (error.request) toast.error(`Request ${error}`);
                else toast.error(`${error}`);
            });

    }

    const FNCanjea = (values: any) => {
        console.log('Entrooooooooooooooooooooooooo', state.Monto)
        console.log('Entrooooooooooooooooooooooooo2', values.Folio)
        let obj = {
            DistribuidorID: state.DistribuidorID,
            Folio: values.Folio,
            Monto: state.Monto
        };
        if (state.Monto > 0) {


            Funciones.FNCanjeaBoleto(props.oidc, obj)
                .then((respuesta: any) => {
                    MySwal.fire(
                        {
                            icon: 'success',
                            html: <div><br />
                                <h3 className="text-center">EXITO</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">{respuesta.msj} </h5>
                                </div>
                            </div>,
                            //timerProgressBar: true,
                            confirmButtonText: `Aceptar`,
                            allowOutsideClick: false,
                            //timer: 500,
                            /*  didOpen: () => {
                                MySwal.showLoading()
                            }, */
                        }
                    );

                })
                .catch((error: any) => {
                    if (error.response) toast.error(`Response : ${error.response.data}`);
                    else if (error.request) toast.error(`Request ${error}`);
                    else toast.error(`${error}`);
                });
        }
        else {
            toast.error("MONTO INVALIDO, DE LO CONTRARIO VERIFIQUE DE NUEVO")
        }

    }




    // React.useEffect(() => {
    //     fnGetArticulos(String(props.SucursalId))
    // console.log('API_ConfiaShop: ', state.API_ConfiaShop)
    // }, [state.API_ConfiaShop])

    /** funcion Callback al agregar un item */
    const cbAgregar = (res: any) =>
        setState(s => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }))

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.SucursalId === item.SucursalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    return (
        <Formik
            initialValues={props.Articles}
            validationSchema={yup.object().shape({
                Folio: yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
            })}
            onSubmit={(values: any) => {


            }

            }



        >
            {({ values }) => (
                <Form
                >
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-9">
                            <Distribuidores
                                disabled={false}
                                SucursalID={0}
                                name={"DistribuidorId"}
                                WithProducto
                                RequiereSuc
                                cbAccion={(val) => {
                                    ActualizaSaldos(
                                        val
                                    );
                                }}
                            />

                        </div>
                        <button type="submit" className="btn btn-outline-secondary ms-2 waves-effect" style={{ fontSize: '1.2em', backgroundColor: 'lightpink', height: '40px', marginTop: '30px' }}
                            onClick={() => {
                                FNValida()
                            }}
                        >
                            <GrTicket size={'22px'} color='#EA15D0' />
                            &nbsp;Validar Boletos
                        </button>
                    </div>
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-4 text-center">
                        </div>
                        <div className="column is-4 text-center">
                            <CustomFieldText
                                disabled={false}
                                label="¡Ingresa el folio para verificar recompensas!"
                                name="Folio"
                                placeholder="Ingresa Folio"
                            />
                        </div>
                    </div>
                    <div className="columns is-desktop is-tablet text-center">
                        <div className="column is-4 text-center">
                        </div>
                        <button type="submit" className="btn btn-outline-secondary ms-2 text-center waves-effect" style={{ fontSize: '1.2em', backgroundColor: 'black', height: '40px', width: '250px', color: 'white', marginLeft: '100px' }}
                            onClick={() => {
                                FNVerifica(values)
                            }}
                        >
                            <GrStarOutline size={'22px'} color='white' />
                            &nbsp;Verificar Recompensa
                        </button>
                    </div>
                    <div className="columns is-desktop is-tablet text-center">
                        <div className="column is-9 text-center">
                            <CustomFieldText
                                disabled={true}
                                label=""
                                name="Folio"
                                placeholder=""
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-secondary ms-2 waves-effect" style={{ fontSize: '1.2em', height: '40px', marginTop: '30px' }}
                            onClick={() => {
                                FNCanjea(values)
                            }}
                        >
                            <GrMoney size={'22px'} color='#45FF20' />
                            &nbsp;Canjear
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Raspadito)