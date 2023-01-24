import React, {useState, useEffect} from 'react'
import axios from "axios"
import DiskUsageBar from './DiskUsageBar';

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
    
        // await Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
        //   .then(([{data: diskinfo}, {data: diskusage}]) => {
        //     setDiskData(diskinfo);
        //     setDiskUsage(diskusage);
            
        //     diskinfo.forEach(info => {
        //       console.log(info);
        //       //info.concat(diskusage.find(usage => usage.device === info.device))
        //     });
        //   })

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
          <section id='grid'>
            <article>
            {loading && !diskData && <p aria-busy="true"></p>}

            {error && !loading && (<div>{`There is a problem fetching the disk data - ${error}`}</div>)}

            {diskData &&
              diskData.filter(isDiskVisible).map(({device, name, type, total, used, hidden}) => (
                <div aria-busy={loading} className="diskContainer" key={device + "-" + name}>
                  <strong>{!loading && name}</strong>
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