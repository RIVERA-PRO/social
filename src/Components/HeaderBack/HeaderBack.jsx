import { React, useState, useEffect } from 'react'
import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './HeaderBack.css'
export default function HeaderBack({ link, title }) {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 60) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div className={scrolled ? "headerBack scrollNav" : "headerBack"}>
            <Anchor to={`${link}`}>
                <FontAwesomeIcon icon={faArrowLeft} />

            </Anchor>
            <span>
                {title}
            </span>
        </div>
    )
}
