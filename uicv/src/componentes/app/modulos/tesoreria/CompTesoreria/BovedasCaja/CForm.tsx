import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DatePicker, { registerLocale } from "react-datepicker"
import DataTable from 'react-data-table-component'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { NombreMoneda: string, TipoCambio: number, Fecha?: Date, ClaveMonedaSat: string },
    //cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(op:any): any
    OpcionesMovimientos:{ value: number, label: string }[],
    DatosSaldoBoveda:{}
    DatosModalMovimientos:any[]
}

export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    const [tipoM, setTipoM] = React.useState("")

    const styles = {
        div: {
            'margin-top': '20px',
            border: '1px solid #c1c1c1',
        },

        h5: {
            width: '200px',
            'margin-top': '-12px',
            'margin-left': '7px',
            background: 'white'
        }
    }

    // Return the component
    return (
        <Formik
            initialValues={props.DatosSaldoBoveda}
            enableReinitialize
            validationSchema={Yup.object().shape({
                NombreMoneda: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(30, "Maximo 30 caracteres"),
                TipoCambio: Yup.number().required("Campo obligatorio"),
                Fecha: Yup.date().required("Seleccione la fecha de corte").nullable(),
                ClaveMonedaSat: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(3, "Maximo 3 caracteres"),
            })}
            onSubmit={(values: any) => {

            }}>
            <Form>
                <div className="row">
                    <div className="col-3">
                        <h5>Saldo en Bóveda</h5>
                    </div>
                    <div className="col-9">
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-3">
                        <CustomFieldText disabled={true} label="Billete" name="billetes" placeholder="Billete" />
                    </div>
                    <div className="col-3">
                        <CustomFieldText disabled={true} label="Moneda" name="monedas" placeholder="Moneda" />
                    </div>
                    <div className="col-3">
                        <CustomFieldText disabled={true} label="Total:" name="total" placeholder="Total" />
                    </div>
                    <div className="col-3">
                        <div className="mb-3" >

                            <label className="form-label mb-0" htmlFor={"fecha"}>Fecha</label>
                            <br />
                            <Field disabled={true} id={"fecha"} name={"fecha"}  >
                                {
                                    (control: any) => (
                                        <DatePicker
                                            className="form-control"
                                            selected={control.field.value}
                                            disabled={true}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("fecha", value)
                                            }}
                                            minDate={new Date}
                                            locale="es"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    )
                                }
                            </Field>
                            <ErrorMessage component="div" name={"fecha"} className="text-danger" />

                        </div>
                    </div>
                </div>
                <br />
                <div className="row" style={styles.div}>
                    <h5 style={styles.h5}>Consulta Bóveda</h5>
                    <DataTable
                        data={props.DatosModalMovimientos}
                        striped
                        pagination
                        dense
                        noHeader
                        responsive
                        defaultSortAsc
                        keyField={"movBovedaId"}
                        defaultSortField={"movBovedaId"}
                        columns={[
                            {
                                name: 'Folio',
                                selector: 'poliza.numero',
                                sortable: true,
                               

                            },
                            {
                                name: 'Movimiento',
                                selector: 'tipoMovimientoBoveda.descripcion',
                                sortable: true,
                            

                            },
                            {
                                name: 'Cajero(a)',
                                selector: 'poliza.usuario.nombre',
                                sortable: true,
                            

                            },
                            {
                                name: 'Caja',
                                selector: 'caja.nombre',
                                sortable: true,
                               

                            },
                            {
                                name: 'Billete',
                                selector: 'billete',
                                sortable: true,
                                

                            },
                            {
                                name: 'Moneda',
                                selector: 'moneda',
                                sortable: true,
                          

                            },
                            {
                                name: 'Estatus',
                                selector: 'poliza.estatus.descripcion',
                                sortable: true,
                            

                            }
                        ]}
                    />
                </div>
                <div className="row" style={styles.div}>
                   <div className="row">
                    <div className="col-6" ><br></br>
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"movimiento"}>Movimiento</label>
                            <Field name={"movimiento"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("movimiento", parseInt(value.target.value))
                                          let movimiento = props.OpcionesMovimientos.find((res:any)=>{
                                                return res.value === parseInt(value.target.value)
                                            })


                                            if(movimiento?.label === "Dotación Inicial"){
                                                setTipoM("Saldo Inicial de Caja")
                                            }else if(movimiento?.label === "Dotación Final"){
                                                setTipoM("Saldo Final de Caja")
                                            }else{
                                                setTipoM(movimiento?.label !== undefined ? movimiento.label:"")

                                            }

                                        }}
                                        disabled={false}
                                        id={"movimiento"}
                                        name={"movimiento"}
                                    >
                                        <option value="0">{"Selecciona un movimiento"}</option>
                                        {props.OpcionesMovimientos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>

                                )}
                            </Field>
                            <ErrorMessage component="div" name={"movimiento"} className="text-danger" />
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-3"><br></br>
                        {tipoM !== "" &&<h6>{tipoM}</h6>}
                    </div>
                    <div className="col-9"><br></br>
                        <hr />
                    </div>
                    <div className="col-4">
                        <CustomFieldText disabled={true} label="Caja" name="caja" placeholder="" />

                    </div>
                    <div className="col-4">
                        <CustomFieldText disabled={true} label="Billete" name="billete" placeholder="0.00" />

                    </div>
                    <div className="col-4">
                        <CustomFieldText disabled={true} label="Moneda" name="moneda" placeholder="0.00" />
                    </div>
                    <div className="col-12">
                        <hr />
                    </div>
                </div>
                </div>
                <br /><br></br>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={()=>{props.fnCancelar(2)}}>
                            Cerrar
                    </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                        <button type="button" className="ms-2 btn btn-primary waves-effect waves-light">Limpiar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}