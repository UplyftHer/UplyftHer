import React, { useState, useEffect } from 'react';
import "./Cookies.css";
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form } from 'react-bootstrap';
import { FaTimes, FaCheck } from "react-icons/fa";
import axios from 'axios';

function Cookies() {
    const [cookieConsentContent, setCookieConsentContent] = useState('');
    const [isContentLoading, setIsContentLoading] = useState(true);

    useEffect(() => {
        const fetchCookieConsentContent = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/admin/cookies`);
                if (data?.cookies?.content) {
                    setCookieConsentContent(data.cookies.content);
                }
            } catch (error) {
                console.error('Failed to fetch Cookie Consent Content:', error);
            } finally {
                setIsContentLoading(false);
            }
        };
        fetchCookieConsentContent();
    }, []);

    const [isCookiePopupVisible, setIsCookiePopupVisible] = useState(false);
    const [showCookiePopup, setShowCookiePopup] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCookiePopupVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [isChoosingCookieOptions, setIsChoosingCookieOptions] = useState(false);

    const handleConsentOrGoBack = () => {
        if (isChoosingCookieOptions) {
            setIsChoosingCookieOptions(false); 
        } else {
            setShowCookiePopup(false); 
        }
    };

    // Handle toggling individual cookie consent options
    const [cookieOptionToggles, setCookieOptionToggles] = useState([false, false, false, false]);
    const [isAllCookieOptionsChecked, setIsAllCookieOptionsChecked] = useState(false);

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

    if (!showCookiePopup) return null;

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
                        <p>To modify your preferences afterwards, click on the 'Cookie Preferences' link located in the page footer.</p>
                    </div>
                )}

                <div className="UplCertify mt-3">
                    <span>Consents certified by - <strong>Uplyfther</strong></span>
                    <div className="CookieBotm">
                        <Button onClick={handleConsentOrGoBack}>
                            {isChoosingCookieOptions ? "Back" : "No, thanks"}
                        </Button>

                        {/* 
                        <Button onClick={() => setIsChoosingCookieOptions(true)}>
                            {isChoosingCookieOptions ? "Accept all" : "I want to choose"}
                        </Button> 
                        */}

                        <Button onClick={handleConsentOrGoBack}>Ok for me</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cookies;
