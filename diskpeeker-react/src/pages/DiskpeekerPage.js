import React, {useState, useEffect} from 'react'
import Header from '../components/Header'
import DiskOverview from '../components/DiskOverview';
import DiskOrgaModal from '../components/DiskOrgaModal';
import Footer from '../components/Footer';
import { DiskpeekerApi } from '../services/api/DiskpeekerApi';

const DiskpeekerPage = () => {
    const [diskData, setDiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDiskOrgaModal, setShowDiskOrgaModal] = useState(false);

    const getDiskData = async () => {
        try {
          setLoading(true)
          const result = await DiskpeekerApi.listFull();
          setDiskData(result.data)
  
          setError(null);
        } catch (err) {
          setError(err.message);
          setDiskData(null);
        } finally {
          setLoading(false);
        }
    };

    const handleDiskDataSaved = () => {
        setDiskData(null);
        getDiskData();
    }

    const handleRefresh = () => {
        getDiskData();
    }

    async function handleReconcileDisks() {
        try {
            setLoading(true);
            await DiskpeekerApi.init();
        } catch (err) {
            setError(err.message);
        } finally { 
            setLoading(false);
            getDiskData();
        }
    }

    useEffect(() => {
        getDiskData();
      }, []);

    return (
        <>
            <main className='container'>
                <Header></Header>
                {error && !loading && (<div style={{color: "#c62828"}}>{`There is a problem fetching the disk data - ${error}`}</div>)}
                <DiskOverview diskData={diskData} loading={loading} onRefresh={handleRefresh} onReconcile={handleReconcileDisks} />
                <section id="buttons">
                    <div className='grid'>
                        <button className='secondary' onClick={() => setShowDiskOrgaModal(true)} >Edit Disks</button>
                    </div>
                </section>
                <section id="disk-orga-modal">
                    <DiskOrgaModal onClose={() => setShowDiskOrgaModal(false)} onDiskDataSaved={handleDiskDataSaved} open={showDiskOrgaModal} />
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default DiskpeekerPage;