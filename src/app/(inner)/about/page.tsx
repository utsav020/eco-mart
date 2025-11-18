
import HeaderOne from "@/components/header/HeaderOne";
import AboutBanner from "@/components/banner/AboutBanner";
import AboutOne from "@/components/about/AboutOne";


import FooterTwo from "@/components/footer/FooterTwo";
import HeaderThree from "@/components/header/HeaderThree";
import Customer from "@/components/feature/Customer";

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderThree />
            <AboutBanner />
            <AboutOne/>
            <Customer />
            <FooterTwo /> 

        </div>
    );
}
