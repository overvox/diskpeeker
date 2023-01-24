import React, {useState, useEffect} from 'react'

function doLog() {
    console.log("click")
}

function DiskOrgaModal(props) {
    const [modalOpen, setModalOpen] = useState(props.open);

    useEffect(() => {
        setModalOpen(props.open)
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




