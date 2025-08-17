// Haversine formula : to calculate distance between 2 gps co-ords

export const haverSineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (x:number)=>(x* Math.PI)/180
    
    const R = 6371000 // Radius of Earth
    const dLat = toRad(lat2-lat1);
    const dlon = toRad(lon2-lon1);

    const sinDLatOver2 = Math.sin(dLat / 2);
    const sinDLonOver2 = Math.sin(dlon / 2);
    const cosLat1 = Math.cos(toRad(lat1));
    const cosLat2 = Math.cos(toRad(lat2));
    const a = sinDLatOver2 * sinDLatOver2 +
              cosLat1 * cosLat2 * sinDLonOver2 * sinDLonOver2;
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R*c;
}