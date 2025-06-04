// import Carousel from "react-multi-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CardItem from '../Cart/CardItem'
import "./styles.css";
// import "react-multi-carousel/lib/styles.css";

const Simple = ({ deviceType, articles }) => {
    // console.log('articles: ', articles)
    const renderCustomThumbs = () => {
        const thumbList = articles.map((article, index) =>
            <picture key={index}>
                <source data-srcSet={`${article.imagen}`} type="image/jpg" />
                <img
                    key={article._id}
                    src={`${article.imagen}`}
                    alt={article.desc}
                    height="70"
                />
            </picture>
        )
        return (thumbList)
    }

    return (
        <div className="container is-max-desktop">
            <Carousel
                showThumbs={true}
                showStatus={false}
                infiniteLoop
                centerMode={false}
                // emulateTouch
                // autoPlay
                renderThumbs={renderCustomThumbs}
                useKeyboardArrows
                transitionTime={1000}
                // axis="vertical"
                // selectedItem={1}
                width="100%"//"550px"
            >
                {articles.map((item: any) => (
                    <CardItem {...item} key={item.id} />
                ))}
            </Carousel>
        </div>

    );
};

export default Simple;
