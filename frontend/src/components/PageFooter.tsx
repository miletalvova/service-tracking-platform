import { Link } from "react-router-dom";
import './PageFooter.css'

function PageFooter() {
    return (
        <footer className="page-footer">
            <div>© {new Date().getFullYear()} Mileta.</div>
            <div className="footer-card">
                <Link to="/">Privacy Policy</Link>
                <Link to="/">Contact</Link>
            </div>
            <p>support@service-platform.com</p>
        </footer>
    )
}

export default PageFooter;