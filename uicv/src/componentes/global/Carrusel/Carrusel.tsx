import React, { Fragment } from "react";
import Section from "./Section";
import Simple from "./Simple";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import CardItem from '../Cart/CardItem'
// import UAParser from "ua-parser-js";


const Carrusel = ({ articles }) => {

    // const settings = {
    //     dots: false,
    //     infinite: false,
    //     speed: 500,
    //     slidesToShow: 3,
    //     slidesToScroll: 1
    // };
    // let userAgent;
    // // if (req) {
    // //     userAgent = req.headers["user-agent"];
    // // } else {
    // userAgent = navigator.userAgent;
    // // }
    // const parser = new UAParser();
    // parser.setUA(userAgent);
    // const result = parser.getResult();
    // console.log('result: ', result)
    // const deviceType = (result.device && result.device.type) || "desktop";

    return (
        <Fragment>
            <Section>
                <Simple deviceType={"desktop"} articles={articles} />
            </Section>
        </Fragment>
    );
};

export default Carrusel;