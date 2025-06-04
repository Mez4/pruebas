import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, CustomSelect } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import { Form, Formik } from 'formik';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import yup from '../../../../../global/yupLocale';
import * as Funciones from './Referencias/Funciones'
import { FiRefreshCcw } from 'react-icons/fi';

type AsignarConveniosType = {
    oidc: IOidc,
    ui: iUI
}

function AsignarConvenios(props: AsignarConveniosType) {
    const [loading, setLoading] = useState(false);
    const [dataSucursal, setDataSucursal] = useState([]);
    const [dataConvenios, setDataConvenios]: any[] = useState([])

    const fnGetSucursal = () => {
        setLoading(true)
        setDataConvenios([])
        Funciones.FNGetSucursal(props.oidc)
            .then((respuesta: any) => setDataSucursal(respuesta))
            .catch(() => toast.error("Error al obtener los convenios"))
            .finally(() => setLoading(false))

        Funciones.FNGetConvenios(props.oidc)
            .then((respuesta: any) => {
                respuesta.map(element => {
                    console.log(element)
                    setDataConvenios(s => [...s, { label: `${element.CodigoConvenio} - ${element.NombreConvenio}`, value: element.ConvenioID }])
                });
            })
            .catch(() => toast.error("Error al obtener los convenios"))
            .finally(() => setLoading(false))
    }

    const fnAsignarConvenios = (values: { ConvenioID: string, SucursalID: string }) => {
        setLoading(true);
        Funciones.FNAsignarConvenios(props.oidc, { ConvenioID: values.ConvenioID, SucursalID: values.SucursalID })
            .then((respuesta: any) => {
                toast.success("Asignado correctamente")
            })
            .catch(() => toast.error("Error al obtener los convenios"))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fnGetSucursal();
    }, [])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Asignar Convenios">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={{ ConvenioID: "", SucursalID: "" }}
                                validationSchema={yup.object().shape({
                                    ConvenioID: yup.string().required("Campo obligatorio"),
                                    SucursalID: yup.string().required("Campo obligatorio"),
                                })}
                                onSubmit={(values: { ConvenioID: string, SucursalID: string }, { resetForm }) => {
                                    fnAsignarConvenios({ ConvenioID: values.ConvenioID, SucursalID: values.SucursalID });
                                    resetForm();
                                }}
                            >
                                <Form>
                                    <div className='columns is-desktop'>
                                        <div className="column is-5-desktop">
                                            <CustomSelect
                                                addDefault={false}
                                                options={dataConvenios}
                                                disabled={loading}
                                                label='Numero convenio'
                                                name='ConvenioID'
                                                placeholder='Seleccione el numero de convenio'
                                            />
                                        </div>
                                        <div className="column is-5-desktop">
                                            <CustomSelect
                                                addDefault={false}
                                                options={dataSucursal.map((item: any) => {
                                                    return { label: `${item.SucursalID} - ${item.Nombre}`, value: item.SucursalID }
                                                })}
                                                disabled={loading}
                                                label='Sucursal'
                                                name='SucursalID'
                                                placeholder='Seleccione la sucursal'
                                            />
                                        </div>
                                        <div className="column is-2-desktop" style={{ marginTop: 20, justifyContent: "space-between" }}>
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => {
                                                fnGetSucursal();
                                                if (dataSucursal.length > 0) toast.success("Datos obtenidos correctamente")
                                                else toast.error("Error al obtener la informacion")
                                            }}>
                                                <FiRefreshCcw />
                                            </button>

                                            <button className="btn btn-success" type="submit" >
                                                Asignar
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>

                            <DataTable
                                keyField='SucursalID '
                                data={dataSucursal}
                                columns={[
                                    { name: "ID", selector: "SucursalID", center: true, width: '10%' },
                                    { name: "Nombre Sucursal", selector: "Nombre", center: true },
                                    { name: "ConvenioID", selector: "ConvenioID", center: true }
                                ]}
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

export default connect(mapStateToProps, {})(AsignarConvenios)