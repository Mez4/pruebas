import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../CompBancos/CatalogoDispersiones/Funciones'
import { toast } from 'react-toastify'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from '../CompBancos/CatalogoDispersiones/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { BiCalendarEvent, BiFile, BiFileFind } from 'react-icons/bi'



type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoBancoBancos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        bancoID: 0,
        nombre: '',
        activo: true,
        denominacion: []
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsCaja: any[] = []
    const DatosTabla: any[] = []



    const [state, setState] = React.useState({
        Habilitar: true,
        Datos,
        DatosTabla,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        OptionsSucursal,
        OptionsCaja,
        startDate: null,
        endDate: null
    })

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {



                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetTable = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDenominaciones(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Cargando: false, Error: false, DatosTabla: respuesta }))
                    console.log(respuesta)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, DatosTabla: [] }))
                }
            })
    }

    const CambioFecha = (stri: any, strf: any) => {
        let data: any[] = []
        let fini: any = new Date(stri)
        let ffin: any = new Date(strf)

        console.log('fini: ', fini.valueOf())
        console.log('ffin: ', ffin.valueOf())

        if (fini.valueOf() === 0 && ffin.valueOf() === 0) {

            data = state.Datos

            setState(s => ({ ...s, DatosMostrar: data, startDate: null, endDate: null }))

        } else {

            if (fini.valueOf() > 0 && ffin.valueOf() === 0) {

                const filtro = function (obj: any) {
                    let date
                    let arr = obj.FechaCaptura.split("/")
                    date = new Date(arr[2], arr[1] - 1, arr[0]);
                    return (date.valueOf()) >= fini.valueOf();
                };

                data = state.Datos.filter(filtro);

                setState(s => ({ ...s, DatosMostrar: data, startDate: fini, endDate: null }))

            } else {

                if (fini.valueOf() === 0 && ffin.valueOf() > 0) {

                    const filtro = function (obj: any) {
                        let date
                        let arr = obj.FechaCaptura.split("/")
                        date = new Date(arr[2], arr[1] - 1, arr[0]);
                        return (date.valueOf()) <= ffin.valueOf();
                    };

                    data = state.Datos.filter(filtro);

                    setState(s => ({ ...s, DatosMostrar: data, startDate: null, endDate: ffin }))

                } else {

                    const filtro = function (obj: any) {
                        let date
                        let arr = obj.FechaCaptura.split("/")
                        date = new Date(arr[2], arr[1] - 1, arr[0]);
                        return (date.valueOf()) >= fini.valueOf() && (date.valueOf()) <= ffin.valueOf();
                    };

                    data = state.Datos.filter(filtro);

                    setState(s => ({ ...s, DatosMostrar: data, startDate: fini, endDate: ffin }))

                }
            }
        }
    }

    const FechaInicial = (fecha: any) => {

        CambioFecha(fecha, state.endDate)

    }

    const FechaFinal = (fecha: any) => {

        CambioFecha(state.startDate, fecha)

    }

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Datos: respuesta }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const FnGetSucursal = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursal(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var sucursal = respuesta.map((valor: any) => {
                        var obj = { value: valor.sucursalId, label: valor.sucursal };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsSucursal: sucursal }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsSucursal: [] }))
                }
            })
    }

    const FnGetCajas = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCaja(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var cajas = respuesta.map((valor: any) => {
                        var obj = { value: valor.cajaId, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCaja: cajas }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCaja: [] }))
                }
            })
    }

    // const FNFiltroSolicitudes = (id: any) => {

    //     setState(s => ({ ...s, Cargando: true }))
    //     Funciones.FNGetFiltroSolicitudes(props.Seguridad, id.value)
    //         .then((respuesta: any) => {
    //             if (isMounted.current === true) {
    //                 setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
    //             }
    //         })
    //         .catch(() => {
    //             if (isMounted.current === true) {
    //                 setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
    //             }
    //         })
    // }



    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'totalEfectivoCajaID', sortable: true, },
                { name: 'Clave', selector: 'catDenomEfectivo.clave', sortable: true, },
                { name: 'Concepto', selector: 'catDenomEfectivo.concepto', sortable: true, },
                { name: 'Valor Monetario', selector: 'catDenomEfectivo.valorMonetario', sortable: true, },
                { name: 'Cantidad', selector: 'cantidad', sortable: true, },
                { name: 'Total Efectivo', selector: 'totalXEfectivo', sortable: true, },
            ]
        return colRet
    }, [])


    React.useEffect(() => {
        FNGetLocal()
        FNGetTable()
        FNGetDatos()
        FnGetSucursal()
        FnGetCajas()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        toast.success('La cantidad de monedas se agregaron correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    bancoID: 0,
                    nombre: '',
                    activo: true,
                    denominacion: []
                }
            }
        })

        FNGetDatos()
    }



    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('Los datos de las monedas se actualizaron correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.bancoID === item.bancoID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    bancoID: 0,
                    nombre: '',
                    activo: true,
                    denominacion: []
                }
            }
        }
        ))

        FNGetDatos()
    }


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    const styles = {
        div: {
            background: "white",
            'border-style': 'none'
        }
    }

    return (
        <div className="row">
            <div className="col-12">

                <Card Title="Catalogo Dispersiones">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <div className="row text-end">
                                        <div className="col-10 input-group-text" style={styles.div}>
                                            <DatePicker className="ms-2 form-control input-group-text"
                                                selected={state.startDate}
                                                // selectsStart startDate={state.startDate} 
                                                endDate={state.endDate} isClearable
                                                placeholderText="Fecha Inicial"
                                                onChange={FechaInicial}
                                                locale="es"
                                                dateFormat="dd/MM/yyyy"
                                            /><span className="input-group-text"><BiCalendarEvent size="19px" /> </span>


                                            <DatePicker className="ms-2 form-control input-group-text"
                                                selected={state.startDate}
                                                // selectsStart startDate={state.startDate} 
                                                endDate={state.endDate} isClearable
                                                placeholderText="Fecha Final"
                                                onChange={FechaFinal}
                                                locale="es"
                                                dateFormat="dd/MM/yyyy"
                                            /><span className="input-group-text"><BiCalendarEvent size="19px" /> </span>

                                            <button className="ms-2 btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw size="20px" />Actualizar</button>
                                            <button className="btn btn-primary ms-2 " type="button"
                                                onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                            ><FaPlus size="20px" />Agregar</button>
                                            <button className="btn btn-secondary ms-2 " type="button"
                                            ><BiFileFind size="20px" />Ver archivo</button>

                                            <button className="btn btn-success ms-2 " type="button"
                                            ><BiFile size="20px" />Confirmar archivo</button>


                                            <button className="btn btn-warning ms-2 " type="button"
                                            ><FaPlus size="20px" />Fecha</button>


                                        </div>
                                        <div className="col-2 input-group-text" >
                                            <input type="text" className="form-control" placeholder="Buscar cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                            <span className="input-group-text"><FaSearch size="19px" /> </span>
                                        </div>



                                    </div>


                                    <DataTable
                                        subHeader


                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"bancoID"}
                                        defaultSortField={"bancoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} xlarge={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>

                                                {state.Form.Id ? "Cantidades Monetarias por Caja" : "Cantidades Monetarias por Caja"}

                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                DatosTabla={state.DatosTabla}
                                                fnCancelar={fnCancelar}
                                                optionsSucursal={state.OptionsSucursal}
                                                optionsCajas={state.OptionsCaja}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>



                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBancoBancos)