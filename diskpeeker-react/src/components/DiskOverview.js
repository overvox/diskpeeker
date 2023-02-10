import React, {useState, useEffect} from 'react'
import DiskUsageBar from './DiskUsageBar';

function bytesToGigaBytes(bytes) {
  return (bytes / 1_073_741_824).toFixed(0);
}

const DiskOverview = (props) => {
    const [diskData, setDiskData] = useState(props.diskData);
    const [loading, setLoading] = useState(props.loading);

    const isDiskVisible = (disk) => !disk.hidden;

    useEffect(() => {
        setDiskData(props.diskData);
        setLoading(props.loading)
      }, [props.diskData, props.loading]);
      
      return (
          <section id='diskDashboard'>
            <article>
            {loading && !diskData && <p aria-busy="true"></p>}

            {diskData &&
              diskData.filter(isDiskVisible).map(({device, name, type, total, used, hidden}, index) => (
                <div aria-busy={loading} id="diskContainer" key={device + "-" + name}>
                  <strong>{!loading && ((index+1)  + ") " + name)}</strong>
                  <div className="grid">
                    <div>
                      <div className="margin1" >{device}</div>
                      <div className="margin1">{type === "" ? "Unknown" : type}</div>
                    </div> 
                    <div>
                      <div className="margin1">
                        <DiskUsageBar total={total} used={used}>
                        </DiskUsageBar>
                      </div>
                      <div>{bytesToGigaBytes(total-used)} GB free of {bytesToGigaBytes(total)} GB</div>
                    </div>
                  </div>
                </div>
              ))}

              {diskData && 
                <div id="refreshButtonContainer">
                  <div className="grid">
                    <button onClick={props.onRefresh}  aria-busy={loading}>Refresh</button>
                    <button onClick={props.onReconcile} className="contrast" aria-busy={loading}>Reconcile</button>
                  </div>
                </div>
                }
              </article>
          </section>
      );
};

export default DiskOverview