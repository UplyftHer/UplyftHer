'use client';
import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Header from '../Components/Headers/page';
import axios from 'axios';

function termsndcondition() {
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsContent = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/admin/terms`);
        if (data?.terms?.content) {
          setTermsContent(data.terms.content);  
        }
      } catch (error) {
        console.error('Failed to fetch Terms and Conditions:', error);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchTermsContent();
  }, []);

  return (
    <>
      <Header />

      <section className='PolicySec'>
        <Container>
          <div className="TermsData">
            <div className="termhead">
              <h2><span>Terms & Conditions</span></h2>
              <h6>
                A terms and conditions agreement outlines the rules and expectations people must follow when accessing your website or mobile app and informs them about what they can expect from you.
              </h6>
            </div>

            {/* Conditional Rendering: Show Loading Spinner or Dynamic Content */}
            {loading ? (
              <div className="spinner-container">
                <Spinner animation="border" role="status" />
                <span>Loading...</span>
              </div>
            ) : (
              // Dynamic Content: Show when loaded
              <div
                className="terms-dynamic-content"
                dangerouslySetInnerHTML={{ __html: termsContent }}  // Render dynamic HTML content here
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

export default termsndcondition;

