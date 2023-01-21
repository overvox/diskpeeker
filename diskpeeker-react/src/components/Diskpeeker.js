import React, {useState, useEffect} from 'react'
import axios from "axios"
import DiskUsageBar from './DiskUsageBar';

const Diskpeeker = () => {
    const [diskData, setDiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isDiskHidden = (diskData) => diskData.hidden;
    const isDiskVisible = (diskData) => !diskData.hidden;

    useEffect(() => {
        const getDiskData = async () => {
          try {
            await new Promise(r => setTimeout(r, 1000));
            const result = await axios('http://localhost:8000/diskinfo/full_diskinfo/');
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
        getDiskData();
      }, []);
      
      return (
        <main className='container'>
          <section>
            <article>
            {loading && <p aria-busy="true"></p>}

            {error && (<div>{`There is a problem fetching the disk data - ${error}`}</div>)}

            {diskData &&

              diskData.filter(isDiskVisible).map(({device, name, type, total, used, hidden}) => (
                <div className="grid" key={device + "-" + name}>
                  <p>{name}</p>
                  <p>{device}</p> 
                  <p>{type === "" ? "Unknown" : type}</p>
                  <p><DiskUsageBar total={total} used={used}></DiskUsageBar></p>
                  <p>{hidden ? "Hidden" : "Visible"}</p> 
                </div>
              ))}

            {diskData &&
              diskData.filter(isDiskHidden).map(({ device, name, type, total, used, hidden}) => (
                <div className="grid" key={device + "-" + name}>
                  <p>{name}</p> 
                  <p>{device}</p> 
                  <p>{type === "" ? "Unknown" : type}</p>
                  <p><DiskUsageBar total={1} used={0}></DiskUsageBar></p>
                  <p>{hidden ? "Hidden" : "Visible"}</p> 
                </div>
              ))}
              </article>
          </section>
        </main>
      );
}

export default Diskpeeker