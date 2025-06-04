import React from 'react'
import { Link } from 'react-router-dom'

type MenuType = {
    Label: string,
    Icon: any,
    warnings?: number,
    warningsNg?: string,
    path: string,
    current_Path: string
}
const Menu = (props: MenuType) => {

    // background
    const warningsNg = props.warningsNg !== undefined ? props.warningsNg : 'bg-primary'
    const active = props.path === props.current_Path

    // Render the component
    return (
        <li>
            <Link className={`aves-effect ${active ? "active" : ""}`} to={props.path}>

                <props.Icon size={24} />
                {
                    props.warnings !== undefined &&
                    <span className={`badge rounded-pill float-end ${warningsNg}`}>{props.warnings}</span>
                }
                <span style={{ marginLeft: "10px", fontWeight: "bold" }}>&nbsp;{props.Label}</span>

            </Link>
        </li>
    )
}

export default Menu
