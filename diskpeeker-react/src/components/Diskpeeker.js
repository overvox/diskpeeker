import React, {useState, useEffect} from 'react'
import axios from "axios"
import DiskUsageBar from './DiskUsageBar';
import DiskApi from '../App'

function bytesToGigaBytes(bytes) {
  return (bytes / 1073741824).toFixed(0);
}

const Diskpeeker = () => {
    const [diskData, setDiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDiskData = async () => {
      try {
        setLoading(true)
        await new Promise(r => setTimeout(r, 100));
        const result = await axios('http://localhost:8000/diskinfo/full/');
        setDiskData(result.data)

        setError(null);
      } catch (err) {
        setError(err.message);
        setDiskData(null);
      } finally {
        setLoading(false);
      }
    };

    const isDiskVisible = (diskData) => !diskData.hidden;

    useEffect(() => {
        getDiskData();
      }, []);
      
      return (
          <section id='diskDashboard'>
            <article>
            {loading && !diskData && <p aria-busy="true"></p>}

            {error && !loading && (<div>{`There is a problem fetching the disk data - ${error}`}</div>)}

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
                  <a href="#" onClick={getDiskData} role="button" aria-busy={loading}>Refresh</a>
                </div>
                }
              </article>
          </section>
      );
}

export default Diskpeeker