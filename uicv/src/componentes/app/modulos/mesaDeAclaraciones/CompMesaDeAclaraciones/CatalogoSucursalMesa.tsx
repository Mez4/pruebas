import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
// import * as Funciones from './CatalogoSucursalMesa/Funciones'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'
// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoSucursalMesa/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
//import { exists } from 'node:fs'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './CatalogoSucursalMesa/Funciones'
type CatalogosType = {
    Seguridad: IOidc
}
const CatalogoSucursalMesa = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    type operacionType = {
        MesaAclaracionID: number,
        tipoSucursal: [ //Sucursales
            {
                MesaSucursalID: number,
                Mesa: {
                    MesaAclaracionID: number,
                    NombreMesaAclaracion: string
                },
                tipoSucursal: {
                    SucursalID: number,
                    NombreSucursal: string
                },
                activa: boolean
            }
        ]
    }
    const SucursalesAsignadas: any[] = []
    const DatosDefectoCForm = { 
        MesaSucursalID: 0, 
        MesaAclaracionID: 0, 
        NombreMesaAclaracion: '', 
        SucursalesAsignadas: 
        [
            {
                MesaAclaracionID: 0,
                SucursalID: 0,
                NombreSucursal: '',
                Eliminado: false,
                Nueva: false,
                Existe: false
            }
        ]
    }
    const DatosDefecto = {
        MesaSucursalID: 0,
        MesaAclaracionID: 0,
        NombreMesaAclaracion: '',
        SucursalesAsignadas: [{
            MesaAclaracionID: 0,
            NombreMesaAclaracion: '',
            SucursalID: 0,
            NombreSucursal: '',
            Eliminado: false,
            Nueva: false,
            Existe: false
        }]
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsMesa: any[] = []
    const [state, setState] = React.useState({
        Habilitar: true, Datos, DatosMostrar, Filtro: '', nombre: '', Cargando: true, Error: false, DatosIniciales: SucursalesAsignadas,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            DatosIniciales: DatosDefectoCForm
        },
        SucursalesAsignadas,
        OptionsSucursal,
        OptionsMesa,
    })
    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        element.tipoSucursal = element.tipoSucursal
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        element.tipoSucursal = element.tipoSucursal
                    });
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }
    const activador = (valor: any) => {
        console.log("VALOR ITEM RECIBIDO , ", valor)
        console.log("STATE FORM", state.Form.Datos.SucursalesAsignadas)
        let index = state.Form.Datos.SucursalesAsignadas.findIndex((respuesta: any) => {
            return respuesta.SucursalID === valor.SucursalID
        })
        console.log("INDEX SUCURSAL", index)
        state.Form.Datos.SucursalesAsignadas[index].Eliminado = !valor.Eliminado
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }
        }))
    }
    const Columns: IDataTableColumn[] =
        [
            { name: 'Id', selector: 'MesaSucursalID', sortable: false, width: '10%', },
            { name: 'Mesa Aclaración', selector: 'NombreMesaAclaracion', sortable: false, width: '40%', cell: props => <span className='text-center'> {props.NombreMesaAclaracion} </span> },
            { name: 'Sucursales Asignadas', selector: 'CantidadSucursalesAsignadas', sortable: false, width: '40%', },
            { name: 'Acciones', sortable: false, width: '10%',
                cell: (props) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        console.log("PROPS SUCURSALES ,", props.SucursalesAsignadas)
                        let nuevo = {
                            MesaSucursalID: props.MesaSucursalID,
                            MesaAclaracionID: props.MesaAclaracionID,
                            NombreMesaAclaracion: props.NombreMesaAclaracion,
                            SucursalesAsignadas: props.SucursalesAsignadas,
                        }
                        setState(s => ({
                            ...s,
                            Form: {
                                ...s.Form,
                                Mostrar: true,
                                Datos: nuevo,
                                Id: props.MesaSucursalID,
                            }
                        }))
                        console.log("DESPUES DE STATE ,", state.Datos)
                    }}>
                    <FaPencilAlt />
                </button>
            },
        ]
    const agregarSucursales = (item: any, Id?: any) => {
        console.log("ITEM SUCURSAL ", item)
        let existe = state.Form.Datos.SucursalesAsignadas.find((respuesta: any) => {
            return parseInt(respuesta.SucursalID) === parseInt(item.SucursalID)
        })
        if (item.SucursalID != 0) {
            if (existe === undefined) {
                state.Form.Datos.SucursalesAsignadas.push(item)
                setState(s => ({
                    ...s, Form: {
                        ...s.Form, Datos: state.Form.Datos
                    }
                }))
            }
        }
    }
    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetMesaAclaracion()
            FnGetSucursal()
            FNGetLocal()
        }
        return () => {
            isMounted.current = false
        }
    }, [])
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }, [state.Datos, state.Filtro])
    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    MesaSucursalID: 0,
                    MesaAclaracionID: 0,
                    NombreMesaAclaracion: '',
                    SucursalID: 0,
                    Activa: false,
                    SucursalesAsignadas: [],
                }
            }
        }))
        FNGetDatos();
    }
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        console.log("Antes de update")
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    MesaSucursalID: 0,
                    MesaAclaracionID: 0,
                    NombreMesaAclaracion: '',
                    SucursalesAsignadas: [],
                }
            }
        }))
        console.log("Despues de update", Datos)
        FNGetDatos();
    }
     //MUESTRA LAS SUCURSALES EN EL SELECT
    const FnGetSucursal = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursales(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursal = respuesta.map((valor: any) => {
                        var obj = { value: valor.SucursalID, label: valor.Nombre };
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
    //MUESTRA LAS MESAS DE ACLARACION EN EL SELECT
    const FnGetMesaAclaracion = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetMesaAclaracion(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var mesa = respuesta.map((valor: any) => {
                        var obj = { value: valor.MesaAclaracionID, label: valor.NombreMesaAclaracion }; //mappeador de select
                        return obj
                    });
                    setState(s => ({ ...s, OptionsMesa: mesa }))
                    console.log("mesas sin sucursales asignadas", mesa)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMesa: [] }))
                }
            })
    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => {
        FNGetLocal();
        setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    }
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Sucursal Mesas de Aclaración">
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
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                setState({
                                                                    ...state, Form: {
                                                                        ...state.Form,
                                                                        Mostrar: true,
                                                                        Datos: {
                                                                            MesaSucursalID: 0,
                                                                            MesaAclaracionID: 0,
                                                                            NombreMesaAclaracion: '',
                                                                            SucursalesAsignadas: [],
                                                                        }, Id: undefined
                                                                    }
                                                                })
                                                            }}
                                                        ><FaPlus /></button>
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
                                        keyField={"MesaAclaracionID"}
                                        defaultSortField={"MesaAclaracionID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}> {state.Form.Id != null ? "Editar sucursales asignadas" : "Agregar sucursales a una mesa"} </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                activador={activador}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                agregarSucursales={agregarSucursales}
                                                fnCancelar={fnCancelar}
                                                optionsSucursal={state.OptionsSucursal}
                                                optionsMesa={state.OptionsMesa}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoSucursalMesa)