import React, {useState} from 'react'
import Header from '../components/Header'
import Diskpeeker from '../components/Diskpeeker';
import DiskOrgaModal from '../components/DiskOrgaModal';
import Footer from '../components/Footer';

function DiskpeekerPage() {
    const [showDiskOrgaModal, setShowDiskOrgaModal] = useState(false);

    return (
        <>
            <main className='container'>
                <Header></Header>
                <Diskpeeker></Diskpeeker>
                <section id="buttons">
                    <div className='grid'>
                        <button className='secondary' onClick={() => setShowDiskOrgaModal(true)} >Edit Disks</button>
                    </div>
                </section>
                <section id="disk-orga-modal">
                    <DiskOrgaModal onClose={() => setShowDiskOrgaModal(false)} open={showDiskOrgaModal}></DiskOrgaModal>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default DiskpeekerPage;