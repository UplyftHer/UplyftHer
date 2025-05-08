'use client';
import React, { useEffect, useState } from 'react';
import "./LandingPage.css"
import { Container} from 'react-bootstrap';
import Link from 'next/link';
import Image from "next/image";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp ,FaTelegramPlane } from "react-icons/fa";
import TestimonialsSlider from '../Components/TestimonialsSlider/TestimonialsSlider';


// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '../Components/Headers/page';
import ProfesSlider from '../Components/ProfesSlider/ProfesSlider';
import axios from 'axios';
import Cookies from '../Components/Cookies/Cookies';




function Landingpage() {

  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);
  
    const fetchSocials = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/admin/social-links`);
         console.log('theredata', response)
        if (response.data && response.data.socialLinks.length > 0) {
          console.log('theredata', response)
          setSocials(response.data.socialLinks);
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSocials();
  }, []);
  
  return (
    <>

    

    <Cookies/>



    <Header/>
    
    <section className='HeroSection'>
      <Container>
        <div className="HeroMentorDiv">
          <div className="MentorTopHero">
            <div className="LftHero" data-aos="zoom-in-right" data-aos-duration="1000">
              <h1>Mentorship Made <br /> <span>Simple and Powerful</span> </h1>
            </div>
            <div className="RytHero" data-aos="zoom-in-left" data-aos-duration="1000">
              <p>Find women mentors in a swipe and start your journey to success.</p>
              <div className="DownlodeBtn">
                <Link href="#"><Image src="/Images/aplebtn.png" alt="applestore" width={190} height={67}   /></Link>
                <Link href="#"><Image src="/Images/goglbtn.png" alt="playstore" width={190} height={67}   /></Link>
              </div>
            </div>
          </div>
          <div className="HeroMetorPicture" data-aos="fade-up" data-aos-duration="3000">
            <Image src="/Images/mentor1.png" alt="mentor1" width={214} height={220}  />
            <Image src="/Images/mentor2.png" alt="mentor2" width={214} height={220}  />
            <Image src="/Images/mentor3.png" alt="mentor3" width={214} height={220}  />
            <Image src="/Images/mentor4.png" alt="mentor4" width={214} height={220}  />
            <Image src="/Images/mentor5.png" alt="mentor5" width={214} height={220}  />
            <Image src="/Images/mentor6.png" alt="mentor6" width={214} height={220}  />
            <Image src="/Images/mentor7.png" alt="mentor7" width={214} height={220}  />
            <Image src="/Images/mentor8.png" alt="mentor8" width={214} height={220}  />
            <Image src="/Images/mentor9.png" alt="mentor9" width={214} height={220}  />
            <Image src="/Images/mentor10.png" alt="mentor10" width={214} height={220}  />
            <Image src="/Images/mentor11.png" alt="mentor11" width={214} height={220}  />
            <Image src="/Images/mentor12.png" alt="mentor12" width={214} height={220}  />
          </div>
        </div>
      </Container>
    </section>


    <section className='UpliftGrowthSec' id='Feature'>
      <Container>

        <div className="GrowthBeginData">

          <div className="TopGrowthDiv">
            <div className="lftgrowthbeg" data-aos="fade-up" data-aos-duration="1000">
              <div className="whyspan">
                <span>Why UpLyft Her</span>
              </div>
              <div className="growthTexted">
                <h2>Where your <span>growth</span> <br /> <span>Begins...</span></h2>
                <p>Discover how UplyftHer redefines mentorship by making it personal, easy, and impactful.</p>
              </div>
            </div>
            <div className="Rytgrowthbeg" data-aos="fade-up" data-aos-duration="1000">
              <Image src="/Images/growthpic.png" alt="growthpic" width={228} height={228}   />
            </div>
          </div>

          <div className="BottomGrowthDiv">

            <div className="ThreeGrothCard">
              <div className="GrowthCard" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <div className="growcardText">
                  <h6>Personalized mentor-mentee matching.</h6>
                  <p>Get matched with mentors who truly align with your career goals and aspirations.</p>
                </div>
                <div className="MentorMatchDiv">
                  <div className="avtarmatch">
                    <Image className='mentmatch' src="/Images/avtar1.png" alt="avtar1" width={139} height={139}   />
                  </div>
                  <div className="avtarmatch">
                    <Image className='mentmatch' src="/Images/avtar2.png" alt="avtar2" width={139} height={139}   />
                  </div>
                </div>
                
              </div>
              <div className="GrowthCard" data-aos="fade-up" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <div className="growcardText">
                  <h6>Swipe to find your perfect mentor.</h6>
                  <p>Browse mentors with a simple swipe interface that makes finding a match fun and easy.</p>
                </div>
                <div className="growImg perftment">
                  <Image className='mentcall' src="/Images/grwthcard2.png" alt="grwthcard2" width={348} height={348}   />
                </div>
              </div>
              <div className="GrowthCard" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <div className="growcardText">
                  <h6>Schedule meetings seamlessly with calendar integration.</h6>
                  <p>Book meetings effortlessly with built-in calendar sync and flexible time slots.</p>
                </div>
                <div className="growImg">
                  <Image className='mentclendr' src="/Images/grwthcard3.png" alt="grwthcard3" width={314} height={136}   />
                </div>
              </div>
            </div>

            <div className="TwoGrowthCard">

              <div className="NetworkCard" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <div className="NetworkTexed">
                  <h4>Trusted network of professionals ready to help.</h4>
                  <p>Connect with experienced mentors who are eager to share their expertise.</p>
                </div>
                <ProfesSlider/>
              </div>

              <div className="guidancareerCard" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">

                <div className="leftcarer">
                  <div className="careertexed">
                    <h4>Elevate your career with guidance tailored to you.</h4>
                    <p>Gain personalized advice to navigate challenges and unlock new opportunities.</p>
                  </div>
                </div>

                <div className="Rytcarer">
                  <Image src="/Images/careercard.png" alt="careercard" width={293} height={210}   />
                </div>

              </div>

            </div>


          </div>











        </div>

      </Container>
    </section>


    <section className='ServiceSec'>
      <Container>
        <div className="ServicesData">
          <div className="ServiceItems" data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-offset="100">
            <Image src="/Images/service1.png" alt="service1" width={64} height={64}   />
            <h4>10,000+</h4>
            <p>Network of professionals</p>
          </div>
          <div className="ServiceItems" data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-offset="200">
            <Image src="/Images/service2.png" alt="service2" width={64} height={64}   />
            <h4>1000+</h4>
            <p>Mentor-mentee connections</p>
          </div>
          <div className="ServiceItems" data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-offset="300"> 
            <Image src="/Images/service3.png" alt="service3" width={64} height={64}   />
            <h4>90%</h4>
            <p>Positive Impact</p>
          </div>
        </div>
      </Container>
    </section>

    <section className='UpliftedWomenSec' id='TestiMonials'>
      <div className="TestimonialDiv">
        <div className="TestimonialText" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
          <h2>Women Who <br /> <span>Uplyfted...</span></h2>
          <p>Real experiences from mentees and mentors who found growth, guidance, and connection through UplyftHer. Let their stories inspire your journey!</p>
        </div>
        <div className="TestiSlider" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
          <TestimonialsSlider/>
        </div>
      </div>
    </section>

    <section className='SneakPeekSec' id='SneakPreview'>
      <Container>
        <div className="SneakPeekData" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
          <div className="lftSneekPic" data-aos="fade-up"data-aos-anchor-placement="bottom-bottom"> </div>
          <div className="RytSneekText" data-aos="fade-up"data-aos-anchor-placement="bottom-bottom">
            <h2><span>A Sneak Peek</span> <br /> into your UpLyft</h2>
            <div className="DownlodeBtn">
              <Link href="#"><Image src="/Images/aplebtn.png" alt="applestore" width={200} height={75}   /></Link>
              <Link href="#"><Image src="/Images/goglbtn.png" alt="playstore" width={200} height={75}   /></Link>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section className='ReqstReadySec'>
      <Container>
        <div className="ReqstData">
          <div className="lftReqst" data-aos="fade-up" data-aos-anchor-placement="center-center">
            <h3>Ready to <br /> <span> Uplyft your <br /> journey?</span></h3>
          </div>
          <div className="RytReqst" data-aos="fade-up"data-aos-anchor-placement="center-center">
            <p>We’re building a supportive, invite-only <br /> community of women professionals. </p>
            <p> <span>Want to join? </span> <br />Drop us an email at <span>invite@uplyfther.com</span>, <br /> and let’s get you started!</p>
            <Link href="mailto:hello@uplyfther.com"> <BsFillPatchCheckFill /> Request an Invite</Link>
          </div>
        </div>
      </Container>
    </section>


    <footer className='FooterSec'>

      <div className="LftFooter">

        <div className="logFt" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <Image src="/Images/MainLogo.png" alt="MainLogo" width={140} height={74}  />
          <p>Your ultimate platform to find inspiring women mentors in a swipe—empowering you to grow, connect, and elevate your career like never before!</p>
        </div>

        <div className="FtDownlodeBtn" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <Link href="#"><Image src="/Images/aplebtn.png" alt="applestore" width={180} height={65}   /></Link>
          <Link href="#"><Image src="/Images/goglbtn.png" alt="playstore" width={180} height={65}   /></Link>
        </div>

        <div className="lftbotom" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <p>Copyright © DuneXploration UG 2025</p>
          <p>DuneXploration UG (haftungsbeschränkt), Am Finther Weg 7 55127, Mainz, Rheinland-Pfalz Germany</p>
          <p>Geschaftsfuhrer: Ankit Upadhyay, Amtsgerichts Mainz unter HRB 52778, VAT: DE367920596</p>
        </div>
      </div>

      <div className="RytFooter">
        <div className="TopRytFt">
          <div className="ContFt" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            <span>Contact</span>
            <Link href="tel:+49 152 277 63275"> +49 152 277 63275</Link>
            <Link href="mailto:hello@uplyfther.com"> hello@uplyfther.com</Link>
          </div>
          <div className="FollowusDiv" data-aos="fade-up"data-aos-anchor-placement="top-bottom">
            <span>Follow us</span>
            <div className="social">
                        
             {socials.map((item) => (
            item.accountStatus === 1 && (
              <Link key={item._id} target="_blank" href={item.url} rel="noopener noreferrer">
                <img src={item.image} alt={item.name} style={{ width: 30, height: 30 }} />
              </Link>
            )
            ))}

              

              {/* <Link target='_blank' href="https://www.instagram.com/accounts/login/?hl=en"><FaInstagram /></Link>
              <Link target='_blank' href="https://web.whatsapp.com/"> <FaWhatsapp /></Link>
              <Link target='_blank' href="https://web.telegram.org/"><FaTelegramPlane /></Link> */}
            </div>
          </div>
        </div>
        <div className="BottomFt" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <Link target='_blank' href="/TermsConditions">TERMS AND CONDITIONS</Link>
          <Link target='_blank' href="/Privacypolicy">PRIVACY POLICY</Link>
          {/* <Link target='_blank' href="#">IMPRINT</Link> */}
        </div>
      </div>

    </footer>




    </>
  )
}

export default Landingpage
