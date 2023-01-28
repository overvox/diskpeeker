import React, {useState, useEffect} from 'react'
import DiskUsageBar from './DiskUsageBar';

function bytesToGigaBytes(bytes) {
  return (bytes / 1_073_741_824).toFixed(0);
}

const Diskpeeker = (props) => {
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
                <div aria-busy={loading} className="diskContainer" key={device + "-" + name}>
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
                  <a href="#" onClick={props.onRefesh} role="button" aria-busy={loading}>Refresh</a>
                </div>
                }
              </article>
          </section>
      );
};

export default Diskpeeker