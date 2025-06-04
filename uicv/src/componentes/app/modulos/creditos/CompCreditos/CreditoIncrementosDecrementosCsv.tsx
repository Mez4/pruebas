
import { ActionSelect, Card, CustomActionSelect, CustomFieldText2, CustomSelect, Spinner } from "../../../../global";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { FnReadCsvFile, getErrorParsed, IntCsvReader } from "../../../../../global/functions";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import withReactContent from "sweetalert2-react-content";
import * as Funciones from "./CreditoIncrementosDecrementosCsv/Funciones";
import { FaFilter } from "react-icons/fa";
import DataGridComp from "../../../../global/DataGrid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Form, Formik } from "formik";
import Swal from 'sweetalert2'
import * as Yup from 'yup'
import yup from "../../../../../global/yupLocale";



type CatalogosType = {
  oidc: IOidc
}

type IntLineaUpd = {
  ID: number,
  Monto: number
}

type IncrDecrState = {
  LineasList: any[]
  TableData: any[]
  Tipo: number,
  Error: boolean,
  Cargando: boolean,
  Enviando: boolean,
  OpenCreditos: boolean,
  OpenDispersion: boolean,
  Observaciones: string,
  ProductoID: number
}

type IncrDecr = { Tipo: number, ProductoID: number}
const initialFormValues: IncrDecr = { Tipo: 1, ProductoID: 1 }

const IncrementosDecrementosCsv = (props: CatalogosType) => {
  const MySwal = withReactContent(Swal)
  const fileInput = useRef<any>();
  const [state, setState] = useState<IncrDecrState>({
    LineasList: [],
    TableData: [],
    Tipo: 0,
    Error: false,
    Cargando: false,
    Enviando: false,
    OpenCreditos: false,
    OpenDispersion: false,
    Observaciones: "SIN OBSERVACIONES",
    ProductoID: 0

  })

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (ev) => {
    setIsChecked(ev.target.checked);
  };

  const [message, setMessage] = useState('');

  const FnHandleFileInput = (e) => {
    e.preventDefault()
    fileInput && fileInput.current.click()
  }
  

  const FnGetLineasActualizadas = () => {
    if (state.LineasList.length > 0) {
      setState(prev => ({ ...prev, Cargando: true }))
      const reqData = {
        LineasString: JSON.stringify(state.LineasList),
        Tipo: state.Tipo,
        ProductoID: state.ProductoID,
       
      }
      Funciones.FNGetNuevasLineas(props.oidc, reqData)
        .then(res => Array.isArray(res) && setState(prev => ({ ...prev, TableData: res })))
        .catch((error) => toast.error(getErrorParsed(error)))
        .finally(() => setState(prev => ({
          ...prev, Cargando: false
        })))
    }
  }


  const FnActualizarLineas = () => {
    setState(s => ({ ...s, Enviando: false }))
    
    MySwal.fire({
      icon: 'question',
      html: 
        <div>
        <h3 className="text-center"><strong>Aviso</strong></h3>
        <div className={`modal-body`}>
          {/* <Formik initialValues={state} onSubmit={()=>{}}> */}
            {/* {({ values , setValues })=> (<> */}
              {/* {setState(s => ({ ...values }))} */}
              <h5 className="text-center">¿Estás seguro de los cambios de linea? .</h5>
              <h6 className="text-center">Esta operación no se puede deshacer.</h6>

              {/*
               <div className="input-group">
                <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={'Observaciones'}>Observaciones</label> 
                <input 
                  type="text"  
                  name="Observaciones" 
                  value={values.Observaciones} 
                  onChange={(e) => {
                    setValues(s => ({ ...values, Observaciones: e.target.value }))
                  }} 
                  className="form-control" 
                  placeholder="SIN OBSERVACIONES"
                  autoFocus 
                />
              </div> */}

            {/* </>)} */}
          {/* </Formik> */}
        </div>
      </div>,
      confirmButtonText: `Aceptar`,
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: `#3085d6`,
      cancelButtonColor: 'red'
    }).then((value) => {
      if (value.isConfirmed) {
        const reqData = { LineasString: JSON.stringify(state.LineasList), Observaciones: state.Observaciones, Tipo: state.Tipo, ProductoID: state.ProductoID }
        Funciones.FnActualizarLineas(props.oidc, reqData)
          .then((respuesta: any) => {
            toast.success(respuesta.msj ?? "LINEAS DE CREDITO ACTUALIZADAS CORRECTAMENTE")
            if (respuesta.status == 1) setState(prev => ({ ...prev, LineasList: [], TableData: [] }))
          })
          .catch((error) => toast.error(getErrorParsed(error)))
          .finally(() => setState(s => ({
            ...s, Enviando: false
          })))
      }
      else
        setState(s => ({ ...s, Enviando: false, Observaciones: '' }))
    }).catch(() => setState(prev => ({ ...prev, Enviando: false, Observaciones: '' })));
  }

  const readCsvFile = (props) => {
    const extras: IntCsvReader = {
      consoleSheet: true,
      mutatorJson: (csvList: any[]) => {
        if (csvList.some(reg => !Object.keys(reg).includes('ID') || !Object.keys(reg).includes('MONTO')))
          return "El archivo debe tener las columnas ID y MONTO"
        return csvList
      }
    }

    FnReadCsvFile(props, extras)
      .then(res => Array.isArray(res) && setState(prev => ({ ...prev, LineasList: res })))
      .catch(err => toast.error(err))
  }

  const optionesProductos = [
    { value: 1, label: 'Seleccióne un producto'},
    { value: 38, label: 'PRINCIPAL'},
    { value: 60, label: 'P.PERSONAL'},
    { value: 39, label: 'TIENDITA'}
  ]

  React.useEffect(() => { FnGetLineasActualizadas() }, [state.LineasList, state.Tipo]);
  
  return (<>
    <input type="file" ref={fileInput} onChange={readCsvFile} className="d-none" accept=".csv,.xlsx,.xls" />
    <div className="row ">
      <div className="col-12">
        <Card>
          <TituloConSelector Titulo={'INCREMENTAR / DECREMENTAR LINEAS DE CREDITO'} />
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={initialFormValues}
                onSubmit={FnActualizarLineas}
                validationSchema={Yup.object().shape({
                  Tipo: Yup.number().required('Seleccióne la acción por favor'),
                  ProductoID: Yup.number().required('Seleccióne un producto'),
                })}
                
              >{({ values, setValues }) => (<>
                <Form>
                  <FilterTemplate>
                    <div className='column is-12-mobile is-12-tablet is-4-desktop'>
                      <ActionSelect
                        name={'Tipo'}
                        disabled={state.Cargando || state.Enviando}
                        label={"Acción"}
                        addDefault={false}
                        valor={values.Tipo}
                        options={[{ value: 1, label: 'Decrementar' }, { value: 2, label: 'Incrementar' }]}
                        accion={(val) => {
                          setValues({ ...values, Tipo: val })
                          setState({ ...state, Tipo: val - 1 })
                        }}
                      />
                    </div>
                   
                    <div className='column is-12-mobile is-12-tablet is-4-desktop'>
                       <ActionSelect
                        name={'ProductoID'}
                        disabled={state.Cargando || state.Enviando}
                        label={"Producto"}
                        addDefault={false}
                        valor={values.ProductoID}
                        options={optionesProductos}
                        accion={(val) => {
                        setValues({ ...values, ProductoID: val })
                        setState({ ...state, ProductoID: val })
                        }}
                        
                      />
                    </div>       
                    <div className='column is-12-mobile is-12-tablet is-4-desktop'>
                      <label >
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={handleCheckboxChange} 
                          />&nbsp;
                            De Clic Para Agregar Observaciones.
                          </label><br />
                          {isChecked && (
                          <input type="text" style={{ width: '357.817px', height: '38.2px', fontSize: '13px', position: 'absolute',top: '29.8%', left: '67%'}}  
                          value={state.Observaciones} onChange={e => setState(s => ({ ...s, Observaciones: e.target.value }))} className="form-control" placeholder="SIN OBSERVACIONES"/>
                          
                          )}
                    </div>     
            
                    <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
                      <button disabled={state.Cargando || state.Enviando} className="btn btn-primary btn-lg" onClick={FnHandleFileInput}>
                        Cargar Montos
                      </button>
                      <button disabled={state.Cargando || state.Enviando} className="btn btn-success btn-lg ml-2" type="submit" >
                        Actualizar montos
                      </button>
                    </div>
                  </FilterTemplate>

                </Form>
              </>)}</Formik>
            </Card.Body.Content>
            <div>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}

              {(!state.Cargando && !state.Error) && <DataGridComp data={state.TableData} />}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div >
  </>)
}

const TituloConSelector = ({ Titulo = '' }) => {
  return (<div className="col-12 is-flex is-flex-direction-row is-justify-content-space-between card-header">
    <h4 className="font-16 mt-2">{Titulo}</h4>
  </div>)
}



export const FilterTemplate = ({ children }) => {
  return (
    <div style={{
      backgroundColor: "#F0F0F0",
      padding: "1em",
      borderRadius: "15px",
    }}>
      <div><label><FaFilter /> FILTROS</label></div>

      <div style={{
        width: "100%",
        textAlign: "center",
        display: "inline-block",
      }}>
        <div className="columns is-left is-mobile is-multiline">
          {children}
        </div>
      </div>
    </div>)
}


const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(IncrementosDecrementosCsv);
