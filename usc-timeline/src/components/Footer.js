import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

const Footer = () => {
  return (
    <MDBFooter color="mdb-color" className="font-small pt-4 mt-4">
      <MDBContainer fluid className="text-center text-md-left">
        <MDBRow>
          <MDBCol md="6">
            <p>
              <big style={{ fontWeight: "bold" }}>USC Main Office</big>
              <br />
              Room 340, UCC Building
              <br /> Western University
              <br /> London, ON. N6A 3K7
            </p>
          </MDBCol>
          <MDBCol md="6">
            <div className="mb-5 flex-center">
              <a href="https://www.facebook.com/westernusc" className="fb-ic">
                <i className="fab fa-facebook-f fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
              </a>
              <a href="https://www.twitter.com/WesternUSC" className="tw-ic">
                <i className="fab fa-twitter fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/university-students%27%E2%80%8B-council-at-the-university-of-western-ontario"
                className="li-ic"
              >
                <i className="fab fa-linkedin-in fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
              </a>
              <a href="https://www.instagram.com/westernusc" className="ins-ic">
                <i className="fab fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
              </a>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright:{" "}
          <a href="https://westernusc.ca/"> westernusc.ca </a>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
};

export default Footer;
