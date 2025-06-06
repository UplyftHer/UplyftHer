import React, { useState, useEffect } from 'react';
import "./Cookies.css";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { FaTimes, FaCheck } from "react-icons/fa";

function Cookies() {
    const [cookieConsentContent, setCookieConsentContent] = useState('');
    const [showCookiePopup, setShowCookiePopup] = useState(false);
    const [isChoosingCookieOptions, setIsChoosingCookieOptions] = useState(false);
    const [cookieOptionToggles, setCookieOptionToggles] = useState([false, false, false, false]);
    const [isAllCookieOptionsChecked, setIsAllCookieOptionsChecked] = useState(false);

    useEffect(() => {
        const fetchCookieConsentContent = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/admin/cookies`);
                if (data?.cookies?.content) {
                    setCookieConsentContent(data.cookies.content);
                }
            } catch (error) {
                console.error('Failed to fetch Cookie Consent Content:', error);
            }
        };

        fetchCookieConsentContent();

        const cookieConsentGiven = localStorage.getItem('cookieConsentGiven');
        if (!cookieConsentGiven) {
            setShowCookiePopup(true);  // If not accepted, show popup
        }
    }, []);

    const handleConsentOrGoBack = () => {
        if (isChoosingCookieOptions) {
            setIsChoosingCookieOptions(false); 
        } else {
            setShowCookiePopup(false); 
            localStorage.setItem('cookieConsentGiven', 'true');  // Mark as accepted
        }
    };

    const handleToggleAllCookieOptions = () => {
        const newValue = !isAllCookieOptionsChecked;
        setIsAllCookieOptionsChecked(newValue);
        setCookieOptionToggles(Array(4).fill(newValue));
    };

    const handleToggleSingleCookieOption = (index) => {
        const updatedOptions = [...cookieOptionToggles];
        updatedOptions[index] = !updatedOptions[index];
        setCookieOptionToggles(updatedOptions);
        setIsAllCookieOptionsChecked(updatedOptions.every(val => val));
    };

    if (!showCookiePopup) return null;  // If accepted, don't show

    return (
        <>
            <div className="CookieSec">
                {!isChoosingCookieOptions && (
                    <div className="CookieInner">
                        <div className="TopCokieInner">
                            <div className="text">
                                <small>Hi there!</small>
                                <span>We're the <br /> cookies!</span>
                            </div>
                            <Image src="/Images/cookie.gif" alt="cookie" width={150} height={70} />
                        </div>
                        <p className='CookiePara Cookiescrollbar' dangerouslySetInnerHTML={{ __html: cookieConsentContent }} />
                    </div>
                )}

                <div className="UplCertify mt-3">
                    <span>Consents certified by - <strong>UplyftHer</strong></span>
                    <div className="CookieBotm">
                        <Button onClick={handleConsentOrGoBack}>
                            {isChoosingCookieOptions ? "Back" : "No, thanks"}
                        </Button>
                        <Button onClick={handleConsentOrGoBack}>Ok for me</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cookies;