import React, {useState, useEffect} from 'react'
import axios from "axios"

function DiskOrgaModal(props) {
    const [modalOpen, setModalOpen] = useState(props.open);

    const [diskData, setDiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

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

    const updateNameChanged = index => e => {
        let newArr = [...diskData];
        newArr[index].name = e.target.value;
        
        setDiskData(newArr);
    }

    const updateVisibilityChanged = index => e => {
        let newArr = [...diskData];
        newArr[index].hidden = !e.target.checked;
        setDiskData(newArr);
    }

    async function saveDiskConfig() {
        setSaving(true);
        var updatedDiskData = diskData.map(disk => ({ id: disk.id, name: disk.name, hidden: disk.hidden }));
        console.log(updatedDiskData);

        await new Promise(r => setTimeout(r, 2000));
        const result = await axios.put('http://localhost:8000/diskinfo/', updatedDiskData);

        setSaving(false);
        props.onClose();
        getDiskData();
    }

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

                {error && !loading && (<div>{`There is a problem fetching the disk data - ${error}`}</div>)}

                {loading && <p aria-busy="true"></p>}

                <table id="diskEditTable">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Disk</th>
                        <th scope="col">Name</th>
                        <th scope="col">Visible</th>

                        </tr>
                    </thead>
                    <tbody>
                        {diskData && !loading &&
                            diskData.map(({device, name, hidden}, index) => (
                                <tr key={device}>
                                    <th scope="row">{index+1}</th>
                                    <td>{device}</td>
                                    <td>
                                        <input type="text" id={device + "NameInput"} name={device + "NameInput"} defaultValue={name} 
                                            onChange={updateNameChanged(index)} placeholder="Disk Name" aria-invalid={!diskData[index].name} required />
                                    </td>
                                    <td>
                                        <label htmlFor="diskVisible">
                                            <input type="checkbox" id={device + "HiddenInput"} name={device + "HiddenInput"} role="switch" onChange={updateVisibilityChanged(index)} checked={!hidden ? true : false} />
                                        </label>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <footer>
                <a href="#"
                    role="button"
                    className="secondary"
                    data-target="edit-disks-modal"
                    onClick={props.onClose}
                    aria-busy={saving}>
                    Cancel
                </a>
                <a href="#"
                    role="button"
                    data-target="edit-disks-modal"
                    onClick={saveDiskConfig}
                    aria-busy={saving}>
                    Save
                </a>
                </footer>
            </article>
        </dialog>
    )
}

export default DiskOrgaModal




