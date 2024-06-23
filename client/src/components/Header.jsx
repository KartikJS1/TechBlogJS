import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';

const Header = () => {

    const { userInfo, setUserInfo } = useContext(UserContext)

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
            .then(res => {
                res.json()
                    .then(userInfo => {
                        setUserInfo(userInfo);
                    })
            })
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    };

    const username = userInfo?.username;

    return (
        <header>
            <Link to='/' className='logo'>MyBlogJS</Link>
            <nav>
                {username && (
                    <>
                        <div className="icons">
                            <Link to={"/create"}>Create New Post</Link>
                            <a className='logout' onClick={logout}>Logout</a>
                        </div>
                    </>
                )}
                {!username && (
                    <>
                        <div className="icons">
                            <Link to='/login'>Login</Link>
                            <Link to='/register'>Register</Link>
                        </div>
                    </>
                )}

            </nav>
        </header>
    )
}

export default Header