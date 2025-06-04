import { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, ModalWin, Spinner } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import { FiRefreshCcw } from 'react-icons/fi';
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin';
import CForm from './CreditoMonederoMecanicas/CForm'
import * as Funciones from './CreditoMonederoMecanicas/Funciones'

type CreditoMonederoCatalogoMecanicasType = {
    oidc: IOidc,
    ui: iUI
}

function CreditoMonederoCatalogoMecanicas(props: CreditoMonederoCatalogoMecanicasType) {
    const data: any[] = [];
    const datosEditar: {
        Descripcion: string,
        DistribuidorNivelId: number,
        MontoBase: number,
        MontoRecompensa: number,
        FechaInicio: Date | null,
        FechaFin: Date | null
    } = {
        Descripcion: "",
        DistribuidorNivelId: 0,
        MontoBase: 0,
        MontoRecompensa: 0,
        FechaInicio: null,
        FechaFin: null
    }

    const [state, setState] = useState({
        showModal: false,
        loading: false,
        datos: data,
        MecanicaID: 0,
        datosEditar: datosEditar,
        isUpdate: false
    })

    const Columns = useMemo(() => {
        const DetailColumns: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    width: "90px",
                    selector: 'MecanicaID',
                    center: true,
                    sortable: true,
                },
                {
                    name: 'Descripción',
                    selector: 'Descripcion',
                    center: true,
                    sortable: true,
                    cell: (props) => <span style={{ textAlign: 'center' }}>{props.Descripcion}</span>
                },
                {
                    name: 'Monto Base',
                    selector: 'MontoBase',
                    center: true,
                    sortable: true,
                    cell: (props) => <span>{props.MontoBase.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: 'Monto Recompensa',
                    selector: 'MontoRecompensa',
                    center: true,
                    sortable: true,
                    cell: (props) => <span>{props.MontoRecompensa.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: 'Fecha Inicio',
                    selector: 'FechaInicio',
                    center: true,
                    sortable: true,
                    cell: (props) => <span>{props.FechaInicio.split("T")[0]}</span>
                },
                {
                    name: 'Fecha Final',
                    selector: 'FechaFin',
                    center: true,
                    sortable: true,
                    cell: (props) => <span>{props.FechaFin.split("T")[0]}</span>
                },
                {
                    name: 'Acciones',
                    center: true,
                    sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                showModal: true,
                                MecanicaID: props.MecanicaID,
                                datosEditar: {
                                    Descripcion: props.Descripcion,
                                    DistribuidorNivelId: props.DistribuidorNivelId,
                                    FechaFin: new Date(props.FechaFin),
                                    FechaInicio: new Date(props.FechaInicio),
                                    MontoBase: props.MontoBase,
                                    MontoRecompensa: props.MontoRecompensa
                                },
                                isUpdate: true
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                }
            ]
        return DetailColumns
    }, [])

    function getDatos() {
        setState(s => ({ ...s, loading: true }))
        Funciones.FNGetMecanicas(props.oidc)
            .then((respuesta: any) => {
                setState(s => ({ ...s, loading: false, datos: respuesta.data, isUpdate: false }))
            })
            .catch(() => setState(s => ({ ...s, loading: false, datos: [], isUpdate: false })))
    }

    useEffect(() => {
        getDatos();
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="Catálogo de mecanicas">
                        <Card.Body>
                            <Card.Body.Content>
                                <DataTable
                                    subHeader
                                    subHeaderComponent=
                                    {
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-group mb-3">
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => setState(s => ({ ...s, showModal: true }))}><FaPlus /></button>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={getDatos}><FiRefreshCcw /></button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    progressPending={state.loading}
                                    progressComponent={<Spinner />}
                                    columns={Columns}
                                    data={state.datos}
                                    pagination
                                />

                                <ModalWin open={state.showModal} large center>
                                    <ModalWin.Header>
                                        <h5 className={MODAL_TITLE_CLASS}>
                                            Agregar en el catálogo
                                        </h5>
                                        <button title='Cerrar' type="button" className="delete" onClick={() => {
                                            setState(s => ({ ...s, showModal: false, isUpdate: false }))
                                        }} />
                                    </ModalWin.Header>
                                    <ModalWin.Body>
                                        <CForm
                                            oidc={props.oidc}
                                            loading={state.loading}
                                            MecanicaID={state.MecanicaID}
                                            isUpdate={state.isUpdate}
                                            initialValues={state.datosEditar}
                                            fnCerrarModal={() => setState(s => ({ ...s, showModal: false, isUpdate: false }))}
                                            fnActualizar={() => getDatos()}
                                        />
                                    </ModalWin.Body>
                                </ModalWin>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoMonederoCatalogoMecanicas)