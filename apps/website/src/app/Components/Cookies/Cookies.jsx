import React, { useState, useEffect } from 'react';
import "./Cookies.css";
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form } from 'react-bootstrap';
import { FaTimes, FaCheck } from "react-icons/fa";

function Cookies() {
    // hide popup 
    const [visible, setVisible] = useState(false);
    const [showCookies, setShowCookies] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // choose option 
    const [showChooseOptions, setShowChooseOptions] = useState(false);
    const handleNoThanksOrBack = () => {
        if (showChooseOptions) {
            setShowChooseOptions(false); // Go back to CookieInner
        } else {
            setShowCookies(false); // Close cookie popup
        }
    };
    // choose option 

    // toggle all 
    const [toggles, setToggles] = useState([false, false, false, false]);
    const [allChecked, setAllChecked] = useState(false);
    const handleToggleAll = () => {
        const newValue = !allChecked;
        setAllChecked(newValue);
        setToggles(Array(4).fill(newValue));
    };
    const handleSingleToggle = (index) => {
        const updatedToggles = [...toggles];
        updatedToggles[index] = !updatedToggles[index];
        setToggles(updatedToggles);
        setAllChecked(updatedToggles.every(val => val));
    };

    if (!showCookies) return null; // this should not cause hooks to change order

    return (
        <>
            <div className="CookieSec">
                { !showChooseOptions && (
                    <div className="CookieInner">
                        <div className="TopCokieInner">
                            <div className="text">
                                <small>Hi there ! </small>
                                <span>We're the <br /> cookies ! </span>
                            </div>
                            <Image src="/Images/cookie.gif" alt="cookie" width={150} height={70} />
                        </div>
                        <p>We've waited to make sure you're interested in the content of this site before bothering you, but we'd love to accompany you on your visit...</p>
                        <p> <strong>Is that OK with you?</strong> </p>
                        <p>Here you can accept or reject all or some of the cookies placed by Axeptio and its partners. Don't worry, you can change your mind at any time by configuring your cookies.</p>
                        <p>To modify your preferences afterwards, click on the 'Cookie Preferences' link located in the page footer.</p>
                        <div className="WhyCookie">
                            <h5>Here’s why we use cookies.</h5>
                            <ul>
                                <li><Link href="#">Share analytics, advertising data, user data, and ad personalization data with Google</Link></li>
                                <li><Link href="#">User experience</Link></li>
                                <li><Link href="#">Targeted Advertising</Link></li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* { showChooseOptions && (
                    <div className="WantChosee">
                        <div className="sitelock">
                            <Image src="/Images/choose.png" alt="applestore" width={68} height={80} />
                        </div>
                        <div className="WantTexed">
                            <h3>How your data is used by Google</h3>
                            <p>Choose how Google can collect and use your data for a better browsing experience on our site. Your privacy is paramount, and you have full control here.</p>
                        </div>
                        <div className="ChooseToggle">
                            <div className="TopToggle">
                                <span><strong>Toggle all</strong></span>
                                <div className="Cookie-toggle-wrapper" onClick={handleToggleAll}>
                                    <Form.Check type="switch" id="custom-switch-all" checked={allChecked} readOnly />
                                    <div className={`Cookie-custom-toggle ${allChecked ? "on" : "off"}`}>
                                        <span className="icon">
                                            {allChecked ? <FaCheck className="Checksvg" /> : <FaTimes className="text-danger" />}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="CookieToggleDiv">

                                <div className="GlCokieCard">
                                    <div className="CokieCardItems">
                                        <Image src="/Images/gl1.png" alt="gl1" width={62} height={62} />
                                        <div className="ckcardtext">
                                            <span>Analytics Storage <Link href="#">?</Link></span>
                                            <p>Allow Google Analytics to measure how I use the site to enhance functionality and service.</p>
                                        </div>
                                    </div>
                                    <div className="Cookie-toggle-wrapper" onClick={() => handleSingleToggle(0)}>
                                        <Form.Check type="switch" id="custom-switch-0" checked={toggles[0]} readOnly />
                                        <div className={`Cookie-custom-toggle ${toggles[0] ? "on" : "off"}`}>
                                            <span className="icon">{toggles[0] ? <FaCheck className="Checksvg" /> : <FaTimes className="text-danger" />}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="GlCokieCard">
                                    <div className="CokieCardItems">
                                        <Image src="/Images/gl2.png" alt="gl2" width={62} height={62} />
                                        <div className="ckcardtext">
                                            <span>Ad Storage <Link href="#">?</Link></span>
                                            <p>Permit Google to save advertising information on my device for better ad relevance.</p>
                                        </div>
                                    </div>
                                    <div className="Cookie-toggle-wrapper" onClick={() => handleSingleToggle(1)}>
                                        <Form.Check type="switch" id="custom-switch-1" checked={toggles[1]} readOnly />
                                        <div className={`Cookie-custom-toggle ${toggles[1] ? "on" : "off"}`}>
                                            <span className="icon">{toggles[1] ? <FaCheck className="Checksvg" /> : <FaTimes className="text-danger" />}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="GlCokieCard">
                                    <div className="CokieCardItems">
                                        <Image src="/Images/gl3.png" alt="gl3" width={62} height={62} />
                                        <div className="ckcardtext">
                                            <span>Ad User Data <Link href="#">?</Link></span>
                                            <p>Share my activity data with Google for targeted advertising.</p>
                                        </div>
                                    </div>
                                    <div className="Cookie-toggle-wrapper" onClick={() => handleSingleToggle(2)}>
                                        <Form.Check type="switch" id="custom-switch-2" checked={toggles[2]} readOnly />
                                        <div className={`Cookie-custom-toggle ${toggles[2] ? "on" : "off"}`}>
                                            <span className="icon">{toggles[2] ? <FaCheck className="Checksvg" /> : <FaTimes className="text-danger" />}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="GlCokieCard">
                                    <div className="CokieCardItems">
                                        <Image src="/Images/gl4.png" alt="gl4" width={62} height={62} />
                                        <div className="ckcardtext">
                                            <span>Ad Personalization <Link href="#">?</Link></span>
                                            <p>Customize my ad experience by allowing Google to personalize the ads I see.</p>
                                        </div>
                                    </div>
                                    <div className="Cookie-toggle-wrapper" onClick={() => handleSingleToggle(3)}>
                                        <Form.Check type="switch" id="custom-switch-3" checked={toggles[3]} readOnly />
                                        <div className={`Cookie-custom-toggle ${toggles[3] ? "on" : "off"}`}>
                                            <span className="icon">{toggles[3] ? <FaCheck className="Checksvg" /> : <FaTimes className="text-danger" />}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )} */}

                <div className="UplCertify mt-3">
                    <span>Consents certified by -<strong> Uplyfther</strong> </span>
                    <div className="CookieBotm">
                        <Button onClick={handleNoThanksOrBack}>
                            {showChooseOptions ? "Back" : "No, thanks"}
                        </Button>
                        
                        {/* <Button onClick={() => setShowChooseOptions(true)}>
                            {showChooseOptions ? "Accept all" : "I want to choose"}
                        </Button> */}

                        <Button onClick={handleNoThanksOrBack}>Ok for me</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cookies;
