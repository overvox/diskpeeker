import React from 'react'

function DiskUsageBar(props) {
    let usedPercent = props.used / props.total;
    return (
        <progress value={usedPercent} max="1"></progress>
    )
}

export default DiskUsageBar