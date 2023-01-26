import React, {useState, useEffect} from 'react'
import axios from "axios"

function doLog() {
    console.log("click")
}

function DiskOrgaModal(props) {
    const [modalOpen, setModalOpen] = useState(props.open);

    const [diskData, setDiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDiskData = async () => {
        try {
          setLoading(true)
          await new Promise(r => setTimeout(r, 100));
          const result = await axios('http://localhost:8000/diskinfo/');
          setDiskData(result.data)
  
          setError(null);
        } catch (err) {
          setError(err.message);
          setDiskData(null);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        setModalOpen(props.open);
        getDiskData()
        console.log("USEEFFECT")
      }, [props.open]);

    return (
        <dialog id="edit-disks-modal" open={modalOpen} onClick={props.onClose}>
            <article onClick={e => e.stopPropagation()}>
                <a href="#close"
                aria-label="Close"
                className="close"
                data-target="edit-disks-modal"
                onClick={props.onClose}>
                </a>
                <h3>Edit Disks</h3>
                <p>Here you can rename and hide inidividual disks for the dashboard.</p>

                {loading && <p aria-busy="true"></p>}

                {diskData && !loading &&
                    diskData.map(({device, name, hidden}) => (
                        <div aria-busy={loading} className="" key={device + "-" + name}>
                            <div className="grid">
                                <div><strong>Disk</strong><div><strong>{device}</strong></div></div>
                                <label htmlFor="diskName">
                                    Disk Name
                                    <input type="text" id="diskName" name="diskName" defaultValue={name} placeholder="Disk Name" required />
                                </label>
                                <label htmlFor="diskHidden">
                                    <div>Hidden</div>
                                    <input type="checkbox" id="diskHidden" name="diskHidden" role="switch" defaultValue={hidden ? 0 : 1} />
                                </label>
                            </div>
                        </div>
                    ))}

                <footer>
                <a href="#"
                    role="button"
                    className="secondary"
                    data-target="edit-disks-modal"
                    onClick={props.onClose}>
                    Cancel
                </a>
                <a href="#"
                    role="button"
                    data-target="edit-disks-modal"
                    onClick={doLog}>
                    Save
                </a>
                </footer>
            </article>
        </dialog>
    )
}

export default DiskOrgaModal




