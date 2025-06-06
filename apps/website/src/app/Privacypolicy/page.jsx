'use client';
import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Header from '../Components/Headers/page';
import axios from 'axios';

function Privacypolicy() {
  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyContent = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/admin/privacy-policy`);
        if (data?.privacyPolicy?.content) {
          setPrivacyContent(data.privacyPolicy.content);
        }
      } catch (error) {
        console.error('Failed to fetch Privacy Policy:', error);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchPrivacyContent();
  }, []);

  return (
    <>
      <Header />

      <section className='PolicySec'>
        <Container>
          <div className="TermsData">
            <div className="termhead">
              <h2><span>Privacy Policy</span></h2>
              <h6>
                A website’s privacy policy outlines if and how you collect, use, share, or sell your visitors’ personal information and is required under data privacy laws.
              </h6>
            </div>

            {/* Conditional Rendering: Show Loading Spinner or Dynamic Content */}
            {loading ? (
              // Spinner: Show when loading
              <div className="spinner-container">
                <Spinner animation="border" role="status" />
                <span>Loading...</span>
              </div>
            ) : (
              <div
                className="terms-dynamic-content"
                dangerouslySetInnerHTML={{ __html: privacyContent }}  
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

export default Privacypolicy;
