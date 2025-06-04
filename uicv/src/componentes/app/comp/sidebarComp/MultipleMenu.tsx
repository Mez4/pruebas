import React, { useState } from 'react'
import { FaChevronDown, FaEllipsisH } from 'react-icons/fa'
import { Link } from 'react-router-dom'

type MultipleMenuType = {
    Label: string,
    Icon: any,
    children: any,
    location: any,
    base: string
}
const MultipleMenu = (props: MultipleMenuType) => {

    // Estado
    const [open, setOpen] = useState(false)

    // Render the component
    return (
        <li>
            <a href={"#0"} role="button" className={`waves-effect ${props.location.pathname.indexOf(props.base) >= 0 && "active"}`} onClick={() => setOpen(!open)}>
                <props.Icon size={24} />
                <span style={{ marginLeft: "10px", fontWeight: "bold" }}>&nbsp;{props.Label}</span>
                <span className="float-end">
                    {open && <FaChevronDown />}
                    {!open && <FaEllipsisH />}
                </span>

            </a>
            <ul className={`sub-menu mt-0 ${open ? "" : "mm-collapse"}`}>
                {props.children}
            </ul>
        </li>
    )
}

type MultipleMenuItemType = {
    Label: string,
    Path: string,
    location: any
}
const MultipleMenuItem = (props: MultipleMenuItemType) => {
    return (
        <li><Link className={`${props.Path === props.location.pathname && "active"}`} to={props.Path}><span>{props.Label}</span></Link></li>
    )
}

MultipleMenu.MultipleMenuitem = MultipleMenuItem
export default MultipleMenu
