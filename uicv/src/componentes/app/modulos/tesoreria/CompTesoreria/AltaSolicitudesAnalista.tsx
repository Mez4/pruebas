import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './AltaSolicitudesAnalista/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
// import { FiltarDatos } from '../../../../global/'
import { CForm } from './AltaSolicitudesAnalista/CForm'
import Select from 'react-select'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'


type CatalogosType = {
    Seguridad: IOidc
}

const AltaSolicitudAnalista = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        solicitudMCID: 0,
        usuario: '',
        analistaID: 0,
    }


    const OptionsAnalista: any[] = []
    const OptionsLog: any[] = []
    const OptionsEstatus: any[] = []

    const Datos: any[] = []
    const DatosMostrar: any[] = []
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
        OptionsAnalista,
        OptionsLog,
        OptionsEstatus
    })


    //Funcion para obtener los analistas y llenar la pantalla general.
    const FnGetAnalista = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetAnalistas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var analista = respuesta.map((valor: any) => {
                        var obj = { value: valor.usuarioId, label: valor.analista };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAnalista: analista }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAnalista: [] }))
                }
            })
    }

    //Funcion para traer los estaus de la solicitud
    const FnGetEstatusSolicitud = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetEstatusSolicitud(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var estatus = respuesta.map((valor: any) => {
                        let obj = { value: valor.estatusValidacionID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsEstatus: estatus }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsEstatus: [] }))
                }
            })
    }

    //Funcion para traer el log
    const FnGetLog = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetLog(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var log = respuesta.map((valor: any) => {
                        let obj = { value: valor.logID, label: valor.nota };///Checar con la API de Manuel
                        return obj
                    });
                    setState(s => ({ ...s, OptionsLog: log }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsLog: [] }))
                }
            })
    }
    // import React, { useState, useEffect } from 'react';


    //Funcion para traer los datos generales de la pantalla
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

    const FNFiltroSolicitudes = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetFiltroSolicitudes(props.Seguridad, id.value)
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


    //Llenado y dibujado de la pantalla principal
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID', selector: 'solicitudMCID', sortable: true, },
                { name: 'Producto', selector: 'producto', sortable: true, },
                { name: 'Fecha Registro', selector: 'fechaRegistro', sortable: true, },
                { name: 'Fecha Resolucion', selector: 'fechaResolucion', sortable: true, },
                { name: 'Sucursal', selector: 'sucursal', sortable: true, },
                { name: 'Nombre', selector: 'nombre', sortable: true, },
                { name: 'Estatus', selector: 'estatus', sortable: true, },
                { name: 'Usuario Sucursal', selector: 'usuarioRegistra', sortable: true, },
                { name: 'Analista', selector: 'analista', sortable: true, },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        solicitudMCID: props.solicitudMCID,
                                        usuario: props.usuarioRegistra,
                                        analistaID: props.analistaID
                                    },
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FnGetAnalista()
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnGetEstatusSolicitud()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false, Datos: {
                    solicitudMCID: 0,
                    usuario: '',
                    analistaID: 0,
                }
            }
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.solicitudMCID === item.solicitudMCID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false, Datos: {
                    solicitudMCID: 0,
                    usuario: '',
                    analistaID: 0
                }
            }
        })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="mt-lg-5 p-3">
                <Card Title="Administración de Solicitudes Analista">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-9">
                                                        <div>
                                                            <Select
                                                                className="form-select"
                                                                options={state.OptionsEstatus}
                                                                placeholder="Selecciona"
                                                                onChange={(value: any) => { FNFiltroSolicitudes(value) }}
                                                            />
                                                        </div>

                                                        &nbsp;

                                                        <input type="text" className="form-control" placeholder="Búsqueda" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/**  <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>*/}
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"solicitudMCID"}
                                        defaultSortField={"solicitudMCID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Tipo de Aval" : "Asignar Nuevo Analista"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                Id={state.Form.Id}
                                                initialValues={state.Form.Datos}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                options={state.OptionsAnalista}
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

export default connect(mapStateToProps, mapDispatchToProps)(AltaSolicitudAnalista)