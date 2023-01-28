import React from 'react'

function DiskUsageBar(props) {
    let usedPercent = props.used / props.total;
    return (
        <progress value={usedPercent ? usedPercent : 0} max="1"></progress>
    )
}

export default DiskUsageBar