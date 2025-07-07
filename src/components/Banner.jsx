import { Carousel } from 'antd';



const Banner = () => {

    const bannerStyle = {
        width: '100%',
        height: '40vh',
        objectFit: 'cover',
    };
    return (
        <Carousel autoplay>
            <div>
                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    alt="海滩"
                    style={bannerStyle}
                />
            </div>
            <div>
                <img
                    src="https://images.pexels.com/photos/32555917/pexels-photo-32555917.jpeg"
                    alt="山景"
                    style={bannerStyle}
                />
            </div>
        </Carousel>
    );
};

export default Banner;
