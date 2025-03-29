"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Nav from "react-bootstrap/Nav";
import "./Header.css";
import Link from "next/link";
import { Container } from "react-bootstrap";
import { FaArrowTrendUp } from "react-icons/fa6";

const Header = () => {
  const omniUrl = process.env.NEXT_PUBLIC_OMNI_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(""); // Track the active nav item
  const dropdownRef = useRef(null); // Ref to track the dropdown
  const mobileNavToggleBtnRef = useRef(null); // Ref for mobile toggle button

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mobile navigation toggle
  const toggleMobileNav = () => {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    const mobileNavToggleBtn = mobileNavToggleBtnRef.current;
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('ri-bar-chart-horizontal-line');
      mobileNavToggleBtn.classList.toggle('ri-close-line');
    }
  };

  // Dropdown click handling
  // const handleDropdownClick = (event) => {
  //   event.preventDefault();
  //   const dropdownMenu = event.currentTarget.nextElementSibling; // Get the corresponding dropdown menu
  //   if (dropdownMenu) {
  //     dropdownMenu.classList.toggle('dropdown-active'); // Toggle the dropdown visibility
  //   }
  // };

  // Scroll handling for header styles
  useEffect(() => {
    const toggleScrolled = () => {
      const selectBody = document.querySelector("body");
      const selectHeader = document.querySelector("#header");

      if (
        !selectHeader.classList.contains("scroll-up-sticky") &&
        !selectHeader.classList.contains("sticky-top") &&
        !selectHeader.classList.contains("fixed-top")
      )
        return;

      window.scrollY > 100
        ? selectBody.classList.add("scrolled")
        : selectBody.classList.remove("scrolled");
    };

    window.addEventListener("scroll", toggleScrolled);
    window.addEventListener("load", toggleScrolled);

    return () => {
      window.removeEventListener("scroll", toggleScrolled);
      window.removeEventListener("load", toggleScrolled);
    };
  }, []);

  // Set active class based on the current path
  useEffect(() => {
    document.querySelectorAll('#navmenu a').forEach((link) => {
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, []);

  return (
    <div className="HEADER" >
    <Container>
      <header id="header" className="header d-flex align-items-center fixed-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <a  href="/" className="logo d-flex align-items-center me-auto me-lg-0">
            <Image src="/Images/MainLogo.png"alt="Logo" width={121} height={56}/>
          </a>
          <Nav id="navmenu" className="navmenu">
            <ul>
              {/* <li><a href="/" className="active">Home</a></li> */}
            
              {/* <li className="dropdown">
                <a href="#" onClick={handleDropdownClick}>
                  <span>Products</span> <i className="ri-arrow-down-s-line"></i>
                </a>
                <ul>
                  <li><a  href="/Pages/Bridge360/LandingPage">Bridge 360</a></li>
                  <li><a  href="/Pages/Omini/OmniReach">Omni Reach</a></li>
                  <li><a  href="/Pages/CommingSoon"> Creative Studio</a></li>
                  <li><a  href="/Pages/CustomWebsite"> Custom Development</a></li>
                </ul>
              </li> */}
              
            
              <li><Link href="#Feature">Features</Link></li>
              <li><Link href="#TestiMonials">Testimonials</Link></li>
              <li><Link href="#SneakPreview">App Preview</Link></li>
              {/* <Link href="#" className="btn-getstarted" >Download App <FaArrowTrendUp /></Link> */}
              <Link href="#" className="btn-getstarted" >Download App </Link>
            </ul>
            
            <i 
              className="mobile-nav-toggle d-xl-none ri-bar-chart-horizontal-line"
              ref={mobileNavToggleBtnRef}
              onClick={toggleMobileNav}
            ></i>
            
          </Nav>

          

          {/* <NavDropdown title="Sign up" id="basic-nav-dropdown" className="btn-getstarted">
            <NavDropdown.Item href={`${omniUrl}LogIn`}>Brand Login</NavDropdown.Item>
            <NavDropdown.Item href="#">Influencer Login</NavDropdown.Item>
          </NavDropdown> */}



          {/* <a className="btn-getstarted" href="/signup">Get Started</a> */}
        </div>
      </header>
    </Container>

    </div>
  );
};

export default Header;
