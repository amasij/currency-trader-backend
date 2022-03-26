export const print = (v: any,y?:any) => console.log(v,y||'');


export const copyProperties = <T>(from:T,to:T):void =>{
    Object.getOwnPropertyNames(from).forEach(prop=>{
        (to as any)[prop] = (from as any)[prop];
    });
};


export const resolve = async (resolutions:Promise<any>[])=>await Promise.all(resolutions);