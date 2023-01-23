import React from 'react'
import Header from '../components/Header'
import Diskpeeker from '../components/Diskpeeker';
import Footer from '../components/Footer';

function refreshButtonClicked() {
    
}

function editButtonClicked() {
    
}

function DiskpeekerPage() {
    return (
        <>
            <main className='container'>
                <Header></Header>
                <Diskpeeker></Diskpeeker>
                <section id="buttons">
                    <div className='grid'>
                        <button onClick={refreshButtonClicked}>Refresh</button>
                        <button className='secondary' onClick={editButtonClicked} >Edit Disks</button>
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default DiskpeekerPage;