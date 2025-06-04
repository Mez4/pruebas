import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../CompTesoreria/Corresponsales/Funciones'
import { toast } from 'react-toastify'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from '../CompTesoreria/Corresponsales/CForm'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

type CorresponsalesType = {
    Seguridad: IOidc
}

const Corresponsales = (props: CorresponsalesType) => {
    let isMounted = useRef(true)
    const DatosDefecto = {
        CorresponsalID: 0,
        Nombre: '',
        TipoConciliacion: '',
        TipoComisionID: 0,
        MontoFijo: 0,
        MontoCorte: 0,
        Activo: true
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = useState({
        Habilitar: true,
        Datos,
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
        TipoComision: [
            {
                label: '',
                value: 0
            }
        ]
    })

    //Funcion para obtener los datos generales
    const FNObtenerCorresponsales = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNObtenerCorresponsales(props.Seguridad)
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
        
        if(!state.Error) {
            Funciones.FNObtenerCorresponsalesTipo(props.Seguridad)
                .then((respuesta: any) => {
                    const options = respuesta.map(e => {
                        return {label: e.TipoComision, value: e.TipoComisionID}  
                    })
                    setState(s => ({ ...s,Cargando: false, TipoComision: options }))
                })
                .catch(()=>{
                    setState(s => ({ ...s,Cargando: false, TipoComision: [] }))
                })
        }
    }

    const cbGuardar = (item:any) => {
        toast.success('El corresponsal se agrego correctamente');
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } });
    }

    const cbActualizar = (item : any) => {
        toast.success('El corresponsal se actualizó correctamente');
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.CorresponsalID === item.CorresponsalID ? item : Dato),
            Form: {
                ...state.Form, 
                Mostrar: false, 
                Datos: DatosDefecto
            }
        })

        FNObtenerCorresponsales();
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    //Funcion para pintar la pantalla principal
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CorresponsalID', sortable: true, },
                { name: 'Nombre', selector: 'Nombre', sortable: true, },
                { name: 'Tipo conciliacion', selector: 'TipoConciliacion', sortable: true, },
                { name: 'Tipo comision', selector: 'TipoComision', sortable: true, },
                { name: 'Monto fijo', selector: 'MontoFijo', sortable: true, },
                { name: 'Monto corte', selector: 'MontoCorte', sortable: true, },
                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                { name: 'Creado', selector: 'Creado', sortable: true, },
                { 
                    name: 'Modificado', 
                    selector: 'Modificado', 
                    sortable: true,
                    cell: (props) => <span>{props.Modificado ?? '-' }</span> 
                },
                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        CorresponsalID: props.CorresponsalID,
                                        Nombre: props.Nombre,
                                        TipoConciliacion: props.TipoConciliacion,
                                        TipoComisionID: props.TipoComisionID,
                                        MontoFijo: props.MontoFijo.replace("$","").replace(",","").split('.')[1] == '00' ? props.MontoFijo.replace("$","").replace(",","").split('.')[0] : props.MontoFijo.replace("$","").replace(",",""),
                                        MontoCorte: props.MontoCorte.replace("$","").replace(",","").split('.')[1] == '00' ? props.MontoCorte.replace("$","").replace(",","").split('.')[0] : props.MontoCorte.replace("$","").replace(",",""),
                                        Activo: props.Activo
                                    },
                                    CorresponsalID: props.CorresponsalID

                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    useEffect(() => {
        FNObtenerCorresponsales()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [props.Seguridad])

    useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <div className="row">
            <div className="col-12">

                <Card Title="Corresponsales">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Corresponsal" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNObtenerCorresponsales()}><FiRefreshCcw /></button>
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
                                        keyField={"CorresponsalID"}
                                        defaultSortField={"CorresponsalID"}
                                        columns={Columns}
                                    />
                                    <ModalWin xlarge={true} scrollable={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Datos.CorresponsalID ? 'Editar corresponsal' : 'Agregar Corresponsal'}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm 
                                                Seguridad={props.Seguridad}
                                                Id={state.Form.Datos.CorresponsalID}
                                                initialValues={state.Form.Datos}
                                                options={state.TipoComision}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbGuardar}
                                                fnCancelar={fnCancelar}
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

export default connect(mapStateToProps, mapDispatchToProps)(Corresponsales)