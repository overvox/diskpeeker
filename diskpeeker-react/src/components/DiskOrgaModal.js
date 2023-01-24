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
                <p>
                Cras sit amet maximus risus. 
                Pellentesque sodales odio sit amet augue finibus pellentesque. 
                Nullam finibus risus non semper euismod.
                </p>

                {diskData &&
                    diskData.map(({device, name, hidden}) => (
                        <div aria-busy={loading} className="diskContainer" key={device + "-" + name}>
                        <strong>{name}</strong>
                        <div className="grid">
                            <div>
                            <div className="margin1" >{device}</div>
                            </div>
                            </div>
                        </div>
                    ))};
                <footer>
                <a href="#cancel"
                    role="button"
                    className="secondary"
                    data-target="edit-disks-modal"
                    onClick={doLog}>
                    Cancel
                </a>
                <a href="#confirm"
                    role="button"
                    data-target="edit-disks-modal"
                    onClick={doLog}>
                    Confirm
                </a>
                </footer>
            </article>
        </dialog>
    )
}

export default DiskOrgaModal




