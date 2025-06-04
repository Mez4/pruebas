import React from 'react'

type ImageType = { Source: any, Alt: string }
const Image = (props: ImageType) => (
    <img src={props.Source} alt={props.Alt} className="card-img img-fluid" />
)

type CardType = {
    Title?: React.ReactElement | string,
    TitleEnd?: React.ReactElement | null,
    children: any,
    className?: string
}
export const Card = (props: CardType) => {
    return (
        <div className={`card ${props.className}`}>
            {props.Title !== undefined && <h4 className="card-header font-16 mt-0">
                {props.Title}  {props.TitleEnd !== undefined && props.TitleEnd}</h4>}

            {props.children}
        </div>
    )
}

// #############################################
// Image
Card.Image = Image

// #############################################
// Body

type BodyType = { children: any, clssName?: string }
const Body = (props: BodyType) => (
    <div className={`card-body ${props.clssName}`}>
        {props.children}
    </div>
)
type BTitleType = { Title: string }
const BTitle = (props: BTitleType) => (
    <h4 className="card-title">{props.Title}</h4>
)
const BSubTitle = (props: BTitleType) => (
    <h6 className="card-subtitle font-14 text-muted">{props.Title}</h6>
)

type BContentType = { children: any }
const BContent = (props: BContentType) => (
    <div className="card-text mb-2">
        {props.children}
    </div>
)

Body.Title = BTitle
Body.SubTitle = BSubTitle
Body.Content = BContent
Card.Body = Body

// Export the card with this properties on it
export default Card