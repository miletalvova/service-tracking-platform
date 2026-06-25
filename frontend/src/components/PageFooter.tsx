import { Link } from "react-router-dom";
import './PageFooter.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import YouTubeIcon from '@mui/icons-material/YouTube';

function PageFooter() {
    return (
        <footer className="page-footer">
            
            <div className="footer-content">

            <div className="footer-about">
                <h3 className="footer-title">About</h3>
                <Link to="/">About Us</Link>
                <Link to="/">News</Link>
            </div>

            <div className="footer-card">
                <h3 className="footer-title">Resources</h3>
                <Link to="/">Help Center</Link>
                <Link to="/">Request a Feature</Link>
            </div>

            <div className="footer-contact">
                <h3 className="footer-title">Contact</h3>
                <p>support@service-platform.com</p>
                <p>Oslo, Norway</p>
                <p>© {new Date().getFullYear()} Mileta.</p>
            </div>

            <div className="footer-icons">
                <FacebookIcon /> 
                <InstagramIcon /> 
                <TwitterIcon /> 
                <PinterestIcon /> 
                <YouTubeIcon />
            </div>

            </div>
        </footer>
    )
}

export default PageFooter;