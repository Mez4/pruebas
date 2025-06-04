import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, CustomFieldText } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import { Form, Formik } from 'formik';
import yup from '../../../../../global/yupLocale';
import * as Funciones from './Referencias/Funciones'
import { toast } from 'react-toastify';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { FaSearch } from 'react-icons/fa';

type ReferenciasType = {
    oidc: IOidc,
    ui: iUI
}

const FiltrarDatos = (data: any[], colums: IDataTableColumn[], filtro: string) => {

}

function Referencias(props: ReferenciasType) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filtro, setFiltro] = useState("");

    const Columns: IDataTableColumn[] = [
        { name: "Nombre", selector: "NombreCompleto", sortable: true, center: true },
        { name: "Referencia RPM", selector: "Referencia", sortable: true, center: true },
        // { name: "", center: true }
    ]


    useEffect(() => {
        Funciones.FNGetReferencias(props.oidc)
            .then((respuesta: any) => setData(respuesta))
            .catch(() => toast.error("Error!"))
        // const timer = setTimeout(() => {
        //     console.log(filtro);
        // }, 200);

        // return () => clearTimeout(timer);
    }, [/*filtro*/])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Generar Referencias">
                    <Card.Body>
                        <Card.Body.Content>
                            <DataTable
                                subHeader
                                data={data}
                                columns={Columns}
                                subHeaderComponent={
                                    <div className="row">
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control" placeholder="Buscar" value={filtro} onChange={e => setFiltro(e.target.value)} />
                                            <span className="input-group-text"><FaSearch /> </span>
                                        </div>
                                    </div>
                                }
                                pagination
                                noDataComponent={<p>No hay datos para mostrar</p>}
                            />
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

export default connect(mapStateToProps, {})(Referencias)