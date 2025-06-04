import React, { useEffect } from "react";
import { IDataTableColumn } from "react-data-table-component";
import { FaBars, FaDownload, FaEllipsisV, FaHome } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { IOidc } from "../interfaces/oidc/IOidc";

import { CSSTransition } from "react-transition-group";
import { Ripple } from "primereact/ripple";

import userManager from "../userManager";
import classNames from "classnames";
import { IMenu } from "../interfaces/ui/IMenu";
import { IProducto } from "../interfaces/seguridad/IProducto";
import { IModulo } from "../interfaces/seguridad/IModulo";
import { DBConfia_Seguridad } from "../interfaces_db/DBConfia/Seguridad";
import { IPersonaVW } from "../interfaces/catalogos/IPersonaVW";
import { IUsuarioOidc } from "../interfaces/oidc/IUsuarioOidc";
import { IPermiso } from "../interfaces/seguridad/IPermiso";
import { IPersona } from "../interfaces/oidc/IPersona";
import { IDireccionIP } from "../interfaces/seguridad/IDireccionIP";
import { IEstado } from "../interfaces/redux/IEstado";
import { iUI } from "../interfaces/ui/iUI";
import { Button } from "@mui/material";
import axios from "axios";
import { GetServerUrl } from "./variables";
const version = process.env.REACT_APP_VERSION;
type CatalogosType = {
  Seguridad: IOidc
}
// OnMenuItemClick
const onMenuItemClick = (
  event: React.MouseEvent,
  item: IMenu,
  index: number,
  activeIndex: number,
  setActiveIndex: (index: number) => any,
  onMenuItemClickLayout: () => void
): void => {
  // Avoid processing disabled items
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  // Validate if our index is the active index
  if (index === activeIndex) setActiveIndex(-1);
  else setActiveIndex(index);

  // Launch our menu Item Click
  if (item.to) onMenuItemClickLayout();
  else event.preventDefault();
};

const MenuContent = ({ item }: { item: IMenu }): JSX.Element => {
  // Get our subcombponents
  let submenuIcon = item.items && (
    <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
  );
  let badge = item.badge && (
    <span className="menuitem-badge">{item.badge}</span>
  );

  // Render our menu content
  return (
    <>
      <i className={item.icon}></i>
      <span>{item.label}</span>
      {submenuIcon}
      {badge}
      <Ripple />
    </>
  );
};

const MenuItem = ({
  item,
  index,
  activeIndex,
  setActiveIndex,
  onMenuItemClickLayout,
}: {
  item: IMenu;
  index: number;
  activeIndex: number;
  setActiveIndex(index: number): any;
  onMenuItemClickLayout(): any;
}): JSX.Element => {
  // If we have a link defined
  if (item.to)
    return (
      <Link
        to={item.to ?? "#"}
        className={`p-ripple ${index === activeIndex && "router-link-active router-link-exact-active"
          }`}
        onClick={(e) =>
          onMenuItemClick(
            e,
            item,
            index,
            activeIndex,
            setActiveIndex,
            onMenuItemClickLayout
          )
        }
      >
        <MenuContent item={item} />
      </Link>
    );

  // Else
  return (
    <a
      href={item.to}
      className="p-ripple"
      onClick={(e) =>
        onMenuItemClick(
          e,
          item,
          index,
          activeIndex,
          setActiveIndex,
          onMenuItemClickLayout
        )
      }
    >
      <MenuContent item={item} />
    </a>
  );
};

const AppSubmenu = ({
  menus,
  root,
  className,
  onMenuItemClickLayout,
}: {
  menus: IMenu[];
  root?: boolean;
  className: string;
  onMenuItemClickLayout(): any;
}) => {
  // Define the status
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  // Generate an item array
  let items =
    menus &&
    menus.map((item: any, i: number) => {
      let active = activeIndex === i;
      let styleClass = classNames(item.badgeStyleClass, {
        "layout-menuitem-category": root,
        "active-menuitem": active && !item.to,
      });

      if (root) {
        return (
          <li className={styleClass} key={i}>
            {root === true && (
              <React.Fragment>
                <div className="layout-menuitem-root-text">{item.label}</div>
                <AppSubmenu
                  menus={item.items ?? []}
                  onMenuItemClickLayout={onMenuItemClickLayout}
                  className={className}
                />
              </React.Fragment>
            )}
          </li>
        );
      } else {
        return (
          <li className={styleClass} key={i}>
            <MenuItem
              item={item}
              index={i}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onMenuItemClickLayout={onMenuItemClickLayout}
            />
            {/* renderLink(item, i) */}
            <CSSTransition
              classNames="layout-submenu-wrapper"
              timeout={{ enter: 1000, exit: 450 }}
              in={active}
              unmountOnExit
            >
              <AppSubmenu
                menus={item.items}
                onMenuItemClickLayout={onMenuItemClickLayout}
                className={className}
              />
            </CSSTransition>
          </li>
        );
      }
    });

  return items ? <ul className={className}>{items}</ul> : null;
};

export const Sidebar = ({
  items,
  onMenuItemClickLayout,
}: {
  items: IMenu[];
  onMenuItemClickLayout(): any;
}) => {
  return (
    <div className="layout-menu-container">
      <AppSubmenu
        menus={items}
        className="layout-menu"
        onMenuItemClickLayout={onMenuItemClickLayout}
        root={true}
      />
    </div>
  );
};

// Filtrar datos
export const FiltrarDatos = (
  Roles: any[],
  Columns: IDataTableColumn[],
  Filter: string
) => {
  // Return our filtered data
  return Roles.filter((d) => {
    // Iteramos las columnas
    for (let c of Columns) {
      // Check for undefined selector
      if (c.selector === undefined) continue;

      // Intentamos obtener el dato
      try {
        let colValue = String(d[c.selector as string]).toUpperCase();
        if (colValue.includes(Filter.toUpperCase())) {
          return true;
        }
      } catch {
        continue;
      }
    }
    return false;
  });
};

// Mostrar el TopMenu
type Menu = {
  Href?: string;
  label: any;

  Funcion?(...Parametros: any): any;
  Parametros?: any;

  Menus?: Menu[];
  Right?: boolean;

  Permiso?: string;
  PermisoRealm?: string;
};

/**
 * Detalle del menú
 */
type MenuBarraTituloTipo = {
  Titulo: JSX.Element | string;
  children: JSX.Element | JSX.Element[];
  badge?: string;
  badge_class?: string;
};

/**
 * Mostramos un menu en la barra de titulo
 * @param param Detalle del menú para mostrar
 */
export const MenuBarraTitulo = ({
  Titulo,
  children,
  badge,
  badge_class,
}: MenuBarraTituloTipo) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className="dropdown d-inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
      }}
      onClick={() => {
        if (open === true) setOpen(false);
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="btn header-item noti-icon waves-effect me-2"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {Titulo}
        {badge !== undefined && (
          <span
            className={`badge ${badge_class !== undefined ? badge_class : "bg-danger"
              } rounded-pill`}
          >
            3
          </span>
        )}
      </button>
      <div
        className={`dropdown-menu dropdown-menu-end ${open && "show"}`}
        style={{
          position: "absolute",
          margin: "0px",
          transform: "translate3d(-100px, 72px, 0px)",
          zIndex: 100,
        }}
        data-popper-placement="bottom-end"
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Tipo de la barra de titulo
 * @param param Funciones para la sidebar (interacción)
 */
type BarraTituloTipo = {
  // LayoutSate
  layoutColorMode: string;
  mobileTopbarMenuActive: boolean;

  // LAYOUT FUNCTIONS
  onToggleMenuClick(event: any): void;
  onMobileTopbarMenuClick(event: any): void;

  // Producto
  Producto?: IProducto;
  Modulo?: IModulo;
  Persona?: any;
  iUI: iUI;
  Seguridad: IOidc;
};
/**
 * Genera la barra de titulo
 * @param param Funciones para la sidebar (interacción)
 */
export const BarraTitulo = ({
  mobileTopbarMenuActive,
  onToggleMenuClick,
  onMobileTopbarMenuClick,
  Producto,
  Modulo,
  Persona,
  Seguridad,
  iUI,
}: BarraTituloTipo) => {
  return (
    <div className="layout-topbar">
      <span className="layout-topbar-logo">
        <span style={{ fontSize: "1em" }}>
          {" "}
          {Producto === undefined
            ? "Administración"
            : `${Producto.EmpresaNombre} / ${Producto.ProductoNombre}`}{" "}
          / <i className={`fa fa-${Modulo?.ModuloIcono}`} />{" "}
          {Modulo === undefined ? "UD" : Modulo.ModuloNombre}
        </span>
      </span>

      <span
        className="layout-menu-button layout-topbar-button"
        onClick={onToggleMenuClick}
      >
        <FaBars />
      </span>

      <div
        style={{
          flexGrow: 1,
          textAlign: "right",
          msFlexPositive: 3,
          order: 12,
        }}
      >
        <span style={{ fontSize: "1em", color: "white" }}>
          {" "}
          {Persona.length > 0
            ? "BIENVENIDO : " +
            ` ID: ${Persona[0].Id} - ${Persona[0].Nombre} ${Persona[0].ApellidoPaterno}`
            : "Sin Persona"}{" "}
          - Ver.{version} / BD: {iUI.DireccionIP}
        </span>

        <span
          className="layout-topbar-menu-button layout-topbar-button"
          onClick={onMobileTopbarMenuClick}
        >
          <FaEllipsisV />
        </span>
      </div>

      <ul
        className={classNames("layout-topbar-menu lg:flex origin-top", {
          "layout-topbar-menu-mobile-active": mobileTopbarMenuActive,
        })}
      >
        <li>
          <Link
            to={"/app"}
            className="layout-topbar-span"
            title={"Ver Perfil"}
            style={{ color: "#666666" }}
            onClick={onMobileTopbarMenuClick}
          >
            <FaHome size={18} style={{ width: "25px" }} />
            <span className="p-ml-2">Inicio</span>
          </Link>
        </li>
        <li>
          <hr className={"my-1"} />
        </li>
        <li>
          <Button
            className="layout-topbar-span"
            title={"Descargar Software Biometricos"}
            style={{ color: "#666666" }}
            onClick={() => {
              const url = `${GetServerUrl()}Sistema/Usuarios/obtenerBiometricos`;
              const token = Seguridad.user.access_token;

              axios
                .get(url, {
                  responseType: "blob", // Necesario para archivos binarios
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                })
                .then((response) => {
                  const blob = new Blob([response.data], { type: response.data.type });
                  const contentDisposition = response.headers["content-disposition"];
                  let filename = "Biometricos_CV.zip";

                  // Intentar obtener nombre del archivo del header
                  if (contentDisposition && contentDisposition.includes("filename=")) {
                    const match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match?.[1]) {
                      filename = match[1];
                    }
                  }

                  // Crear enlace y forzar la descarga
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = filename;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(link.href);
                })
                .catch((error) => {
                  console.error("Error al descargar el archivo:", error);
                  alert("Ocurrió un error al intentar descargar el software biométrico.");
                });
            }}
          >
            <FaDownload size={18} style={{ width: "25px" }} />
            <span className="p-ml-2" style={{ textTransform: "none" }}>Descargar Software Biometricos</span>
          </Button>
        </li>
        <li>
          <hr className={"my-1"} />
        </li>
        <li>
          <div
            title={"Salir"}
            className="layout-topbar-span"
            onClick={() =>
              userManager
                .revokeAccessToken()
                .then(() => {
                  userManager.removeUser();
                })
                .catch(() => {
                  console.warn("Error al cerrar sesion");
                })
            }
          >
            <RiLogoutBoxRFill size={20} style={{ width: "25px" }} />
            <span className="p-ml-2">Salir</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

/**
 * Genera la barra de menu de la aplicación
 * @param param Detalle del menu
 * @returns React.Component
 */
const GenerarMenu = ({
  Id,
  Menu,
  oidc,
  SubMenu,
  ParentId,
  Path,
}: {
  Id: number;
  Menu: Menu;
  oidc?: IOidc;
  Path: string;
  SubMenu: boolean;
  ParentId: number;
}) => {
  // Generamos un estado para manejar el estado
  const [activo, setActivo] = React.useState(false);

  // Validamos que tengamos acceso a OIDC
  if (oidc === undefined) return null;

  // Validamos si tenemos una funcion y submenu
  if (Menu.Funcion !== undefined) {
    // Si es un submenu
    if (SubMenu)
      return (
        <a
          onClick={() => {
            if (Menu.Funcion !== undefined)
              Menu.Funcion(Menu.Parametros as any);
          }}
          className="dropdown-item dropdown-toggle arrow-none"
          href="#/"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {Menu.label}
        </a>
      );

    // Si no es un submenu
    return (
      <li className="nav-item">
        <a href={"#/"} className="nav-link" onClick={Menu.Funcion}>
          {Menu.label}
        </a>
      </li>
    );
  } else if (Menu.Menus !== undefined && Menu.Menus.length > 0) {
    if (SubMenu)
      return (
        <div
          className={`dropdown ${(Path.indexOf(Menu.Href as string) >= 0 || activo) && "active"
            }`}
        >
          <a
            className={`dropdown-item dropdown-toggle arrow-none ${(Path.indexOf(Menu.Href as string) >= 0 || activo) && "active"
              }`}
            href="#/"
            id={`topnav-${ParentId}-${Id}`}
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={() => {
              setActivo(!activo);
            }}
          >
            <React.Fragment>{Menu.label}</React.Fragment>
            <div className="arrow-down"></div>
          </a>
          <div
            className="dropdown-menu"
            aria-labelledby={`topnav-${ParentId}-${Id}`}
          >
            {Menu.Menus.map((m, mId) => (
              <GenerarMenu
                Id={mId}
                Menu={m}
                ParentId={Id + ParentId}
                SubMenu={true}
                key={Id + ParentId + mId}
                oidc={oidc}
                Path={Path}
              />
            ))}
          </div>
        </div>
      );

    return (
      <li
        className={`nav-item dropdown ${(Path.indexOf(Menu.Href as string) >= 0 || activo) && "active"
          }`}
      >
        <a
          className={`nav-link dropdown-toggle arrow-none`}
          href="#/"
          id={`topnav-${Id}`}
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={() => {
            setActivo(!activo);
          }}
        >
          <React.Fragment>{Menu.label}</React.Fragment>
          <div className="arrow-down"></div>
        </a>
        <div
          className={`dropdown-menu dropdown-menu-left ${activo === true ? "show" : ""
            }`}
        >
          {Menu.Menus.map((m, mId) => (
            <GenerarMenu
              Id={mId}
              Menu={m}
              ParentId={Id + ParentId}
              SubMenu={true}
              key={Id + ParentId + mId}
              oidc={oidc}
              Path={Path}
            />
          ))}
        </div>
      </li>
    );
  }

  // Checamos si tenemos un HREF definido
  else if (Menu.Href !== undefined) {
    // Si es un submenus
    if (SubMenu)
      return (
        <Link
          className={`dropdown-item dropdown-toggle arrow-none ${Path.indexOf(Menu.Href as string) >= 0 && "active"
            }`}
          to={Menu.Href}
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {Menu.label}
        </Link>
      );

    return (
      <li className="nav-item">
        <Link
          to={Menu.Href}
          className={`nav-link ${Path.indexOf(Menu.Href as string) >= 0 && "active"
            }`}
          onClick={Menu.Funcion}
        >
          {Menu.label}
        </Link>
      </li>
    );
  }

  // Regresamos null por defecto
  return null;
};

/**
 * Funcion para generar los menús de la aplicación
 * @param props Menus a mostrar
 */
export const MostrarMenu = (props: {
  Path: string;
  Sidebar: boolean;
  Menus: Menu[];
  oidc?: IOidc;
}) => {
  // Rendereamos el componente
  return (
    <div className="container-fluid ps-0 pe-0">
      <div className="topnav" style={{ borderRadius: "0px" }}>
        <nav
          className="navbar navbar-light navbar-expand-lg topnav-menu"
          style={{ minHeight: "0px" }}
        >
          <div
            className={`navbar-collapse collapse ${props.Sidebar === true ? "show" : ""
              }`}
            id="topnav-menu-content"
            style={{}}
          >
            <ul className="navbar-nav active">
              {props.Menus.map((m, mId) => (
                <GenerarMenu
                  Id={mId}
                  key={mId}
                  Path={props.Path}
                  Menu={m}
                  ParentId={0}
                  SubMenu={false}
                  oidc={props.oidc}
                />
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export const truncateDecimals = (num: number, digits: number) => {
  var numS = num.toString(),
    decPos = numS.indexOf("."),
    substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
    trimmedResult = numS.substr(0, substrLength);

  return parseFloat(trimmedResult);
};

export const filterArrayByValues = (
  array: any,
  values: any,
  propertyName: any
) => {
  return array.filter((arrayItem: any) => {
    return values.some((value: any) => {
      return value === arrayItem[propertyName];
    });
  });
};

export const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

// Is a desktop
export function isDesktop(): boolean {
  return window.innerWidth >= 992;
}

// Add a class to a component
export const addClass = (element: any, className: string) => {
  if (element.classList) element.classList.add(className);
  else element.className += " " + className;
};

// Remove a class from a component
export const removeClass = (element: any, className: string) => {
  if (element.classList) element.classList.remove(className);
  else
    element.className = element.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date: Date) => {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
};

export const formatDate2 = (date: Date) => {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
};

export const addOneDay = (date: Date) => {
  date.setDate(date.getDate() + 1);
  return date;
};

export const addSevenDay = (date: Date) => {
  date.setDate(date.getDate() + 8);
  return date;
};

export const addTenDay = (date: Date) => {
  date.setDate(date.getDate() - 4);
  return date;
};

function useAppSelector<T>(arg0: (estado: any) => any) {
  throw new Error("Function not implemented.");
}

export const getErrorParsed = (error): string => {
  if (typeof error.response?.data == "string") return error.response.data;

  const errData = error.response.data;
  const arrMsj = Array(Array(Object.values(errData.errors || {}))[0])[0];
  const validMsjErr = arrMsj ? `${errData.title || "ERROR"} - ` + arrMsj : null;

  return (
    errData.error ||
    errData.msj ||
    errData.message ||
    errData.mensaje ||
    validMsjErr ||
    "HA OCURRIDO UN PROBLEMA"
  );
};

export type IntCsvReader = {
  mutator?: Function;
  consoleSheet?: Boolean;
  mutatorJson?: (json: any[]) => any;
  consoleJson?: Boolean;
  range?: string; // Add the range property
};

export type CsvAccesor = {
  [string: string]: { v: any; t: string; w: any };
};

export const FnReadCsvFile = ({ target: { files } }, extras?: IntCsvReader) =>
  new Promise((resolve, deny) => {
    try {
      const XLSX = require("xlsx-js-style");
      const file: File = files[0];

      if (
        !file.name.includes(".csv") &&
        !file.name.includes(".xls") &&
        !file.name.includes(".xlsx")
      )
        return deny(
          "El formato del archivo no es valido favor de subir alguno de los sig. formatos (csv, xls, xlsx)"
        );

      var reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        let Json: any[] = [];
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });

        if (workbook.SheetNames.length > 1)
          return deny("Solo se puede leer una hoja por archivo");

        workbook.SheetNames.forEach((sheetName) => {
          if (extras && extras.consoleSheet)
            console.log("M: XLSX: ", workbook.Sheets[sheetName]);
          const xlsxDataObject =
            extras && extras.mutator
              ? extras.mutator(workbook.Sheets[sheetName])
              : workbook.Sheets[sheetName];

          if (typeof xlsxDataObject == "string") return deny(xlsxDataObject);

          const tempData = XLSX.utils.sheet_to_row_object_array(
            xlsxDataObject,
            {
              range: extras?.range, // Pass the range option
            }
          );
          if (extras && extras.consoleJson) console.log("M: JSON: ", tempData);
          const jsonObject =
            extras && extras.mutatorJson
              ? extras.mutatorJson(tempData)
              : tempData;

          if (typeof jsonObject == "string") return deny(jsonObject);

          Json = jsonObject;
        });

        resolve(Json);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      deny(error);
    }
  });
