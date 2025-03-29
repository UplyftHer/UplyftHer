const express = require('express');

const contactUsEmailBodyDSAR = (name, email, type, requests, message) => {
  const formattedRequests = requests
        .map((item) => `<p><strong>${item.question}</strong><br>${item.answer}</p>`)
        .join("");
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <h1>Contact Request Details</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Type of Request:</strong> ${type}</p>
            <div class="requests">
                <h3>Request Details:</h3>
                ${formattedRequests}
            </div>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        </body>
        </html>
    `;
  };

const contactUsEmailBody = (name, email, type, message) => {
 
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <h1>Contact Request Details</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Type of Request:</strong> ${type}</p>
            
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        </body>
        </html>
    `;
  };
  
  const anotherTemplate = (param1, param2) => {
    return `
      <h1>Another Template</h1>
      <p>Param 1: ${param1}</p>
      <p>Param 2: ${param2}</p>
    `;
  };
  
  module.exports = {
    contactUsEmailBodyDSAR,
    contactUsEmailBody,
    anotherTemplate,
  };
  