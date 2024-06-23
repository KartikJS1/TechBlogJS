import React, { useEffect, useState } from 'react'
import Header from './Header'
import Post from './Post'

const Home = () => {


    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
            })
        })
    }, []);
    return (
        <main>

            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}

        </main>
    )
}

export default Home