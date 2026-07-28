import { FaGoogle, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-icons">
        <button type="button" aria-label="google" className="footer-icon-btn">
          <FaGoogle />
        </button>
        <button type="button" aria-label="twitter" className="footer-icon-btn">
          <FaTwitter />
        </button>
        <button type="button" aria-label="instagram" className="footer-icon-btn">
          <FaInstagram />
        </button>
        <button type="button" aria-label="youtube" className="footer-icon-btn">
          <FaYoutube />
        </button>
      </div>
      <p className="footer-contact-text">Contact Us</p>
    </div>
  </footer>
);

export default Footer;
