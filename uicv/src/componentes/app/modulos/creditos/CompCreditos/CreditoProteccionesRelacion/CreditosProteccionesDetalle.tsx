import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '.././CreditoProteccionesRelacion/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { CForm } from '.././CreditoProteccionesRelacion/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import moment from 'moment'

type CatalogosType = {
    ProteccionIDDetalle: number
    ProteccionCabeceroDetalle: number
    oidc: IOidc,
    optProteccion: { value: number, label: string }[]
    Datos: any
    ProteccionCabeceroID: number
    ProteccionID: number,
    Head: any,
    Id?: number
}

const CreditoProteccionDetalle = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const ProteccionesIDS: [] = props.Head.ProteccionesIDS
    const DatosDefecto = {
        ProteccionCabeceroID: 0,
        ProteccionID: 0,
        ProteccionesIDS,
        ProteccionIDDetalle: 0

    }
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
            Id: undefined,
        },
        ProteccionIDDetalle: props.Id,
        ProteccionCabeceroID: props.ProteccionCabeceroID,
        ProteccionID: props.ProteccionID,
        optProteccion: props.optProteccion,
        isUpdate: false
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        console.log("ID", props.Id)
        console.log("CABECERO DETALLE", props.ProteccionCabeceroDetalle)
        let Datos = {
            ProteccionCabeceroDetalle: props.Id,
        }
        Funciones.FNGet(props.oidc, Datos)
            .then((respuesta: any) => {

                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    /*     const FNGetProtecciones = () => {
    
            setState(s => ({ ...s, Cargando: true }))
    
            Funciones.FNGet2(props.oidc)
                .then((respuesta: any) => {
                    // if (isMounted.current === true) {
                    let sucursales = respuesta.map((item: any) => item.SucursalId);
                    console.log(sucursales);
                    setState(s => ({
                        ...s, Cargando: false, Error: false, Datos: respuesta, Form: {
                            ...s.Form,
                        }
                    }))
                    // }
                })
                .catch(() => {
                    if (isMounted.current === true) {
                        setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                    }
                })
        } */

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID Detalle', selector: 'ProteccionIDDetalle', sortable: true },
                { name: 'ID Cabecero', selector: 'ProteccionCabeceroDetalle', sortable: true },
                { name: 'ID Paquete', selector: 'ProteccionDetalle', sortable: true },
                { name: 'Mínimo', selector: 'MinimoDetalle', sortable: true },
                { name: 'Máximo', selector: 'MaximoDetalle', sortable: true },
                { name: 'Monto', selector: 'MontoDetalle', sortable: true },
                { name: 'Distribuidor Nivel', selector: 'DistribuidorNivelDetalle', sortable: true },
                { name: 'Distribuidor Origen', selector: 'NivelOrigenDetalle', sortable: true },
                { name: 'Descripción', selector: 'DescripcionDetalle', sortable: true },
                { name: 'Usuario Captura', selector: 'NombreCapturaDetalle', sortable: true },
                { name: 'Fecha Captura', selector: 'FechaCapturaDetalle', sortable: true, }

            ]
        return colRet
    }, [])

    React.useEffect(() => {

        if (isMounted.current === true) {
            FNGetLocal()
            /*       FNGetProtecciones() */
        }
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
    const cbAgregar = (item: any) =>
        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProteccionDetalleID === item.ProteccionDetalleID && Dato.ComisionesID ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Relación Protecciones">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    {/*<div className="container">
                                        <div className="row">
                                             <div className="col-4">
                                                Proteccion
                                                <br />
                                                {props.Datos.Producto.Producto}
                                            </div>
                                            <div className="col-4">
                                                Proteccion Cabecero
                                                <br />
                                                {props.Datos.Descripcion}
                                            </div> 
                                            <div className="col-4"></div>
                                        </div>
                            </div>*/}
                                    <br />
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Protecciones" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button title='Agregar' className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined }, isUpdate: false })}
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
                                        keyField={"Id"}
                                        defaultSortField={"Id"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.Id) ? "Editar Relacion" : "Agregar Relación"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
/*                                                 ProteccionID={props.ProteccionID}
 */                                                ProteccionCabeceroID={props.Id}
                                                optProteccion={state.optProteccion}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                isUpdate={state.isUpdate}
                                                Actualizar={FNGetLocal}

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
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoProteccionDetalle)