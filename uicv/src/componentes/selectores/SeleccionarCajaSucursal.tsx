import React, { Fragment } from "react";

import * as Yup from "yup";
import { connect } from "react-redux";
import { IEstado } from "../../interfaces/redux/IEstado";
import { GetServerUrl } from "../../global/variables";
import { Link } from "react-router-dom";
import { Spinner, ActionSelect, CustomSwitchSelector } from "../global";
import { Formik, Form, useFormikContext } from "formik";
import { IOidc } from "../../interfaces/oidc/IOidc";
import {
  FaBackspace,
  FaCashRegister,
  FaFileContract,
  FaPencilAlt,
} from "react-icons/fa";

// import Section from "../global/Carrusel/Section";
// import Simple from "../global/Carrusel/Simple";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import SwitchSelector from "react-switch-selector";
// import { Carousel } from 'react-responsive-carousel';
// import "./styles.css";
import axios from "axios";
import { toast } from "react-toastify";

type CFormType = {
  oidc: IOidc;
  initialValues: {
    ProductoID: number;
    SucursalID: number;
    CajaID: number;
  };
  optSucursales: { value: number; label: string }[];
  cbAceptar(item: any): any;
  // fnCancelar(): any,
};

const SeleccionarCajaSucursal = (props: CFormType) => {
  // console.log('props: ', props)
  const [loading, setLoading] = React.useState(false);

  const Cajas: { label: string; value: number }[] = [
    { label: "Sin Cajas", value: 0 },
  ];

  const [state, setState] = React.useState({
    Cajas,
  });
  // const [Cajas, setCajas] = React.useState([])

  // METODO PARA COMPROBAR SI LA CAJA ESTA CERRADA
  const checkBox = async (Id: number, values: any) => {
    // SE EMPIEZA CON LA PETICION DE OBTENER LA CAJA
    await axios
      .get(`${GetServerUrl()}SOMA/CatCajaRest/checkcaja/${Id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.oidc.user.access_token}`,
        },
      })
      .then((res: any) => {
        // SI EL STATUS QUE RECIBIMOS ES UN VERDADERO, LE ASIGNAMOS LA INFORMACION A LA MISMA VARIABLE
        res.data.status
          ? (res = res.data.data)
          : console.log("No se encontro la caja");
        // ACCEDEMOS AL DATO "CERRADA", PREGUNTAMOS SI LLEGA UN BOOLEANO
        if (res.Cerrada) {
          // SI ENTRA, MOSTRARA UN MENSAJE INFORMATIVO INDICANDO QUE NO PUEDE CONTINUAR
          toast.info("La caja se encuentra cerrada");
        } else {
          // ACCEDERA Y PERMITIRA ENTRAR AL SIGUIENTE FORMULARIO
          setLoading(true);
          props.cbAceptar(values);
        }
      })
      .catch((err) => {
        // EN CASO DE CUALQUIER ERROR, SE MUESTRA UN MENSAJE
        toast.error("No se pudo obtener las cajas");
      });
  };
  const cbSucursal = (SucursalID: any) => {
    setLoading(true);

    setState((s) => ({ ...s, Cajas: [{ label: "Sin Cajas", value: 0 }] }));
    //COMPROBAMOS SI LA CAJA ESTA CERRADA

    axios
      .post(
        `${GetServerUrl()}SOMA/CajasUsuarios/getbysucursal`,
        { SucursalID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        var cajas = respuesta.data.map((item: any) => {
          var obj = {
            label: (
              <div className="columns is-vcentered is-mobile is-multiline">
                <div className="column is-half-desktop is-half-mobile is-half-tablet is-align-items-center ">
                  <FaCashRegister size={"5em"} />
                </div>
                <div className="column mt-3 mb-3 is-half-desktop is-half-mobile is-half-tablet is-align-items-center ">
                  <p className="title is-5">{item.Nombre}</p>
                  <label className="form-label mb-0">{`Id: ${item.CajaID}`}</label>
                  <br />
                  {/* <lagetbysucursalbel className="form-label mb-0">{`Cuenta: ${(item.NumeroCuenta != null) ? item.NumeroCuenta : "N/A"}`}</label><br /> */}
                  <label className="form-label mb-0">{item.Descripcion}</label>
                </div>
              </div>
            ),
            value: item.CajaID,
            // selectedBackgroundColor: "green",
            // selectedFontColor: "#FFFFFF",
          };
          return obj;
        });
        // console.log('cajas: ', cajas)
        setState((s) => ({ ...s, Cajas: cajas }));

        setLoading(false);

        // console.log('cajas: ', cajas)
      })
      .catch(() => {
        setState((s) => ({ ...s, Cajas: [] }));
      });
  };

  React.useEffect(() => {
    // console.log("ENTRO EN USE EFFECT", props.initialValues.SucursalID)
    if (props.initialValues.SucursalID > 1) {
      cbSucursal(props.initialValues.SucursalID);
    }
  }, [props.initialValues.SucursalID > 1]);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
        SucursalID: Yup.number()
          .required("Seleccione la Sucursal")
          .moreThan(0, "Seleccione la Sucursal"),
        CajaID: Yup.number()
          .required("Seleccione la Caja")
          .moreThan(0, "Seleccione la Caja"),
      })}
      onSubmit={(values: any) => {
        console.log(values);
        // toast.info("Hola")
        checkBox(values.CajaID, values);
        // console.log(check);
        // setLoading(true)

        // props.cbAceptar(values)
      }}
    >
      {({ values }) => (
        <Form>
          <ActionSelect
            disabled={loading}
            label="Sucursal"
            name="SucursalID"
            placeholder="Seleccione la sucursal"
            options={props.optSucursales}
            addDefault={false}
            valor={values.SucursalID}
            accion={cbSucursal}
            // ref={refSucursal}
          />
          <hr className={"mt-1 mb-3"} />
          <label style={{ fontSize: ".8em" }}>
            <span style={{ color: "red" }}>*</span> Selecciona la sucursal para
            cargar las cajas a las que se tiene acceso.
          </label>
          <hr className={"mt-1 mb-3"} />
          <Fragment>
            <label className="form-label mb-0" htmlFor={"CajaBox"}>
              {"Cajas"}
            </label>
            <div className="box" id="CajaBox">
              {loading && <Spinner />}
              {!loading && (
                <>
                  <CustomSwitchSelector
                    name="CajaID"
                    valor={values.CajaID}
                    options={state.Cajas}
                    disabled={loading}
                  />
                </>
              )}
            </div>
          </Fragment>
          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button> */}
              <Link
                to={"/app"}
                className="ms-2 layout-topbar-span"
                title={"Volver al inicio"}
                style={{ color: "#FF0000" }}
              >
                <FaBackspace size={18} style={{ width: "25px" }} />
                <span className="p-ml-2">Salir</span>
              </Link>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <button
                type="submit"
                className="ms-2 btn btn-success waves-effect waves-light" //onClick={(e: any) => props.cbAceptar(values)}
              >
                Aceptar
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeleccionarCajaSucursal);
