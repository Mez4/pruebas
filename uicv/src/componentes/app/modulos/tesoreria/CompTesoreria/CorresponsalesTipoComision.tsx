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
import { CForm } from '../CompTesoreria/CorresponsalesTipoComision/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

type CorresponsalesType = {
    Seguridad: IOidc
}

const Corresponsales = (props: CorresponsalesType) => {
    let isMounted = useRef(true)
    const DatosDefecto = {
        TipoComisionID: 0,
        TipoComision: '',
        TipoPorcentaje: false,
        TipoMontoFijo: false,
        TipoMontoCorte: false
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

    })

    //Funcion para obtener los datos generales
    const FNObtenerCorresponsalesTipo = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNObtenerCorresponsalesTipo(props.Seguridad)
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
        setState(s => ({ ...s, Cargando: true }))
    }

    const cbGuardar = (item:any) => {
        toast.success('El corresponsal se agrego correctamente');
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } });
    }

    const cbActualizar = (item : any) => {
        toast.success('La tipo de comision del corresponsal se actualizó correctamente');
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.TipoComisionID === item.TipoComisionID ? item : Dato),
            Form: {
                ...state.Form, 
                Mostrar: false, 
                Datos: DatosDefecto
            }
        })

        FNObtenerCorresponsalesTipo();
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    //Funcion para pintar la pantalla principal
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'TipoComisionID', sortable: true, },
                { name: 'Tipo comision', selector: 'TipoComision', sortable: true, },
                {
                    name: 'Porcentaje',
                    selector: 'TipoPorcentaje',
                    sortable: true,
                    cell: (props) => <span>{props.TipoPorcentaje ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Monto fijo',
                    selector: 'TipoMontoFijo',
                    sortable: true,
                    cell: (props) => <span>{props.TipoMontoFijo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Monto corte',
                    selector: 'TipoMontoCorte',
                    sortable: true,
                    cell: (props) => <span>{props.TipoMontoCorte ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form,
                                    Mostrar: true,
                                    Datos: {
                                        TipoComisionID: props.TipoComisionID,
                                        TipoComision: props.TipoComision,
                                        TipoPorcentaje: props.TipoPorcentaje,
                                        TipoMontoFijo: props.TipoMontoFijo,
                                        TipoMontoCorte: props.TipoMontoCorte
                                    }
                                }
                            })
                        )}}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    useEffect(() => {
        FNObtenerCorresponsalesTipo()

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

                <Card Title="Tipo comision">
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
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNObtenerCorresponsalesTipo()}><FiRefreshCcw /></button>
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
                                        keyField={"TipoComisionID"}
                                        defaultSortField={"TipoComisionID"}
                                        columns={Columns}
                                    />
                                    <ModalWin xlarge={true} scrollable={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Editar tipo corresponsal
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm 
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
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