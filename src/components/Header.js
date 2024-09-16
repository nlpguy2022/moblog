import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => (

    <header className="header">
        <div className="header-content">
            {/* <div className='header-logo'> */}
            <img src="/mo_white_cd.png" alt="Blog Logo" />
            {/* </div> */}
            
            <nav>
                <ul>
                    <li>
                    <Link to="/"><b>Home</b></Link>
                    <Link to="/about"><b>About</b></Link>
                    <Link to="/sandbox"><b>Sandbox</b></Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
);

export default Header;